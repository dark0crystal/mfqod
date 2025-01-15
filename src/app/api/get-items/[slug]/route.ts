import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const itemId = params.slug;

  if (!itemId || typeof itemId !== "string") {
    return new Response("Invalid or missing itemId", { status: 400 });
  }

  try {
    // Check the cache for the item
    const cachedValue = await redis.get(itemId);
    if (cachedValue) {
      console.log("Cache hit in details:", cachedValue);

      return NextResponse.json(JSON.parse(cachedValue));
    }

    // Fetch the post from the database with additional details
    const post = await prisma.post.findUnique({
      where: {
        id: itemId,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
        uploadedPostPhotos: {
          select: {
            postUrl: true,
          },
        },
        postAddress: {
          select: {
            place: true,
            country: true,
            orgnization: true,
          },
        },
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Format the response
    const responseData = {
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      temporaryDeletion: post.temporaryDeletion,
      approval: post.approval,
      createdAt: post.createdAt,
      authorEmail: post.author.email,
      images: post.uploadedPostPhotos.map((photo) => photo.postUrl),
      address: post.postAddress.map((address) => ({
        place: address.place,
        country: address.country,
        orgnization: address.orgnization,
      })),
    };

    // Cache the formatted response
    await redis.set(itemId, JSON.stringify(responseData), 'EX', 3600);

    // Return the response as JSON
    console.log("Fetched from database:", responseData.title);
    console.log("not cached",responseData
    )
    return NextResponse.json( responseData );
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
