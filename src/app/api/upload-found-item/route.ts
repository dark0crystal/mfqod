import { auth } from "../../../../auth";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
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

      await redis.del(body.orgnization);

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

// export async function PATCH(req: NextRequest) {
//   try {
//     const { data, postId } = await req.json();

//     if (!postId || !data.title) {
//       return NextResponse.json({ error: "Post ID and title are required" }, { status: 400 });
//     }

//     const updatedPost = await prisma.post.update({
//       where: { id: postId },
//       data: {
//         title: data.title,
//         content: data.content,
//         type: data.type,
//       },
//     });

//     if (data.place || data.country || data.orgnization) {
//       await prisma.address.upsert({
//         where: { postId },
//         update: {
//           place: data.place,
//           country: data.country,
//           orgnization: data.orgnization,
//         },
//         create: {
//           postId,
//           place: data.place,
//           country: data.country,
//           orgnization: data.orgnization,
//         },
//       });
//     }

//     return NextResponse.json({ message: "Post updated successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating post:", error);
//     return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
//   }
// }
