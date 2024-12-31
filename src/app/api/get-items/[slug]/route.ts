import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import {redis} from "@/lib/redis"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }){
    const itemId = params.slug;

     // Validate the adminPlaceId
  if (!itemId || typeof itemId !== 'string') {
    return new Response('Invalid or missing adminPlaceId', { status: 400 });
  }

  try {
    const cachedValue = await redis.get(itemId);
    if(cachedValue){
      console.log(cachedValue)
      const post = cachedValue
      return NextResponse.json({ post });
    }
    // Fetch the place from the database
    const post = await prisma.post.findUnique({
      where: {
        id: itemId,
      },
    });

    // if(!post){
    //   return new Response('Place not found', { status: 404 });
    // }
    //cache value=====
    await redis.set(itemId, JSON.stringify(post))
  // ==========

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

// Additional feature : is to allow the user to get all the posts in his orgnization , 
// Using the place name , also use cache for that.


// 1- fetching all posts related to place name .
// 2- cache all the posts 
// 3- if there is a place added , then add it to the cache DB
// 4- Don't forget to put a period for termination
