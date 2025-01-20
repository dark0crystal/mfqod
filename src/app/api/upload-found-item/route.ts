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
        
      },
      select:{
        id:true
      }
    });

    // Create a new post in the database
    const newAddress = await prisma.address.create({
        data: {
          postId:newPost.id,
          place:body.place,
          country :body.country,
          orgnization :body.orgnization
          
        },
        
      });


    // Return the new post ID in the response
    return NextResponse.json({ message: "Post created successfully", postId: newPost.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}


//Note : when the user requests to update or modify his post , then 
// don't forget to search the cache for any similar post using the postId


// PATCH is used to apply partial updates to a resource, 
// meaning that only the fields that need to be changed are sent in the request body.
//  PUT is used to replace the entire resource with a new representation,
//  meaning that all the fields of the resource are sent in the request body, even if they 
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma instance
// import { supabase } from "@/lib/supabase";

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    console.log("from the back end",body)
    const { 
      id, // Post ID
      title, 
      content, 
      type, 
      place, 
      country, 
      orgnization, 
      imageUrls 
    } = body;

    // Validate required fields
    if (!id || !title) {
      return NextResponse.json({ error: "Post ID and title are required" }, { status: 400 });
    }

    // Update the post data
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        type,
      },
    });

    // Update the address if provided
    if (place || country || orgnization) {
      const existingAddress = await prisma.address.findFirst({
        where: { postId: id },
      });

      if (existingAddress) {
        // Update the existing address
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            place,
            country,
            orgnization,
          },
        });
      } else {
        // Create a new address if it doesn't exist
        await prisma.address.create({
          data: {
            place,
            country,
            orgnization,
            postId: id,
          },
        });
      }
    }

    // Update post photos if imageUrls are provided
    if (imageUrls && Array.isArray(imageUrls)) {
      // Delete existing photos for the post
      await prisma.postPhotos.deleteMany({
        where: { postId: id },
      });

      // Add new photos
      const photoPromises = imageUrls.map((url: string) =>
        prisma.postPhotos.create({
          data: {
            postId: id,
            postUrl: url,
          },
        })
      );
      await Promise.all(photoPromises);
    }

    return NextResponse.json(
      { message: "Post updated successfully", updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
