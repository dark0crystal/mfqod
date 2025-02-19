import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { postId, approval } = await req.json();

    if (!postId || approval === undefined) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // Fetch the post and related address (organization) from the database
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        postAddress: {
          select: { orgnization: true }, // Organization is stored in Address model
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const cacheKey = post.postAddress?.[0]?.orgnization; // Get the organization key

    // If the post's organization exists in cache, delete it
    if (cacheKey) {
      const isCached = await redis.exists(cacheKey);
      if (isCached) {
        await redis.del(cacheKey);
      }
    }

    // Update the post approval status
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { approval },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post approval:", error);
    return NextResponse.json(
      { error: "Failed to update post approval" },
      { status: 500 }
    );
  }
}
