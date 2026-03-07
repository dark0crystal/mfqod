import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { z } from "zod";
import type { TicketStatus, TicketType } from "@prisma/client";

const createTicketSchema = z.object({
  subject: z.string().min(1).max(500),
  body: z.string().min(1),
  type: z.enum(["SUBSCRIPTION", "PROBLEM_REPORT", "SUPPORT", "OTHER"]),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as TicketStatus | null;
  const type = searchParams.get("type") as TicketType | null;
  const search = searchParams.get("search") ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10) || 0;

  const isStaff = user.role === "ADMIN" || user.role === "TECHADMIN";

  const where: {
    userId?: string;
    status?: TicketStatus;
    type?: TicketType;
    OR?: { subject?: { contains: string; mode: "insensitive" }; body?: { contains: string; mode: "insensitive" }; user?: { email?: { contains: string; mode: "insensitive" } } }[];
  } = {};

  if (!isStaff) {
    where.userId = session.user.id;
  }
  if (status && ["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
    where.status = status;
  }
  if (type && ["SUBSCRIPTION", "PROBLEM_REPORT", "SUPPORT", "OTHER"].includes(type)) {
    where.type = type;
  }
  if (search.trim()) {
    const q = search.trim();
    where.OR = [
      { subject: { contains: q, mode: "insensitive" as const } },
      { body: { contains: q, mode: "insensitive" as const } },
      ...(isStaff ? [{ user: { email: { contains: q, mode: "insensitive" as const } } }] : []),
    ];
  }

  try {
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { ticketMessages: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.ticket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      total,
    });
  } catch (e) {
    console.error("Error fetching tickets:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        userId: session.user.id,
        subject: parsed.data.subject,
        body: parsed.data.body,
        type: parsed.data.type,
        status: "OPEN",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        userId: session.user.id,
        body: parsed.data.body,
        isStaffReply: false,
      },
    });

    return NextResponse.json(ticket);
  } catch (e) {
    console.error("Error creating ticket:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
