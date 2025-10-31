import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LetsReWise — Turn documents into quizzes & flashcards with AI",
  description:
    "Upload → Learn → Revise → Retake → Master. LetsReWise turns your documents into adaptive quizzes, flashcards, and smart revision.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-white text-black antialiased" suppressHydrationWarning>
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
              <a href="/" className="flex items-center gap-2" aria-label="LetsReWise home">
                <img src="/logo.png" alt="LetsReWise" className="h-8 w-auto" />
                <span className="font-bold tracking-tight">LetsReWise</span>
              </a>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="/#features" className="hover:underline">Features</a>
                <a href="/#pricing" className="hover:underline">Pricing</a>
                <a href="/#faq" className="hover:underline">FAQ</a>
                <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-black text-white rounded-full px-4 py-2 font-medium hover:opacity-90">
                      Start for Free
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>
            <div className="hidden md:block border-t border-gray-200 bg-white">
              <div className="text-center text-xs py-2 text-gray-600">
                Upload → Learn → Revise → Retake → Master
              </div>
            </div>
          </header>

          {children}

          <footer className="mt-24 border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto py-14 grid md:grid-cols-2 gap-8 items-center px-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  So, what will you master next?
                </h2>
                <p className="mt-3 text-gray-700 max-w-xl">
                  Join learners turning their documents into daily progress with adaptive quizzes and flashcards.
                </p>
                <div className="mt-6 flex gap-3">
                  <a
                    href="/#signup"
                    className="bg-black text-white rounded-full px-5 py-3 text-sm font-semibold hover:opacity-90"
                  >
                    Start for Free
                  </a>
                  <a
                    href="/#pricing"
                    className="border border-gray-300 text-black rounded-full px-5 py-3 text-sm font-semibold hover:bg-gray-100"
                    aria-label="See pricing"
                  >
                    See Pricing
                  </a>
                </div>
              </div>
              <div className="justify-self-end text-sm text-gray-700">
                <div className="font-semibold">LetsReWise</div>
                <div className="mt-2">© {new Date().getFullYear()} LetsReWise. All rights reserved.</div>
                <div className="mt-2 flex gap-4">
                  <a className="hover:underline" href="/#privacy">Privacy</a>
                  <a className="hover:underline" href="/#terms">Terms</a>
                  <a className="hover:underline" href="/#contact">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}