"use client"
import { useRouter } from "@/i18n/routing";
import { MdArrowOutward } from "react-icons/md";
import Image from "next/image";
import { useTranslations } from "next-intl";
import defaultImage from "../../../../public/bg11.jpg"

export default function DisplayPosts({items}:any){
  const t= useTranslations("card")
  const c= useTranslations("storage")
  
    const router = useRouter();  // To navigate to the details page
 // Handle post click to navigate to details
 const handlePostClick = (postId: string) => {
    router.push(`/find/${postId}`);

  };

    return(
        <div className="w-full p-6 mt-6 flex items-center flex-col">
                <h3 className="text-xl font-semibold mb-6 text-blue-600">Fetched Items</h3>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 gap-12">
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
                            {t("location")}: {c(`place.${item.address?.place}`)}, {c(`country.${item.address?.country}`)}
                          </p>
                        </div>
          
                        {/* Image Section */}
                        <div className="relative h-[250px] m-3">
                          {item.imageUrls.length > 0 ? (
                            <div>
                              <button
                                title="arrow to detailed page"
                                onClick={() => handlePostClick(item.id)}
                                className="absolute bottom-2 right-2 p-3 bg-white z-20 text-black text-xl rounded-full hover:bg-blue-200 transition-colors shadow-md"
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
                                src={defaultImage}
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
    )
}