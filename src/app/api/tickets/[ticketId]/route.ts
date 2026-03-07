import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { z } from "zod";
import type { TicketStatus } from "@prisma/client";

const patchTicketSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticketId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      ticketMessages: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const isStaff = user.role === "ADMIN" || user.role === "TECHADMIN";
  if (!isStaff && ticket.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticketId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, userId: true, status: true },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const isStaff = user.role === "ADMIN" || user.role === "TECHADMIN";
  const isOwner = ticket.userId === session.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const newStatus = parsed.data.status;

  if (newStatus === "CLOSED") {
    if (!isStaff) {
      return NextResponse.json({ error: "Only staff can close tickets" }, { status: 403 });
    }
  }

  if (newStatus === "OPEN" && ticket.status === "CLOSED") {
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: "Only owner or staff can reopen" }, { status: 403 });
    }
  }

  const updateData: { status?: TicketStatus; reopenedAt?: Date } = {};
  if (newStatus) updateData.status = newStatus;
  if (newStatus === "OPEN" && ticket.status === "CLOSED") {
    updateData.reopenedAt = new Date();
  }

  try {
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        ticketMessages: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("Error updating ticket:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
