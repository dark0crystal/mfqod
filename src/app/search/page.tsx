"use client";
import Image1 from "../../../public/img1.jpeg"
import { MdArrowOutward } from "react-icons/md";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";  // Import Zod for validation
import { zodResolver } from "@hookform/resolvers/zod";  // Import Zod resolver
import { useRouter } from "next/navigation";  // Import useRouter for page navigation
import { useSession } from "next-auth/react";  // Import useSession for user session
import Image from "next/image";

// Define Zod validation schema
const schema = z.object({
  item: z.string().min(1, { message: "The Field is required!" }),
  place: z.string().min(1, { message: "Please select a place" }),
});

type FormFields = {
  item: string;
  place: string;
};

export default function Search() {
  const [items, setItems] = useState<any[]>([]);  // State to hold fetched items
  const router = useRouter();  // To navigate to the details page
  const session = useSession();

  // Fetch posts based on item and place
  const fetchItems = async (item: string, place: string) => {
    try {
      const response = await fetch(`/api/get-items?item=${item}&place=${place}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data); // Set the fetched data to state
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // UseForm hook with Zod for form validation
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);

    // Fetch items based on form data
    await fetchItems(data.item, data.place);
    reset();  // Reset form
  };

  // Handle post click to navigate to details
  const handlePostClick = (postId: string) => {
    router.push(`/find/${postId}`);
  };

  return (
    <div className="relative h-full w-full bg-white">
    {/* Dotted Background */}
    <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>
  
    {/* Foreground Content */}
    <div className="relative z-10 flex flex-col mt-6 items-center">
      <h1>{session.data?.user?.id}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row justify-center">
        <div>
          <input
            id="item"
            {...register("item")}
            type="text"
            placeholder="هيش مغيّب ؟"
            className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.item && <p className="mt-2 text-xs text-red-500">{errors.item.message}</p>}
        </div>
        <div>
          <select
            id="place"
            {...register("place")}
            defaultValue=""
            className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>هين تدرس؟</option>
            <option value="SQU">SQU</option>
            <option value="UTAS Muscat">UTAS Muscat</option>
            <option value="UTAS Nizwa">UTAS Nizwa</option>
            <option value="UTAS Ibra">UTAS Ibra</option>
            <option value="NIZWA Uni">NIZWA Uni</option>
          </select>
          {errors.place && <p className="mt-2 text-xs text-red-500">{errors.place.message}</p>}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
  
      {/* Display the fetched posts */}
      <div className="w-screen p-6 mt-6 flex items-center flex-col">
        <h3 className="text-xl font-semibold mb-6 text-indigo-800">Fetched Items</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-12">
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-white min-w-[350px] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Content Section */}
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.content}</p>
                </div>
  
                {/* Footer Section */}
                <div className="flex items-center justify-between py-2 px-4">
                  <p className="text-gray-600 text-sm">
                    Location: {item.address?.place}, {item.address?.country}
                  </p>
                </div>
  
                {/* Image Section */}
                <div className="relative h-[250px] m-3">
                  {item.imageUrls.length > 0 ? (
                    <div>
                      <button
                        title="arrow to detailed page"
                        onClick={() => handlePostClick(item.id)}
                        className="absolute bottom-2 right-2 p-3 bg-white z-20 text-black text-xl rounded-full hover:bg-indigo-200 transition-colors shadow-md"
                      >
                        <MdArrowOutward />
                      </button>
                      <Image
                        src={item.imageUrls[0]} // Display the first image
                        alt={`Image ${index}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-2xl"
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        title="arrow to detailed page"
                        onClick={() => handlePostClick(item.id)}
                        className="absolute bottom-2 right-2 p-3 bg-white z-20 text-black text-xl rounded-full hover:bg-indigo-200 transition-colors shadow-md"
                      >
                        <MdArrowOutward />
                      </button>
                      <Image
                        src="/images/default-image.jpg"
                        alt="Default Image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-2xl"
                      />
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found.</p>
          )}
        </div>
      </div>
    </div>
  </div>
  
  
  );
}

