"use client";

import { useState, useEffect } from "react"; 
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";  // Import Zod
import { zodResolver } from "@hookform/resolvers/zod";  // Import Zod resolver

// Define Zod validation schema
const schema = z.object({
  item: z
    .string()
    .min(1, { message: "The Field is required!" }),
    // .regex(/^[a-zA-Z]/, { message: "Must start with a letter" }),
  place: z.string().min(1, { message: "Please select a place" }),
});

type FormFields = {
  item: string;
  place: string;
};

export default function SearchForm() {
  const [items, setItems] = useState<any[]>([]);  // Initialize state to hold fetched items
  
  // Function to fetch posts from the server using a custom API route
  const fetchItems = async () => {
    try {
      const response = await fetch("/api/get-items",{
        method:'POST', 
        
      }); // API endpoint to fetch posts from the server
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setItems(data.res); // Set the fetched data to state
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // UseEffect to call fetchItems once the component is mounted
  useEffect(() => {
    fetchItems();  // Fetch items from the server
  }, []);  // Empty dependency array ensures this runs once on mount

  // Initialize the useForm hook with Zod validation schema
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormFields>({
    resolver: zodResolver(schema),  // Use Zod for validation
  });

  // Handle form submission
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);  // Handle form submission (log data)

    // Fetch items again after form submission if necessary
    await fetchItems();
    
    reset();  // Reset form after submission
  };

  return (
    <div className="flex flex-col mt-6  items-center ">
      
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row justify-center">
          {/* Input for item */}
            <div>
            <input
              id="item"
              {...register("item")}
              type="text"
              placeholder="هيش مغيّب ؟ "
              className="p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* Error message for item */}
            {errors.item && (
              <p className="mt-2 text-xs text-red-500">{errors.item.message}</p>
            )}
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
            {/* Error message for place */}
            {errors.place && (
              <p className="mt-2 text-xs text-red-500">{errors.place.message}</p>
            )}
         </div>

          {/* Submit button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3  bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {isSubmitting ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
     

      {/* Display the fetched items */}
      <div className="w-full max-w-4xl p-8 mt-6  bg-violet-300">
        <h3 className="text-lg font-bold mb-4">Fetched Items</h3>
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item: any ,index) => (
              <div key={index} className="p-4 bg-violet-300 rounded-md">
                <p><strong>ID:</strong> {item.id}</p>
                <p><strong>Title:</strong> {item.title}</p>
                <p><strong>Content:</strong> {item.content}</p>
                {/* Display other fields as needed */}
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
