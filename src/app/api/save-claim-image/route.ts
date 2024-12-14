import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { claimId, imageUrls } = await req.json();

    // Validate input data
    if (!claimId || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    console.log("Claim ID from the request:", claimId);
    console.log("First image URL:", imageUrls[0]);

    // Insert image URLs into the ClaimPhotos table
    const photoPromises = imageUrls.map((url: string) =>
      prisma.claimPhotos.create({
        data: {
          claimId: claimId,
          photoUrl: url,
        },
      })
    );

    // Wait for all photo entries to be created
    await Promise.all(photoPromises);

    // Return success response
    return NextResponse.json({ message: 'Image URLs saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving images:', error);
    // Return error response
    return NextResponse.json({ error: 'Failed to save image URLs' }, { status: 500 });
  }
}
