import { signIn } from "../../../../auth";
import { redirect } from "next/navigation";
import React from "react";

export default function Login({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  async function handleSignIn() {
    "use server";

    await signIn();

    const redirectPath =
      typeof searchParams?.redirectit === "string"
        ? searchParams.redirectit
        : "/";

    redirect(redirectPath);
  }

  return (
    <div className="flex items-center justify-center min-h-[88vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome 
        </h1>
       
        <form action={handleSignIn} className="text-center">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign In With Google
          </button>
        </form>
      </div>
    </div>
  );
}
