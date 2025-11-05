import { NextResponse } from "next/server";

export async function GET() {
  const content = `
User-agent: *
Allow: /

# Disallow internal or development routes
Disallow: /api/
Disallow: /onboarding
Disallow: /dashboard
Disallow: /_next/
Disallow: /private/

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
