"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import DisplayPosts from "./DisplayPosts";
import { orgName } from "../../storage";

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
    <div className="grid grid-cols-12 h-[85vh] bg-gray-100">
      {/* Left Section */}
      <div className="col-span-2 bg-red-100 p-4">Left Section</div>

      {/* Center Section */}
      <div className="col-span-8 bg-white flex flex-col items-center justify-start p-8 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md">
          <div>
            <input
              id="item"
              {...register("item")}
              type="text"
              placeholder="هيش مغيّب ؟"
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.item && <p className="mt-2 text-xs text-red-500">{errors.item.message}</p>}
          </div>
          <div>
            <select
              id="place"
              {...register("place")}
              defaultValue=""
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </form>

        <div className="w-full mt-6">
          <DisplayPosts items={items} />
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-2 bg-slate-400 flex flex-col items-center overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {orgName.map((name: string, index: any) => (
            <button
              key={index}
              onClick={() => handleClick(name)}
              className={`p-3 rounded-full transition-transform duration-300 ${
                currentName === name ? "bg-violet-500 text-white scale-110" : "bg-violet-300"
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
