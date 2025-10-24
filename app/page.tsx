"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Redirect signed-in users to onboarding first
      router.push("/onboarding");
    }
  }, [user, router]);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to LetsReWise 👋</h1>

      <SignedOut>
        <p className="text-gray-400 mb-4">Sign in to get started with your personalised learning twin</p>
        <SignInButton mode="modal">
          <button className="bg-[#6c47ff] hover:opacity-90 transition text-white px-6 py-3 rounded-lg font-semibold">
            Sign In / Sign Up
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <p className="mb-4 text-gray-400">Redirecting to your dashboard...</p>
        <UserButton />
      </SignedIn>
    </main>
  );
}