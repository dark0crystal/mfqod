import prisma from "@/lib/db"; // Adjust the path to your Prisma client
import { redis } from "@/lib/redis"; // Adjust the path to your Redis client
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    if(postId == null) return null;


  try {
    // Check the cache for claims
    const cachedClaims = await redis.get(postId);
    if (cachedClaims) {
      console.log("Cache hit:", cachedClaims);
      return NextResponse.json(JSON.parse(cachedClaims));
    }

    // Fetch claims and their images from the database
    const claims = await prisma.claim.findMany({
      where: { 
        postId:postId,
        temporaryDeletion: false
     }, // Exclude temporarily deleted claims
      include: {
        uploadedClaimPhotos: {
          select: {
            photoUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!claims || claims.length === 0) {
      return new Response("No claims found", { status: 404 });
    }

    // Format the claims data
    const formattedClaims = claims.map((claim) => ({
      id: claim.id,
      claimTitle: claim.claimTitle,
      claimContent: claim.claimContent,
      createdAt: claim.createdAt,
      userId: claim.userId,
      user: claim.user,
      images: claim.uploadedClaimPhotos.map((photo) => photo.photoUrl),
    }));

    // Cache the formatted claims
    await redis.set(postId, JSON.stringify(formattedClaims), "EX", 3600); // Cache for 1 hour

    console.log("Fetched claims from database");
    return NextResponse.json(formattedClaims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
