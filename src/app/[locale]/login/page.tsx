import { signIn } from "../../../../auth";
import { redirect } from "next/navigation";
import React from 'react';

export default function Login({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Server action marked with "use server"
  async function handleSignIn() {
    "use server"
    
    await signIn()
    
    // Default to dashboard if no redirect specified
    const redirectPath = typeof searchParams?.redirectit === 'string' 
      ? searchParams.redirectit 
      : '/'
    
    redirect(redirectPath)
  }

  return (
    <form action={handleSignIn}>
      <button type="submit">Sign in</button>
    </form>
  );
}