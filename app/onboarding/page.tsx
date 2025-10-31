// app/onboarding/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import GeoSelect from "@/components/GeoSelect";
import posthog from 'posthog-js';

type GeoOption = { id: string; label: string; code?: string };

export default function OnboardingPage() {
  const { user } = useUser();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState<GeoOption | null>(null);
  const [city, setCity] = useState<GeoOption | null>(null);
  const [university, setUniversity] = useState(""); // manual entry
  const [course, setCourse] = useState("");
  const [purpose, setPurpose] = useState("");
  const [referral, setReferral] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const canSubmit =
    !submitting &&
    fullName.trim().length > 1 &&
    country &&
    city &&
    university.trim().length > 1;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      posthog.capture('onboarding_form_submitted', {
        country: country?.label,
        city: city?.label,
        university: university.trim(),
        course: course.trim(),
        purpose_provided: purpose.trim().length > 0,
        referral_source: referral,
      });
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email,
          country: country?.label,
          city: city?.label,
          university: university.trim(),
          course: course.trim(),
          purpose: purpose.trim(),
          referral_source: referral,
        }),
      });
      window.location.href = "/dashboard";
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <div className="text-lg font-semibold tracking-tight text-black">LetsReWise</div>
        <div className="text-sm text-gray-500">{email}</div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black">
          Welcome to LetsReWise 👋
        </h1>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-8 rounded-2xl border border-black/10 bg-white p-6 md:grid-cols-2 md:p-8"
        >
          {/* LEFT */}
          <section className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[15px] text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">Email</label>
              <input
                value={email}
                readOnly
                className="w-full rounded-lg border border-black/10 bg-gray-50 px-3 py-2 text-[15px] text-gray-600"
              />
            </div>

            <GeoSelect
              label="Country"
              placeholder="Start typing to search…"
              type="countries"
              value={country}
              onChange={(opt) => {
                setCountry(opt);
                setCity(null); // reset city when country changes
              }}
            />

            <GeoSelect
              label="City"
              placeholder={country ? "Search a city…" : "Select country first"}
              type="cities"
              countryId={country?.id}
              value={city}
              onChange={setCity}
              disabled={!country}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-black">University</label>
              <input
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g., University of Oxford"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[15px] text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
              <p className="mt-1 text-xs text-gray-500">
                Type your university name (free text).
              </p>
            </div>
          </section>

          {/* RIGHT */}
          <section className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">Course</label>
              <input
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g., Computer Science"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[15px] text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">Purpose</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={5}
                placeholder="What are you hoping to do with LetsReWise?"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[15px] text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">Referral source</label>
              <select
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[15px] text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
              >
                <option value="">Select one</option>
                <option>Friend / Classmate</option>
                <option>Professor</option>
                <option>Reddit</option>
                <option>YouTube</option>
                <option>Twitter / X</option>
                <option>Google Search</option>
                <option>Other</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Continue"}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                By continuing, you agree to our terms & privacy policy.
              </p>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
