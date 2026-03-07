import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import type { PostStatus } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const role = user.role;
    if (role !== "TECHADMIN" && role !== "ADMIN" && role !== "VERIFIED") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      postId,
      approval,
      status,
      approvedClaimId,
      disposalTitle,
      disposalDescription,
      disposalHow,
    } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        branchId: true,
        postAddress: { select: { orgnization: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (role === "VERIFIED") {
      if (!post.branchId) {
        return NextResponse.json(
          { error: "You can only update posts that belong to a branch" },
          { status: 403 }
        );
      }
      const userHasBranch = await prisma.userBranch.findFirst({
        where: { userId, branchId: post.branchId },
      });
      if (!userHasBranch) {
        return NextResponse.json(
          { error: "You do not manage this branch" },
          { status: 403 }
        );
      }
    }

    if (status === "APPROVED") {
      if (!approvedClaimId || typeof approvedClaimId !== "string") {
        return NextResponse.json(
          { error: "approvedClaimId is required when setting status to APPROVED" },
          { status: 400 }
        );
      }
      const claim = await prisma.claim.findFirst({
        where: { id: approvedClaimId, postId, temporaryDeletion: false },
      });
      if (!claim) {
        return NextResponse.json(
          { error: "Claim not found or does not belong to this post" },
          { status: 400 }
        );
      }
    }

    if (status === "DISPOSED") {
      if (
        disposalTitle === undefined &&
        disposalDescription === undefined &&
        disposalHow === undefined
      ) {
        return NextResponse.json(
          {
            error:
              "disposalTitle, disposalDescription, or disposalHow is required when setting status to DISPOSED",
          },
          { status: 400 }
        );
      }
    }

    const updateData: {
      approval?: boolean;
      status?: PostStatus;
      approvedClaimId?: string | null;
      disposalTitle?: string | null;
      disposalDescription?: string | null;
      disposalHow?: string | null;
    } = {};

    if (approval !== undefined) updateData.approval = Boolean(approval);
    if (status !== undefined) {
      const valid: PostStatus[] = ["PENDING", "APPROVED", "DISPOSED", "CANCELLED"] as const;
      if (!valid.includes(status as PostStatus)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (status === "APPROVED" && approvedClaimId !== undefined)
      updateData.approvedClaimId = approvedClaimId;
    if (status === "DISPOSED") {
      if (disposalTitle !== undefined) updateData.disposalTitle = disposalTitle ?? null;
      if (disposalDescription !== undefined)
        updateData.disposalDescription = disposalDescription ?? null;
      if (disposalHow !== undefined) updateData.disposalHow = disposalHow ?? null;
    }
    if (status === "CANCELLED") {
      updateData.status = "CANCELLED";
    }

    const cacheKey = post.postAddress?.[0]?.orgnization;
    if (cacheKey) {
      const isCached = await redis.exists(cacheKey);
      if (isCached) {
        await redis.del(cacheKey);
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
