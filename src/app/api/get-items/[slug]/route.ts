import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: itemId } = await params;

  if (!itemId || typeof itemId !== "string") {
    return new Response("Invalid or missing itemId", { status: 400 });
  }

  try {
    // Check the cache for the item
    // const cachedValue = await redis.get(itemId);
    // if (cachedValue) {
    //   console.log("Cache hit in details:", cachedValue);

    //   return NextResponse.json(JSON.parse(cachedValue));
    // }

    // Fetch the post from the database with additional details
    const post = await prisma.post.findUnique({
      where: {
        id: itemId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
        approvedClaim: {
          select: {
            id: true,
            claimTitle: true,
            claimContent: true,
            user: { select: { id: true, name: true, email: true } },
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
      status: post.status,
      approvedClaimId: post.approvedClaimId,
      disposalTitle: post.disposalTitle,
      disposalDescription: post.disposalDescription,
      disposalHow: post.disposalHow,
      approvedClaim: post.approvedClaim,
      createdAt: post.createdAt,
      author: post.author
        ? {
            id: post.author.id,
            name: post.author.name,
            email: post.author.email,
            image: post.author.image,
          }
        : null,
      authorEmail: post.author?.email ?? null,
      images: post.uploadedPostPhotos.map((photo) => photo.postUrl),
      address: post.postAddress.map((address) => ({
        place: address.place,
        country: address.country,
        orgnization: address.orgnization,
      })),
    };

    // Cache the formatted response
    // await redis.set(itemId, JSON.stringify(responseData), 'EX', 3600);

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
