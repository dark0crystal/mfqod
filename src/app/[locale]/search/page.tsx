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
import SliderBar from "./Slider";
import DisplayPosts from "./DisplayPosts";

// Define Zod validation schema
const schema = z.object({
  item: z.string().min(1, { message: "The Field is required!" }),
  place: z.string().min(1, { message: "Please select a place" }),
});

type FormFields = {
  item: string;
  place: string;
};

export const orgName = ["SQU","UTAS Muscat", "UTAS Ibra","Bin Omair Library" , "UTAS Nizwa"]

export default function Search() {
  const [items, setItems] = useState<any[]>([]);  // State to hold fetched items
  const router = useRouter();  // To navigate to the details page
  const session = useSession();

   const [currentName, setCurrentName] = useState(orgName[0]); // Set initial name
  
    const handleClick =async(name:string) => {
      setCurrentName(name);
      await fetchItemByPlace(name)
    };

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

    // Fetch posts based place only 
    const fetchItemByPlace = async ( place: string) => {
      try {
        const response = await fetch(`/api/get-items-by-place?place=${place}`);
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
  // const handlePostClick = (postId: string) => {
  //   router.push(`/find/${postId}`);
  // };

  return (
    <div>
 
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

     
      
    </div>
        <DisplayPosts items={items}/>

        <div className="flex items-center bottom-0 fixed z-40 w-screen h-[10vh] bg-slate-300">
      <div
        className="flex overflow-x-auto scrollbar-none w-full px-4 snap-x snap-mandatory"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {orgName.map((name:string, index:any) => (
          <button
            key={index}
            onClick={() => handleClick(name)}
            className={`snap-center whitespace-nowrap bg-violet-300 rounded-full m-2 p-3 text-sm transition-transform duration-300 ${
              currentName === name ? "scale-125 bg-violet-500 text-white" : ""
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>

   </div>
  
  );
}

