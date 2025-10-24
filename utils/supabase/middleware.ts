import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    // ✅ Clerk user sync (optional)
    const { userId } = getAuth(req);
    if (userId) {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      console.log("Active Clerk user:", user.emailAddresses[0]?.emailAddress);
    }

    // ✅ Supabase cookie bridge
    createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet: any[]) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    });
  } catch (err) {
    console.error("⚠️ Middleware error:", err);
  }

  return res;
}