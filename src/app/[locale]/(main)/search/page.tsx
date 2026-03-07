"use client"
import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DisplayPosts from "./DisplayPosts";
import DataProvider from "@/app/storage";
import Footer from "@/app/components/Footer";
import CustomSelect from "@/components/ui/CustomSelect";
import Image from "next/image";
import bg12 from "../../../../../public/bg12.jpeg";
import { FaSearch } from "react-icons/fa";
import { RiLoader2Line } from "react-icons/ri";

const schema = z.object({
  item: z.string().min(1, { message: "The Field is required!" }),
  branchId: z.string().min(1, { message: "Please select a branch" }),
});

type FormFields = z.infer<typeof schema>;

export default function Search() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Loading state

  const { branches } = DataProvider();

  const fetchItems = async (item: string, branchId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-items?item=${encodeURIComponent(item)}&branchId=${encodeURIComponent(branchId)}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    await fetchItems(data.item, data.branchId);
    reset();
    setLoading(false);
  };

  return (
    <div className="relative lg:h-[88vh]">
      {/* Main content */}
      <div className="flex flex-col items-center p-4 overflow-y-auto w-full min-h-full">
        <div className="relative z-20 w-full flex items-center min-h-[30vh] justify-center">
          <div className="absolute -z-10 w-full rounded-xl overflow-hidden h-full">
            <Image
              src={bg12}
              alt="search bg image"
              fill
              objectFit="cover"
            />
          </div>
          {/* Blur background on top of image */}
          <div className="absolute z-10 bg-white/40 w-full h-full rounded-xl" />

          <div className="lg:absolute lg:bottom-12 w-full flex justify-center z-20">
            <form onSubmit={handleSubmit(onSubmit)} className="flex lg:flex-row flex-col gap-2 w-fit max-w-md">
              <div>
                <input
                  id="item"
                  {...register("item")}
                  type="text"
                  placeholder="هيش مغيّب ؟"
                  className="form-input w-full min-w-[180px]"
                />
                {errors.item && <p className="mt-2 text-xs text-red-500">{errors.item.message}</p>}
              </div>
              <div className="min-w-[180px]">
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      id="branchId"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="هين تدرس؟"
                      options={[
                        { value: "", label: "هين تدرس؟" },
                        ...branches.map((b) => ({
                          value: b.id,
                          label: b.country ? `${b.nameEn} (${b.country.nameEn})` : b.nameEn,
                        })),
                      ]}
                    />
                  )}
                />
                {errors.branchId && <p className="mt-2 text-xs text-red-500">{errors.branchId.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full lg:w-fit lg:h-fit btn-primary flex items-center justify-center min-h-[48px]"
              >
                {loading ? <RiLoader2Line size={26} className="animate-spin" /> : <FaSearch size={26} />}
              </button>
            </form>
          </div>
        </div>

        <div className="w-full mt-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <DisplayPosts items={items} />
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
}
