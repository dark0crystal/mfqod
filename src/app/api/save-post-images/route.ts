
import prisma from "@/lib/db";
import { NextResponse , NextRequest } from "next/server";

export async function POST(req : NextRequest){
    try{
        const { postId, imageUrls } =await req.json();
        // Check if postId and imageUrls are provided
        console.log(postId)
        console.log(imageUrls[0])
        if (!postId || !Array.isArray(imageUrls)) {
            return NextResponse.json({ error: 'Invalid input data' },{status : 400});
          }
          console.log(postId)
           // Insert image URLs into the PostPhotos table
           const photoPromises = imageUrls.map((url) =>
            prisma.postPhotos.create({
              data: {
                postId,
                postUrl: url,
              },
            })
          );
          // Wait for all photo entries to be created
          await Promise.all(photoPromises);

         return NextResponse.json({ message: 'Image URLs saved successfully' },{status:200});
    }catch(error){
        console.error('Error saving images:', error);
      NextResponse.json({ error: 'Failed to save image URLs' },{status:500});
    }
   

}