import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createClient() {
  // ⛔️ `cookies()` is async in Next.js 15+ / 16+
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: any[]) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // @ts-ignore — the type defs lag behind Next’s runtime
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore set errors in server components
        }
      },
    },
  });
}