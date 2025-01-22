"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { SignOut } from "../auth/client/signout-button";
import { SignIn } from "../auth/client/signin-button";
import defaultProfileImage from "../../../../public/img2.jpeg";
import { Link } from "@/i18n/routing";

export default function Profile() {
  const [show, setShow] = useState(false);
  const { data: session, status } = useSession();

  function handleProfile() {
    setShow((prev) => !prev);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {status === "unauthenticated" ? (
        <div>
          <SignIn />
        </div>
      ) : (
        <div className="relative">
          {/* Profile Button */}
          <button
            onClick={handleProfile}
            className="relative w-[40px] h-[40px] rounded-xl overflow-hidden border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Toggle profile menu"
          >
            <Image
              src={session?.user?.image || defaultProfileImage}
              alt="Profile Image"
              fill
              objectFit="cover"
              className="rounded-xl"
            />
          </button>

          {/* Dropdown Menu */}
          {show && (
            <div
              className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-48 bg-white shadow-lg rounded-lg p-4 z-50"
              onClick={() => setShow(false)}
            >
              <div className="flex flex-col items-center text-gray-800 space-y-2">
                {/* User Dashboard */}
                <Link href="/dashboard" className="text-sm font-medium hover:text-violet-500">
                  Dashboard
                </Link>

                {/* User Email */}
                <p className="text-sm text-gray-600">{session?.user?.email || "No email provided"}</p>

                {/* Sign Out Button */}
                <SignOut />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
