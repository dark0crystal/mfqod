import { signIn } from "@/../auth";
import { getLocale } from "next-intl/server";
import React from "react";

export default async function Login({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const locale = await getLocale();
  const resolved = await searchParams;
  const redirectTo = resolved?.redirect || "/"; // Default to home if no redirect param
  // Build callback URL with locale so user returns to the correct localized path
  const callbackUrl = redirectTo.startsWith("/") ? `/${locale}${redirectTo === "/" ? "" : redirectTo}` : redirectTo;

  async function handleSignIn(formData: FormData) {
    "use server";
    const callback = (formData.get("callbackUrl") as string) || "/";
    // Sign in directly with Google — one click, no intermediate provider page
    await signIn("google", { callbackUrl: callback });
  }

  return (
    <div className="flex items-center justify-center min-h-[88vh]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome
        </h1>

        <form action={handleSignIn} className="text-center">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button
            type="submit"
            className="w-full btn-primary"
          >
            Sign In With Google
          </button>
        </form>
      </div>
    </div>
  );
}
