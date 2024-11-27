import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }){
    const itemId = params.slug;

     // Validate the adminPlaceId
  if (!itemId || typeof itemId !== 'string') {
    return new Response('Invalid or missing adminPlaceId', { status: 400 });
  }

  try {
    // Fetch the place from the database
    const post = await prisma.post.findUnique({
      where: {
        id: itemId,
      },
    });

    // If no place is found, return a 404 response
    if (!post) {
      return new Response('Place not found', { status: 404 });
    }
    console.log("the place ", post.title)
   
    // Return the place as JSON
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching place:', error);
    return new Response('Internal server error', { status: 500 });
  }
}