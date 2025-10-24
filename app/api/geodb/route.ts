// app/api/geodb/route.ts
import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";
import countriesData from "@/data/countries.json";
import citiesData from "@/data/cities.json";

// Define the expected type for countriesData
type CountriesJson = { countries?: any[] } | any[];

const typedCountriesData = countriesData as { countries?: any[] } | any[];

// ✅ Normalize countries
const countries = Array.isArray(typedCountriesData)
  ? typedCountriesData
  : (typedCountriesData as { countries?: any[] }).countries || [];

const normalizedCountries = countries.map((c: any) => ({
  id: c.id || c.code || c.iso2 || c.name,
  label: c.label || c.name || c.country || "",
  code: c.code || c.iso2 || "",
}));

// ✅ Fuse for countries
const fuseCountries = new Fuse(normalizedCountries, {
  keys: ["label"],
  threshold: 0.4, // allows for fuzzy "lon" → "London"
  ignoreLocation: true,
  includeScore: false,
});

// ✅ Build per-country Fuse indexes for cities
const fuseCities: Record<string, Fuse<any>> = {};

for (const [countryCode, list] of Object.entries(citiesData)) {
  const normalizedList = (list as any[]).map((c) => ({
    id: c.id || c.city || c.label || `${countryCode}-${c.name}`,
    label: c.label || c.name || c.city || "",
    code: c.code || c.countryCode || countryCode,
  }));

  fuseCities[countryCode] = new Fuse(normalizedList, {
    keys: ["label"],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: false,
  });
}

// ✅ Simple in-memory cache for RapidAPI fallback
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

// ──────────────────────────────
// ⚙️ API Route
// ──────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const namePrefix = searchParams.get("namePrefix")?.trim().toLowerCase() || "";
  const countryId = searchParams.get("countryId") || "";
  const limit = Number(searchParams.get("limit") || 8);

  if (!namePrefix) return NextResponse.json({ data: [] });

  // 1️⃣ COUNTRY SEARCH
  if (type === "countries") {
    const results = fuseCountries.search(namePrefix).slice(0, limit);
    return NextResponse.json({ data: results.map((r) => r.item) });
  }

  // 2️⃣ CITY SEARCH
  if (type === "cities") {
    // Local fuzzy first
    const fuse = fuseCities[countryId];
    if (fuse) {
      const localResults = fuse.search(namePrefix).slice(0, limit);
      if (localResults.length > 0) {
        return NextResponse.json({ data: localResults.map((r) => r.item) });
      }
    }

    // Cache fallback
    const cacheKey = `${countryId}-${namePrefix}`;
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: cached.data });
    }

    // RapidAPI fallback (only if not found locally)
    if (!process.env.RAPIDAPI_KEY) {
      console.warn("⚠️ Missing RAPIDAPI_KEY — returning empty cities list.");
      return NextResponse.json({ data: [] });
    }

    try {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryId}&namePrefix=${encodeURIComponent(
          namePrefix
        )}&limit=${limit}`,
        {
          headers: {
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error(`GeoDB error: ${res.status}`);

      const json = await res.json();
      const data =
        (json?.data || []).map((item: any) => ({
          id: String(item.id),
          label: item.name,
          code: item.countryCode,
        })) ?? [];

      cache[cacheKey] = { data, timestamp: Date.now() };
      return NextResponse.json({ data });
    } catch (err) {
      console.error("⚠️ RapidAPI fallback error:", err);
      return NextResponse.json({ data: [] });
    }
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}