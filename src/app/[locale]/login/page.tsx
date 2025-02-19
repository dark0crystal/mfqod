import { signIn } from "../../../../auth";
import { redirect } from '@/i18n/routing';
import { getLocale } from "next-intl/server"; 
import { NextRequest } from "next/server";
import React from "react";

export default async function Login({ searchParams }: { searchParams?: { redirect?: string } }) {
  const locale = await getLocale();
  const redirectTo = searchParams?.redirect || "/"; // Default to home if no redirect param

  async function handleSignIn() {
    "use server";

    await signIn();

    return redirect({ href: redirectTo, locale });
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
