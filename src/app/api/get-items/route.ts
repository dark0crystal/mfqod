import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("item") ?? ""; // Assuming 'item' is the search parameter for title
  const orgName = searchParams.get("orgName") ?? ""; // Assuming 'place' is the search parameter for place
console.log(orgName)
  // Fetch posts from the database with related postPhotos and addresses
  const posts = await prisma.post.findMany({
    where: {
      title: {
        contains: title, // Filter posts by title (if provided)

      },
      postAddress: {
        some: {
          orgnization: orgName // Match the 'org' field in Address with the user's address
        }
      },
      approval: true, // Only fetch posts that are approved
      temporaryDeletion: false, // Only fetch posts that are not marked for deletion
    },
    include: {
      uploadedPostPhotos: {
        select: {
          postUrl: true, // Select the URL for post images
        },
      },
      postAddress: {
        select: {
          place: true, // Place associated with the post
          country: true, // Country associated with the post
          orgnization: true, // Organization associated with the post
        },
      },
    },
  });

  // Map through the posts and ensure each post has image URLs, or set a default image if none exist
  const postsWithImages = posts.map((post) => {
    const imageUrls = post.uploadedPostPhotos.length > 0
      ? post.uploadedPostPhotos.map((photo) => photo.postUrl) // If post has images, map to image URLs
      : []; // Default image URL if no images are found

    // Check if address exists and prepare the address info
    const address = post.postAddress.length > 0 ? post.postAddress[0] : null;

    return {
      ...post,
      imageUrls,
      address: address ? {
        place: address.place,
        country: address.country,
        orgnization: address.orgnization,
      } : null,
    };
  });

  // Return the posts with images and address information
  return NextResponse.json(postsWithImages);
}
