"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import DisplayPosts from "./DisplayPosts";
import { orgName } from "../../storage";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import ad from "../../../../public/ad.png"
import bg1 from "../../../../public/bg1.jpg"
import bg2 from "../../../../public/bg2.jpg"
import bg3 from "../../../../public/bg3.jpg"
import bg4 from "../../../../public/bg4.jpg"

const schema = z.object({
  item: z.string().min(1, { message: "The Field is required!" }),
  place: z.string().min(1, { message: "Please select a place" }),
});

type FormFields = z.infer<typeof schema>;

export default function Search() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();
  const [currentName, setCurrentName] = useState(orgName[0]);

  const handleClick = async (name: string) => {
    setCurrentName(name);
    await fetchItemByPlace(name);
  };

  const fetchItems = async (item: string, place: string) => {
    try {
      const response = await fetch(`/api/get-items?item=${item}&orgName=${place}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const fetchItemByPlace = async (place: string) => {
    try {
      const response = await fetch(`/api/get-items-by-place?orgName=${place}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
    await fetchItems(data.item, data.place);
    reset();
  };

  return (
    <div className="grid grid-cols-12 h-[85vh] ">
      {/* Left Section */}
      <div className="col-span-2  p-4 flex flex-col justify-center items-center">
         <div className="relative h-full w-full rounded-2xl overflow-hidden">
          <Image alt="ad" src={ad} fill objectFit="cover"/>
         <div className="absolute bottom-0 bg-gray-300/20 text-center w-full rounded-t-2xl h-10"> 
            <h1 className="text-lg text-white  font-normal">Fake Sponsorship</h1>
          </div>
         </div>
      </div>

      {/* Center Section */}
      <div className="col-span-8  flex flex-col items-center  p-4 overflow-y-auto w-full h-full">
        <div className="relative z-20 w-full flex items-center min-h-[35vh]">
        <div className="absolute -z-10 w-full  rounded-xl overflow-hidden h-full">
          <Image
           src={bg1}
            alt="search bg image"
             fill 
             objectFit="cover"
             className=""
             />
        </div>
        <div className="absolute bottom-12 left-12">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-2 w-full ">
          <div>
            <input
              id="item"
              {...register("item")}
              type="text"
              placeholder="هيش مغيّب ؟"
              className="w-full p-3 border bg-white/70 text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.item && <p className="mt-2 text-xs text-red-500">{errors.item.message}</p>}
          </div>
          <div>
            <select
              id="place"
              {...register("place")}
              defaultValue=""
              className="w-full p-3 border bg-white/70 text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>هين تدرس؟</option>
              <option value="SQU">جامعة السلطان قابوس</option>
              <option value="UTAS Muscat">جامعة التقنية-مسقط</option>
              <option value="UTAS Nizwa">UTAS Nizwa</option>
              <option value="UTAS Ibra">UTAS Ibra</option>
              <option value="NIZWA Uni">NIZWA Uni</option>
            </select>
            {errors.place && <p className="mt-2 text-xs text-red-500">{errors.place.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </form>
        </div>
        </div>

        <div className="w-full mt-6">
          <DisplayPosts items={items} />
          <Footer/>
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-2  flex flex-col items-center overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {orgName.map((name: string, index: any) => (
            <button
              key={index}
              onClick={() => handleClick(name)}
              className={`p-3 rounded-full transition-transform duration-300 ${
                currentName === name ? "bg-indigo-300 text-white scale-110" : "bg-violet-300"
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
