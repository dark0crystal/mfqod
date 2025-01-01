import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const itemId = params.slug;

  // Validate the itemId
  if (!itemId || typeof itemId !== "string") {
    return new Response("Invalid or missing itemId", { status: 400 });
  }

  try {
    // Check the cache for the item
    const cachedValue = await redis.get(itemId);
    if (cachedValue) {
      console.log("Cache hit in details:", cachedValue);

      // Parse the cached value and return it
      const cachedPost = JSON.parse(cachedValue);
      return NextResponse.json({ post: cachedPost });
    }

    // Fetch the post from the database
    const post = await prisma.post.findUnique({
      where: {
        id: itemId,
      },
    });

    // If no post is found, return a 404 response
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Cache the fetched post as a string
    await redis.set(itemId, JSON.stringify(post));

    // Return the post as JSON
    console.log("Fetched from database:", post.title);
    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
