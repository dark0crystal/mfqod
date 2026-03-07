import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { z } from "zod";
import { sendEmail, isEmailConfigured } from "@/lib/email";

const createMessageSchema = z.object({
  body: z.string().min(1),
});

export async function POST(
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
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const isStaff = user.role === "ADMIN" || user.role === "TECHADMIN";
  const isOwner = ticket.userId === session.user.id;

  if (!isStaff && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isStaff && ticket.status === "CLOSED") {
    return NextResponse.json(
      { error: "Cannot reply to a closed ticket. Reopen it first." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        userId: session.user.id,
        body: parsed.data.body,
        isStaffReply: isStaff,
      },
    });

    if (isStaff && ticket.status === "OPEN") {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "IN_PROGRESS" },
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    const ticketUrl = baseUrl ? `${baseUrl}` : "";

    if (isEmailConfigured()) {
      if (isStaff) {
        await sendEmail({
          to: ticket.user.email,
          subject: `New reply on your ticket: ${ticket.subject}`,
          text: `You have a new reply on your support ticket.\n\nSubject: ${ticket.subject}\n\n${ticketUrl ? `Log in to the dashboard to view your ticket: ${ticketUrl}` : "Log in to the dashboard to view your ticket."}`,
          html: ticketUrl
            ? `<p>You have a new reply on your support ticket.</p><p><strong>Subject:</strong> ${ticket.subject}</p><p><a href="${ticketUrl}">Log in to the dashboard</a></p>`
            : undefined,
        });
      } else if (process.env.ADMIN_EMAIL || process.env.SUPPORT_EMAIL) {
        const adminEmails = [process.env.ADMIN_EMAIL, process.env.SUPPORT_EMAIL]
          .filter(Boolean) as string[];
        if (adminEmails.length) {
          await sendEmail({
            to: adminEmails,
            subject: `New activity on ticket #${ticketId.slice(-8)}: ${ticket.subject}`,
            text: `A user replied to a ticket.\n\nSubject: ${ticket.subject}\n\n${ticketUrl ? `View: ${ticketUrl}` : ""}`,
          });
        }
      }
    }
  } catch (e) {
    console.error("Error creating ticket message:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  const updated = await prisma.ticket.findUnique({
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

  return NextResponse.json(updated!);
}
