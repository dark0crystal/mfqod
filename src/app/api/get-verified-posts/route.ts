import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/db";
import {auth} from "../../../../auth"
  // according the given userId the API endpoint will return the appropiate posts for that user 
  // the endpoit will check for the user address , and show the posts that have the same address
  // For Admin will show all the posts
  // For manager , first will check the manager given address , then will get the posts related 
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url); // Get query parameters from the request URL
  const userId = searchParams.get('id');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
    const userRole = await prisma.user.findUnique({
        where:{
            id:userId
        },
        select:{
            role:true
        }
    })
 const role = userRole?.role
console.log(role)
  try {
    if(role =="VERIFIED"){
    // Fetch the user's address (place) from the Manage table (using findUnique, not findMany)
    const userManage = await prisma.manage.findFirst({
      where: { userId: userId }, // Match by userId in the Manage table
      select: { place: true } // Select the 'place' field (address)
    });

    if (!userManage || !userManage.place) {
      return NextResponse.json({ error: 'User address (place) not found' }, { status: 404 });
    }

    const userAddress = userManage.place; // Extract the address from the first result

    // Find posts that have the same address as the user's address
    const posts = await prisma.post.findMany({
      where: {
        postAddress: {
          some: {
            place: userAddress // Match the 'place' field in Address with the user's address
          }
        }
      },
      include: {
        postAddress: true, // Include related address details in the result
      }
    });
    console.log({ userAddress,role, posts}); // Optional for debugging
    return NextResponse.json({userAddress, role, posts});
    }else if(role =="ADMIN" || role=="TECHADMIN" ){
        const posts= await prisma.post.findMany({
            where:{
                userId:userId
            }
        })
        console.log({role, posts});
       return NextResponse.json({role, posts})
    }else{
       return NextResponse.json("Not Allowed To Access")
    }
    

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: 'An error occurred while fetching posts' }, { status: 500 });
  }
}



export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url); // Get query parameters from the request URL
    const postId = searchParams.get('postId');
console.log(postId)
// console.log(temporaryDeletion)
  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  try {
    // Update the post's temporaryDeletion field to hide the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        temporaryDeletion: true, // Update the post's temporaryDeletion field
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'An error occurred while updating the post' }, { status: 500 });
  }
}


export async function DELETE(req :NextRequest){

}   