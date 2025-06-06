import { NextResponse, NextRequest } from 'next/server';
import prisma from "@/lib/db";
import {auth} from "../../../../auth"
import { redis } from "@/lib/redis";

  // according the given userId the API endpoint will return the appropiate posts for that user 
  // the endpoit will check for the user address , and show the posts that have the same address
  // For Admin will show all the posts
  // For manager , first will check the manager given address , then will get the posts related 
export async function GET(req: NextRequest) {
   // Extract query parameters from the request URL
   const { searchParams } = new URL(req.url);
   const placeName = searchParams.get('placeName');
   const orgName = searchParams.get('orgName');
  const session = await auth();
  const userId = session?.user?.id
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
//after gitting the user role 
  try {
    if(role =="VERIFIED"){
    // Fetch the user's address (place) from the Manage table (using findUnique, not findMany)

    //Here we should check user managed place again for security purpose 
    const userManage = await prisma.manage.findFirst({
      where: { userId: userId }, // Match by userId in the Manage table
      select: { 
        place: true ,
        orgnization:true
      } // Select the 'place' field (address)
    });

    if (!userManage || !userManage.place) {
      return NextResponse.json({ error: 'User address (place) not found' }, { status: 404 });
    }
    console.log(userManage.place)
    console.log(placeName)
    console.log(userManage.orgnization)
    console.log(orgName)
    if(orgName == userManage.orgnization){
        if(placeName == userManage.place && orgName !=null){       
          const posts = await prisma.post.findMany({
            where: {
              postAddress: {
                some: {
                  place: placeName // Match the 'place' field in Address with the user's address
                }
              }
            },
            include: {
              postAddress: true, 
              uploadedPostPhotos:{
                select: {
                  postUrl: true, // Select only the post URL from uploaded photos
                },
              },// Include related address details in the result
            }
          })

          const userAddress = userManage.place; // Extract the address from the first result
          console.log({ userAddress,role, posts}); // Optional for debugging
          return NextResponse.json({userAddress, role, posts});

    }else if(orgName !=null ){
      const posts = await prisma.post.findMany({
        where: {
          postAddress: {
            some: {
              orgnization: orgName // Match the 'place' field in Address with the user's address
            }
          }
        },
        include: {
          postAddress: true,
          uploadedPostPhotos:{
            select: {
              postUrl: true, // Select only the post URL from uploaded photos
            },
          }, // Include related address details in the result
        }
      })

      const userAddress = userManage.place; // Extract the address from the first result
      console.log("server posts",posts)
      return NextResponse.json({userAddress, role, posts});

    }
    }else{
      return NextResponse.json({ error: 'You are not allowed to access VERIFIED' }, { status: 500 });
    }


    }else if(role =="ADMIN" || role=="TECHADMIN" ){
      // 
      if (orgName) {
        const posts = await prisma.post.findMany({
          where: {
            postAddress: {
              some: {
                orgnization: orgName, // Filter posts where `orgnization` matches the given `orgName`
              },
            },
          },
          include: {
            postAddress: true, // Include address data
            uploadedPostPhotos:{
              select: {
                postUrl: true, // Select only the post URL from uploaded photos
              },
            }, // Include related photos
            author: {
              select: {
                id: true,
                name: true,
              },
            }, // Include author details if needed
          },
        });
        // const userAddress = userManage.place;
        console.log({ posts});
        return NextResponse.json({ role, posts});
      }else{
        return NextResponse.json("Not Allowed To Access admin org")
      }
        
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

    const orgName = await prisma.post.findFirst({
      where: { id: postId },
      select: {
        postAddress: {
          select: {
            orgnization: true
          }
        }
      }
    });

    if(orgName){
    
    if (orgName?.postAddress?.length > 0 && orgName.postAddress[0].orgnization) {
      await redis.del(orgName.postAddress[0].orgnization);
    }
  }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'An error occurred while updating the post' }, { status: 500 });
  }
}


import { supabase } from "@/lib/supabase";

// Endpoint for deleting posts and its related data
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "TECHADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch all associated image URLs
    const postPhotos = await prisma.postPhotos.findMany({
      where: { postId },
      select: { postUrl: true },
    });
    console.log("postPhotos",postPhotos)
    const claimPhotos = await prisma.claimPhotos.findMany({
      where: { claim: { postId } },
      select: { photoUrl: true },
    });
    console.log("claimPhotos",claimPhotos)

    // Delete post photos from Supabase storage
    const postPhotoDeletions = postPhotos.map((photo) => {
      console.log("post phooooooto",photo)
      const relativePath = photo.postUrl?.split("/storage/v1/object/public/mfqodFiles/")[1];
      if (relativePath) {
        
        return supabase.storage.from("mfqodFiles").remove([relativePath]);
      }
    });

    const postPhotoResults = await Promise.all(postPhotoDeletions);

    const failedPostPhotoDeletions = postPhotoResults.filter((res) => res?.error);
    if (failedPostPhotoDeletions.length > 0) {
      console.error("Some post photos failed to delete from Supabase:", failedPostPhotoDeletions);
    } else {
      console.log("All post photos deleted successfully.");
    }

    // Delete claim photos from Supabase storage
    const claimPhotoDeletions = claimPhotos.map((photo) => {
      console.log("claim phooooooto",photo)
      const relativePath = photo.photoUrl?.split("/storage/v1/object/public/mfqodFiles/")[1];
       
        return supabase.storage.from("mfqodFiles").remove([relativePath]);
      
    });

    const claimPhotoResults = await Promise.all(claimPhotoDeletions);

    const failedClaimPhotoDeletions = claimPhotoResults.filter((res) => res?.error);
    if (failedClaimPhotoDeletions.length > 0) {
      console.error("Some claim photos failed to delete from Supabase:", failedClaimPhotoDeletions);
    } else {
      console.log("All claim photos deleted successfully.");
    }

    const orgName = await prisma.post.findFirst({
      where: { id: postId },
      select: {
        postAddress: {
          select: {
            orgnization: true
          }
        }
      }
    });

    if(orgName){
    
    if (orgName?.postAddress?.length > 0 && orgName.postAddress[0].orgnization) {
      await redis.del(orgName.postAddress[0].orgnization);
    }
  }


    // Delete associated database records
    await prisma.$transaction([
      prisma.claimPhotos.deleteMany({
        where: { claim: { postId } },
      }),
      prisma.claim.deleteMany({
        where: { postId },
      }),
      prisma.postPhotos.deleteMany({
        where: { postId },
      }),
      
      prisma.address.deleteMany({
        where: { postId },
      }),
      prisma.post.delete({
        where: { id: postId },
      }),
    ]);

    console.log("Post and related records deleted from the database.");
    

    return NextResponse.json(
      { message: "Post and all related records deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post and related data:", error);
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}
