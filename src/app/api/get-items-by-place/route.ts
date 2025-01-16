import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgName = searchParams.get("orgName") ?? ""; // Place name parameter for filtering posts

  try {
    // Check if posts for the given place are already cached
    const cachedValue = await redis.get(orgName);
    if (cachedValue) {
      console.log("Cache hit:", orgName);
      return NextResponse.json(JSON.parse(cachedValue));
    }

    console.log("Cache miss. Fetching from database:", orgName);

    // Fetch posts from the database
    const posts = await prisma.post.findMany({
      where: {
        postAddress: {
          some: {
            place: {
              contains: orgName, // Filter posts by place name
              mode: "insensitive", // Case-insensitive search
            },
          },
        },    
        approval: true, // Only fetch approved posts
        temporaryDeletion: false, // Exclude posts marked for deletion
      },
      include: {
        uploadedPostPhotos: {
          select: {
            postUrl: true, // Include post image URLs
          },
        },
        postAddress: {
          select: {
            place: true, // Include place
            country: true, // Include country
            orgnization: true, // Include organization
          },
        },
      },
    });

    // Map through posts to prepare the response
    const postsWithImages = posts.map((post) => {
      const imageUrls = post.uploadedPostPhotos.length > 0
        ? post.uploadedPostPhotos.map((photo) => photo.postUrl)
        : ['https://ggrrwpwyqbblxoxidpmn.supabase.co/storage/v1/object/public/mfqodFiles/images']; // Default image

      const address = post.postAddress.length > 0 ? post.postAddress[0] : null;

      return {
        ...post,
        imageUrls,
        address: address ? {
          place: address.place,
          country: address.country,
          orgnization: address.orgnization,
        } : null,
      };
    });

    // Cache the results
    await redis.set(orgName, JSON.stringify(postsWithImages), 'EX', 3600); // Cache expires in 1 hour

    console.log("Fetched from database and cached:", orgName);

    return NextResponse.json(postsWithImages);

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
