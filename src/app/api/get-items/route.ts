// import prisma from "@/lib/db";
// import { NextResponse } from 'next/server';
// export async function POST(){
//     const res = await prisma.post.findMany();


//     if (!res) {
//         return new Response('Place not found', { status: 404 });
//       }

//       return NextResponse.json({ res });


// }
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/** 
 * @method POST 
 * @route ~/api/get-items
 * @description get all items or posts with same body data
*/

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;  // Access query parameters

  const item = searchParams.get("item") || '';  // Get item from query params (default to empty string)

  // Build a filter object for Prisma based on the query parameter
  const filter: any = {};

  // Partial search for 'item' using the `contains` operator (case-insensitive)
  if (item) {
    filter.title = { contains: item, mode: "insensitive" };  // Partial match, case-insensitive
  }

  try {
    // Perform the database query with the filter applied
    const data = await prisma.post.findMany({
      where: filter,  // Apply the filter to the database query
    });
    return NextResponse.json(data, { status: 200 });  // Return the filtered data
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}



// export async function POST(req:NextRequest){
//     const body  = await req.json();

// }