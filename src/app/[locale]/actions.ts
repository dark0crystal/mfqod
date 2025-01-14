// app/actions.ts
"use server"

import { signIn } from "../../../auth";
import { redirect } from "next/navigation";

export async function handleSignIn(searchParams?: { [key: string]: string | string[] | undefined }) {
  await signIn()
  
  const redirectPath = typeof searchParams?.redirectit === 'string' 
    ? searchParams.redirectit 
    : '/'
  
  redirect(redirectPath)
}