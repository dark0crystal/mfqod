"use client";
import Image1 from "../../../public/img1.jpeg"
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
    <div className="flex flex-col mt-6 items-center">
      <h1>{session.data?.user?.id}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row justify-center">
        <div>
          <input
            id="item"
            {...register("item")}
            type="text"
            placeholder="هيش مغيّب ؟ "
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
      <div className="w-full max-w-2xl p-6 mt-6 bg-violet-100 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-indigo-800">Fetched Items</h3>
        <div className="space-y-6">
          {items.length > 0 ? (
            items.map((item: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-[450px]">
                <button
                  onClick={() => handlePostClick(item.id)}
                  className="w-full text-left text-indigo-600 hover:text-indigo-800"
                >
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-gray-600">{item.content}</p>
                  <p className="text-sm text-gray-500">Location: {item.address?.place}, {item.address?.country}</p>

                  {/* Display images */}
                  <div className="mt-4 h-[300px] relative">
                    {item.imageUrls.length > 0 ? (
                      item.imageUrls.map((url: string, idx: number) => (
                        <Image
                          key={idx}
                          src={url}
                          alt={`Image ${idx}`}
                          layout="fill" // Cover the available space
                          objectFit="cover" // Ensure image covers the space without distortion
                          className="rounded-md shadow-sm"
                        />
                      ))
                    ) : (
                      <Image
                        src="/images/image1.jpg"
                        alt="Default Image"
                        layout="fill" // Cover the available space
                        objectFit="cover" // Ensure image covers the space without distortion
                        className="rounded-md shadow-sm"
                      />
                    )}
                  </div>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

