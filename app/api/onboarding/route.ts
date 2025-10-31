import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server"; // ✅ your correct path

export async function POST(req: Request) {
  console.log("✅ API HIT: /api/onboarding reached");

  try {
    const body = await req.json();
    console.log("🧾 Received body:", body);
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      full_name,
      email,
      country,
      country_code,
      city,
      university,
      course,
      purpose,
      referral_source,
      role = "student",
      privacy_consent = false,
      marketing_opt_in = false,
      onboarding_completed = true,
      preferences = {},
    } = body;

    // ✅ Wait for the async Supabase client
    const supabase = await createClient();

    const { error } = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: userId,
          full_name,
          email,
          country,
          country_code,
          city,
          university,
          course,
          purpose,
          referral_source,
          role,
          privacy_consent,
          marketing_opt_in,
          onboarding_completed,
          preferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Onboarding save failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    console.log("🆔 Clerk User ID:", userId);
    console.log("🟢 Supabase Upsert Result:", error ? error.message : "No error");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("❌ Fetch failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}