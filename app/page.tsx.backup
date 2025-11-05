"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import posthog from "posthog-js";
import { Inter, Roboto_Mono } from "next/font/google";

// === ShadCN components (assumed generated under @/components/ui/*)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// --- Animation helpers for staggered entrance (unchanged)
const parentStagger = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { staggerChildren: 0.11, duration: 0.5, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
};
const childFade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Page() {
  const { user } = useUser();

  // PostHog analytics/events (unchanged)
  useEffect(() => {
    if (!posthog.has_opted_out_capturing()) {
      posthog.init("YOUR_POSTHOG_API_KEY", {
        api_host: "https://app.posthog.com",
        autocapture: true,
        capture_pageview: true,
      });
    }
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      if (scrollPercent > 25) posthog.capture("scroll_depth_25");
      if (scrollPercent > 50) posthog.capture("scroll_depth_50");
      if (scrollPercent > 75) posthog.capture("scroll_depth_75");
      if (scrollPercent > 90) posthog.capture("scroll_depth_90");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clerk redirect (unchanged)
  useEffect(() => {
    if (user) location.assign("/onboarding");
  }, [user]);

  // Framer-motion scroll progress (unchanged)
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  const heroBlobX = useTransform(scrollY, [0, 400], [0, -60]);
  const heroBlobY = useTransform(scrollY, [0, 400], [0, 30]);
  const footerBlobX = useTransform(scrollY, [0, 400], [0, 60]);
  const footerBlobY = useTransform(scrollY, [0, 400], [0, -30]);

  // CTA tracking (unchanged)
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const handleUploadClick = () => {
    posthog.capture("click_upload_document");
    uploadRef.current?.click();
  };
  const handleStartForFreeClick = () => posthog.capture("click_start_for_free");
  const handleSeePricingClick = () => posthog.capture("click_see_pricing");
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    posthog.capture("click_get_magic_link", { email });
    setStatus("Thanks! Check your inbox to verify and start.");
    setEmail("");
  };

  // Simple dark-mode toggle (no extra deps)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <main
      id="top"
      className={`relative bg-background text-foreground ${geistSans.variable} ${geistMono.variable}`}
      style={{ fontFamily: "var(--font-geist-sans), var(--font-geist-mono), ui-monospace, monospace" }}
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-foreground/90"
      />

      {/* Theme toggle */}
      <div className="fixed bottom-4 right-4 z-[70]">
        <Button
          variant="secondary"
          className="rounded-full shadow-md"
          onClick={() => setIsDark((v) => !v)}
          aria-label="Toggle theme"
        >
          {isDark ? "🌙 Dark" : "☀️ Light"}
        </Button>
      </div>

      {/* === HERO SECTION (layout unchanged, polished tokens) === */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-muted via-background to-muted/60 min-h-[90vh] flex items-center justify-center">
        {/* Gradient + background blobs */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-muted via-background to-muted/60" />
          <motion.div
            style={{ x: heroBlobX, y: heroBlobY }}
            className="absolute -top-64 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 rounded-full blur-[140px] bg-[radial-gradient(circle_at_center,_hsl(var(--muted-foreground)/0.12)_0%,_transparent_70%)]"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[clamp(2.6rem,6.5vw,4.6rem)] font-black leading-[1.05] tracking-tight"
          >
            Shape your documents into
            <br className="hidden sm:block" />
            quizzes that work your way
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground"
          >
            LetsReWise builds clean quizzes and flashcards from your notes in minutes. No coding. No setup.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mx-auto mt-10 w-full max-w-[860px]"
          >
            <Card className="relative rounded-[28px] border border-border bg-card/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
              <CardContent className="p-2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Make a note-taking quiz that …"
                    aria-label="Describe what you want to study"
                    className="h-[64px] rounded-[24px] pr-16 text-[1.05rem]"
                  />
                  <Button
                    onClick={handleStartForFreeClick}
                    variant="default"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                    aria-label="Generate"
                  >
                    ↑
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.16, duration: 0.45 }}
            className="mx-auto mt-10 flex max-w-[980px] flex-wrap items-center justify-center gap-3"
          >
            {[
              "SQE: Solicitors Qualifying Exam",
              "ACCA Fundamentals",
              "Onboarding Portal",
              "Room Visualizer",
              "Networking Basics",
            ].map((chip, i) => (
              <Button
                key={i}
                variant="outline"
                className="rounded-full"
                onClick={() => posthog.capture("chip_click", { chip })}
              >
                {chip}
              </Button>
            ))}
          </motion.div>

          <div className="mt-9 text-xl text-muted-foreground">Upload → Learn → Revise → Retake → Master</div>
        </div>

        <WaveDivider />
      </section>

      {/* === FEATURES (unchanged layout; ShadCN Cards; images /feature1-3.png) === */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
          <div className="py-[clamp(5rem,10vw,9rem)] text-center">
            <motion.h2 {...parentStagger} className="text-4xl md:text-5xl font-bold tracking-tight">
              Consider yourself limitless.
            </motion.h2>
            <motion.p {...parentStagger} className="mt-3 text-lg md:text-xl text-muted-foreground">
              If you can describe it, you can master it.
            </motion.p>
          </div>

          <div className="flex flex-col gap-[8rem]">
            {[
              {
                title: "Generate at the speed of thought",
                desc: "Upload your notes or PDFs, and watch them transform into quizzes & flashcards instantly—complete with explanations and adaptive learning logic.",
                image: "/feature1.png",
                reverse: false,
              },
              {
                title: "The intelligence built in automatically",
                desc: "Every answer, flashcard, and quiz question is analyzed for meaning and accuracy. LetsReWise intelligently links related topics and explains mistakes, automatically.",
                image: "/feature2.png",
                reverse: true,
              },
              {
                title: "Ready to use, instantly",
                desc: "No setup, no waiting. Start revising the moment you upload. All your materials are stored securely and accessible from any device.",
                image: "/feature3.png",
                reverse: false,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={parentStagger}
                initial="initial"
                whileInView="whileInView"
                viewport={parentStagger.viewport}
                className={`flex flex-col-reverse lg:flex-row ${
                  feature.reverse ? "lg:flex-row-reverse" : ""
                } items-center gap-12 lg:gap-24`}
              >
                {/* Text */}
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h3 className="text-3xl md:text-4xl font-semibold leading-tight">{feature.title}</h3>
                  <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                    {feature.desc}
                  </p>
                  <Button onClick={handleStartForFreeClick} className="mt-6 rounded-full">
                    Start Learning
                  </Button>
                </div>

                {/* Image Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="lg:w-1/2"
                >
                  <Card className="relative rounded-[32px] overflow-hidden shadow-xl border bg-card">
                    <div className="absolute inset-0 bg-gradient-to-tr from-muted via-background to-muted/60 rounded-[32px]" />
                    <CardContent className="relative p-0">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto object-contain rounded-[32px]"
                        loading="lazy"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS (dual infinite scroll; unchanged motion; ShadCN cards) === */}
      <section className="relative border-t border-border bg-gradient-to-b from-muted via-background to-muted overflow-hidden mt-[8rem]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20 py-[clamp(5rem,10vw,8rem)] text-center">
          <motion.h2 {...parentStagger} className="text-4xl md:text-5xl font-semibold tracking-tight">
            “Okay, @letsrewise has blown my mind.”
          </motion.h2>
          <motion.p {...parentStagger} className="mt-3 text-lg md:text-xl text-muted-foreground">
            And other great things our users say about us.
          </motion.p>
          <Button onClick={handleStartForFreeClick} className="mt-8 rounded-full">
            Start Learning
          </Button>
        </div>

        {/* Infinite Scrolling Rows */}
        <div className="relative w-full overflow-hidden py-16">
          {/* Row 1 */}
          <div className="flex animate-scroll-left gap-6 md:gap-10 w-max mb-10">
            {[
              { name: "Aarav Patel", text: "Turned my boring PDFs into interactive flashcards in seconds!", avatar: "/avatars/1.jpg", icon: "in" },
              { name: "Liam Evans", text: "The AI revision coach actually feels like a personal tutor.", avatar: "/avatars/2.jpg", icon: "p" },
              { name: "Olivia Khan", text: "Clean UI, fast performance, and top-tier results. Game changer.", avatar: "/avatars/3.jpg", icon: "in" },
              { name: "Sophia Williams", text: "Studying for SQE has never been this efficient and intuitive.", avatar: "/avatars/4.jpg", icon: "p" },
              { name: "Jacob Brown", text: "It remembers what I get wrong and helps me revise smarter.", avatar: "/avatars/5.jpg", icon: "in" },
              { name: "Emily Taylor", text: "The flashcard explanations are on point—no fluff, just clarity.", avatar: "/avatars/6.jpg", icon: "p" },
              { name: "Ethan Lewis", text: "I literally passed my ACCA prep using this. Thank you!", avatar: "/avatars/7.jpg", icon: "in" },
              { name: "Maya Anderson", text: "Felt like Base44 for students—beautifully crafted and smart.", avatar: "/avatars/8.jpg", icon: "p" },
              { name: "Noah Martin", text: "Adaptive learning that’s actually adaptive. I love it.", avatar: "/avatars/9.jpg", icon: "p" },
            ].map((t, i) => (
              <Card
                key={i}
                className="min-w-[420px] rounded-2xl border border-border shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-6 flex flex-col justify-between text-left">
                  <p className="text-base leading-relaxed text-muted-foreground/90">“{t.text}”</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={t.avatar} alt={t.name} />
                        <AvatarFallback>{t.name.slice(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">Beta User</p>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm font-bold uppercase">{t.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex animate-scroll-right gap-6 md:gap-10 w-max">
            {[
              { name: "Leo Johnson", text: "It’s like Notion and ChatGPT had a smarter baby.", avatar: "/avatars/10.jpg", icon: "in" },
              { name: "Chloe Green", text: "The analytics dashboard helped me identify weak topics instantly.", avatar: "/avatars/11.jpg", icon: "p" },
              { name: "Daniel Wright", text: "UX is flawless—modern, responsive, and buttery smooth.", avatar: "/avatars/12.jpg", icon: "in" },
              { name: "Isabella Moore", text: "This is what learning in 2025 should look like.", avatar: "/avatars/13.jpg", icon: "p" },
              { name: "James Hall", text: "I use it every day for SQE1 revision. Feels like magic.", avatar: "/avatars/14.jpg", icon: "in" },
              { name: "Ava Thomas", text: "Finally, an AI study app that’s trustworthy and accurate.", avatar: "/avatars/15.jpg", icon: "p" },
              { name: "Elias Scott", text: "The onboarding flow was smoother than any SaaS I’ve used.", avatar: "/avatars/16.jpg", icon: "in" },
              { name: "Grace Turner", text: "Everything I need for spaced repetition—no setup, just start.", avatar: "/avatars/17.jpg", icon: "p" },
              { name: "William Allen", text: "I don’t even think about studying anymore—LetsReWise guides me.", avatar: "/avatars/18.jpg", icon: "in" },
              { name: "Sofia Hughes", text: "AI-generated quizzes that *actually* make sense. Love it.", avatar: "/avatars/19.jpg", icon: "p" },
            ].map((t, i) => (
              <Card
                key={i}
                className="min-w-[420px] rounded-2xl border border-border shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-6 flex flex-col justify-between text-left">
                  <p className="text-base leading-relaxed text-muted-foreground/90">“{t.text}”</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={t.avatar} alt={t.name} />
                        <AvatarFallback>{t.name.slice(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">Beta User</p>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm font-bold uppercase">{t.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Keyframes for infinite marquee */}
        <style jsx>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-left {
            animation: scroll-left 60s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 60s linear infinite;
          }
        `}</style>
      </section>

      {/* === PRICING (unchanged layout; glossy ShadCN Cards) === */}
      <section id="pricing" className="relative border-t border-border bg-[#0d1117] text-white py-[clamp(6rem,10vw,9rem)] overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-20">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-semibold leading-tight"
              >
                Pricing plans for{" "}
                <span className="bg-gradient-to-r from-[#f2f2f2] to-[#bebfbd] bg-clip-text text-transparent">
                  every learner
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="mt-4 text-lg text-white/70 max-w-md"
              >
                Start for free and scale as you go with flexible plans designed to match your learning goals.
              </motion.p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Free */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Card
                className="relative w-full md:w-[420px] rounded-[28px] border border-white/10"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.9) 100%)",
                  boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.2), 0 20px 60px rgba(0,0,0,0.25)",
                  color: "#111",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Start for free.</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8 text-base/relaxed text-neutral-800">
                    <li>✅ 3 uploads per month</li>
                    <li>✅ Auto-generated quizzes</li>
                    <li>✅ Smart flashcards</li>
                    <li>✅ Daily quick revision</li>
                  </ul>
                  <Button onClick={handleStartForFreeClick} className="rounded-full">
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            >
              <Card
                className="relative w-full md:w-[420px] rounded-[28px] border border-white/10"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(245,245,245,0.9) 100%)",
                  boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.3), 0 20px 70px rgba(0,0,0,0.3)",
                  color: "#111",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Pro plan</CardTitle>
                  <CardDescription className="text-4xl font-bold text-neutral-900">
                    £9.99<span className="text-lg font-normal text-neutral-600">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8 text-base/relaxed text-neutral-800">
                    <li>✨ Unlimited uploads</li>
                    <li>✨ AI Revision Coach</li>
                    <li>✨ Share & export sets</li>
                    <li>✨ Priority support</li>
                  </ul>
                  <Button onClick={handleSeePricingClick} className="rounded-full">
                    Go Pro
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Subtle gradient glow under cards */}
        <motion.div
          style={{ x: footerBlobX, y: footerBlobY }}
          className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#aef25d33] via-transparent to-transparent pointer-events-none"
        />
      </section>

      {/* === FAQ (ShadCN Accordion; unchanged content) === */}
      <section
        id="faq"
        className="border-t border-border bg-gradient-to-br from-muted via-background to-muted py-[clamp(6rem,10vw,9rem)]"
      >
        <div className="mx-auto max-w-4xl px-6 md:px-10 lg:px-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-primary via-primary/60 to-secondary bg-clip-text text-transparent"
            style={{ letterSpacing: "-.01em" }}
          >
            Frequently Asked Questions
          </motion.h2>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "What makes LetsReWise different from other study tools?",
                a: "LetsReWise turns your notes and documents into adaptive quizzes with detailed explanations, not just simple flashcards. Our platform leverages smart AI to track your weaknesses, provide tailored revision, and help you master any subject efficiently. No templates, no manual setup—just seamless learning.",
              },
              {
                q: "How do I know my data is secure?",
                a: "Your uploads are encrypted end-to-end and never shared with third parties. We use industry-leading security practices and you always control your content. Privacy and trust are built into our core, so you can focus on learning without worry.",
              },
              {
                q: "Can I use LetsReWise for any subject or exam?",
                a: "Absolutely! Whether you're preparing for professional exams, school tests, or personal development, LetsReWise adapts to your needs. Just upload your materials—from law notes to finance textbooks—and our system generates custom quizzes suited to your goals.",
              },
              {
                q: "Do I need to format my notes in a special way?",
                a: "No special formatting required. Upload PDFs, Word docs, or plain text—our AI understands natural language and extracts key concepts automatically. Save hours of manual input and let LetsReWise do the heavy lifting.",
              },
              {
                q: "How does the AI personalize my revision?",
                a: "LetsReWise analyzes your answers and learning patterns, then adapts future quizzes to focus on your weak spots. You'll get explanations for mistakes, spaced repetition, and targeted practice—all designed to boost retention and confidence.",
              },
              {
                q: "Can I share or export my quiz sets?",
                a: "Yes! Easily export to CSV or Anki, and share sets with classmates or study groups. Collaboration is simple, so you can learn together or help others master tough topics.",
              },
              {
                q: "What’s included in the free plan?",
                a: "The free plan gives you 3 uploads per month, unlimited access to generated quizzes and flashcards, and daily quick revision. Upgrade to Pro for unlimited uploads, advanced analytics, and priority support.",
              },
              {
                q: "How fast can I start revising after upload?",
                a: "You can begin revising within seconds. Upload your document, and LetsReWise instantly builds quizzes and flashcards—no waiting or setup required. Perfect for last-minute cramming or structured long-term revision.",
              },
              {
                q: "Is LetsReWise suitable for teams or organizations?",
                a: "Yes! We support bulk onboarding, team analytics, and collaborative features for schools, universities, and businesses. Contact us for custom solutions that fit your group’s learning needs.",
              },
              {
                q: "Why should I trust LetsReWise with my learning?",
                a: "We’re built by educators, engineers, and learners who believe great revision should be effortless and effective. Our mission is your mastery—no distractions, no gimmicks, just results. Join thousands who’ve made the switch to smarter studying.",
              },
            ].map((item, i) => (
              <Card key={i} className="bg-card/90 rounded-2xl shadow-sm border">
                <CardContent className="p-0">
                  <AccordionItem value={`faq-${i}`} className="px-6">
                    <AccordionTrigger className="text-left text-lg md:text-xl font-bold leading-snug">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </CardContent>
              </Card>
            ))}
          </Accordion>
        </div>
      </section>

      {/* === CTA SECTION (unchanged layout; refined tokens) === */}
      <section
        id="signup"
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-t border-border bg-gradient-to-b from-muted via-background to-muted"
      >
        {/* Animated background elements */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 70% at 60% 40%, hsl(var(--muted-foreground)/0.08) 0%, transparent 80%)",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-40 left-1/2 h-[650px] w-[1100px] -translate-x-1/2 rounded-full blur-[180px] bg-[radial-gradient(circle_at_center,_hsl(var(--foreground)/0.10),_transparent_80%)]"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-10 lg:px-20 py-28 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-center"
            style={{ letterSpacing: "-.02em" }}
          >
            Stop studying hard. Start learning{" "}
            <span className="underline decoration-primary/30 decoration-4 underline-offset-4">smart</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
            className="mt-8 max-w-3xl text-center text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed"
          >
            Let LetsReWise turn your messy notes and PDFs into crystal-clear quizzes, adaptive flashcards, and
            intelligent revision plans—automatically. Our users cut their study time by <strong>50%</strong> and
            retain more by doing less. If you can upload it, you can master it.
          </motion.p>

          {/* 3 benefit cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
          >
            {[
              {
                title: "No setup required",
                text: "Upload your document and start learning instantly. LetsReWise does all the structuring, summarizing, and quizzing for you.",
              },
              {
                title: "AI-powered mastery engine",
                text: "Your quizzes evolve as you do — focusing on your weak areas and adapting with every session, like a personal tutor who never sleeps.",
              },
              {
                title: "Loved by exam toppers & professionals",
                text: "From SQE and ACCA to onboarding and certifications, our learners trust LetsReWise to make complex material simple and unforgettable.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="bg-card/80 rounded-2xl border shadow-sm hover:shadow-lg transition"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Email capture */}
          <motion.form
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            onSubmit={handleSignup}
            className="mt-14 w-full max-w-xl flex flex-col sm:flex-row items-center gap-4 bg-card/90 rounded-[2rem] p-5 shadow-lg border"
          >
            <Input
              type="email"
              required
              placeholder="Enter your email to start free"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 w-full rounded-full px-5 py-6 text-lg font-semibold"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit" className="rounded-full px-8 py-6 text-lg font-bold">
                Get Started Free
              </Button>
            </motion.div>
          </motion.form>

          {status && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-base text-muted-foreground font-semibold">
              {status}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 text-sm text-muted-foreground max-w-xl text-center"
          >
            No credit card required · Start instantly · Cancel anytime
          </motion.p>
        </div>
      </section>
    </main>
  );
}

// Monochrome pixel-accurate wave divider (unchanged)
function WaveDivider() {
  return (
    <div className="relative h-12">
      <svg
        className="absolute bottom-0 left-0 h-full w-full text-foreground/10"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,40 C240,120 480,0 720,60 C960,120 1200,20 1440,60 L1440,100 L0,100 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
