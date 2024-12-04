import { auth } from "../../../../auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface NewItem {
  title: string;
  content: string;
  type: string;
  place: string;
  country: string;
  orgnization: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as NewItem;
  const session = await auth();

  // Ensure that the user is authenticated before posting
  if (!session?.user?.id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    // Create a new post in the database
    const newPost = await prisma.post.create({
      data: {
        userId: session.user.id,
        title: body.title,
        content: body.content,
        type: body.type,
        // You can add other fields like 'place', 'country', etc. as needed
      },
    });

    // Return the new post ID in the response
    return NextResponse.json({ message: "Post created successfully", postId: newPost.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
