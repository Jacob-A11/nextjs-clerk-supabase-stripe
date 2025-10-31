"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import posthog from "posthog-js";
import { Inter, Roboto_Mono } from "next/font/google";

const geistSans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// --- Animation helpers for staggered entrance
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
  // PostHog analytics/events
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
  // Clerk redirect
  useEffect(() => {
    if (user) location.assign("/onboarding");
  }, [user]);

  // Framer-motion scroll progress
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  // Parallax blobs
  const heroBlobX = useTransform(scrollY, [0, 400], [0, -60]);
  const heroBlobY = useTransform(scrollY, [0, 400], [0, 30]);
  const footerBlobX = useTransform(scrollY, [0, 400], [0, 60]);
  const footerBlobY = useTransform(scrollY, [0, 400], [0, -30]);

  // CTA tracking
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

  return (
    <main
      id="top"
      className={`relative bg-white text-black ${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ fontFamily: "var(--font-geist-sans), var(--font-geist-mono), ui-monospace, monospace" }}
    >
      {/* Scroll progress bar */}
      <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86]" />

      {/* === HERO SECTION === */}
      <section className="relative overflow-hidden border-b border-black/10 bg-gradient-to-br from-[#f5f7fa] via-[#f3f5fa] to-[#e8eaf6] min-h-[96vh] flex items-center justify-center">
        {/* Animated gradient blobs & parallax */}
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-20 pointer-events-none"
        >
          {/* Main animated gradient blob */}
          <motion.div
            className="absolute top-[-18%] left-1/2 h-[950px] w-[1300px] -translate-x-1/2 rounded-full blur-[160px] bg-gradient-to-tr from-[#5f6cff33] via-[#3ddad766] to-[#a2ff8622]"
            style={{
              x: heroBlobX,
              y: heroBlobY,
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Parallax subtle glow */}
          <motion.div
            className="absolute -bottom-64 left-[10%] h-[600px] w-[800px] rounded-full blur-[120px] bg-gradient-to-br from-[#5f6cff22] via-[#3ddad722] to-[#a2ff8611]"
            style={{
              x: heroBlobX,
              y: heroBlobY,
            }}
            animate={{ opacity: [0.65, 0.4, 0.65] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Scroll-based animated blob right */}
          <motion.div
            className="absolute top-1/3 right-[-18%] h-[400px] w-[600px] rounded-full blur-[120px] bg-gradient-to-tr from-[#a2ff8611] via-[#5f6cff11] to-[#3ddad722]"
            style={{
              x: footerBlobX,
              y: footerBlobY,
            }}
            animate={{ opacity: [0.45, 0.3, 0.45] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20 text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[clamp(3.8rem,8vw,6.2rem)] font-black leading-[1.03] tracking-tight text-black drop-shadow-[0_2px_24px_rgba(60,60,80,0.10)]"
            style={{ letterSpacing: "-.025em" }}
          >
            <span className="bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] bg-clip-text text-transparent">Shape</span> your documents into
            <br className="hidden sm:block" />
            quizzes that <span className="underline decoration-[#5f6cff]/30 decoration-4 underline-offset-8">work your way</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mx-auto mt-6 max-w-3xl text-xl md:text-2xl text-black/80 font-medium tracking-wide leading-relaxed"
            style={{ letterSpacing: "-.01em" }}
          >
            LetsReWise builds <span className="font-bold text-[#5f6cff]">clean quizzes</span> and <span className="font-bold text-[#3ddad7]">flashcards</span> from your notes in minutes. <span className="text-black/70">No coding. No setup.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="mx-auto mt-12 w-full max-w-[860px]"
          >
            <div className="relative rounded-[32px] border border-black/15 bg-white/90 shadow-[0_8px_48px_rgba(60,60,80,0.07)] hover:shadow-[0_16px_64px_rgba(60,60,80,0.13)] transition-shadow duration-300 backdrop-blur-md group">
              <input
                type="text"
                placeholder="Make a note-taking quiz that …"
                aria-label="Describe what you want to study"
                className="h-[84px] w-full rounded-[32px] bg-transparent px-8 pr-24 text-[1.22rem] outline-none placeholder:text-black/40 font-semibold group-hover:bg-black/2 transition"
              />
              <button
                onClick={handleStartForFreeClick}
                className="absolute right-5 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#5f6cff] to-[#3ddad7] text-white hover:bg-white hover:text-black border border-black/10 shadow-lg transition-all duration-200"
                aria-label="Generate"
              >
                <span className="text-2xl">↑</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="mx-auto mt-10 flex max-w-[980px] flex-wrap items-center justify-center gap-3"
          >
            {[
              "SQE: Solicitors Qualifying Exam",
              "ACCA Fundamentals",
              "Onboarding Portal",
              "Room Visualizer",
              "Networking Basics",
            ].map((chip, i) => (
              <button
                key={i}
                className="rounded-full border border-black/15 bg-white/80 px-5 py-2 text-base text-black/80 hover:bg-gradient-to-r hover:from-[#5f6cff] hover:to-[#3ddad7] hover:text-white hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#5f6cff] transition-all duration-200 font-semibold"
                onClick={() => posthog.capture('chip_click', { chip })}
                tabIndex={0}
              >
                {chip}
              </button>
            ))}
          </motion.div>

          <div className="mt-12 text-2xl text-black/70 font-mono tracking-wide">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#f5f7fa] to-[#e8eaf6] shadow-sm border border-black/10 backdrop-blur-sm">Upload → Learn → Revise → Retake → Master</span>
          </div>
        </div>

        <WaveDivider />
      </section>

      {/* === FEATURES (World-class gradient cards, premium spacing, micro-interactions) === */}
      <section className="border-t border-black/10 bg-gradient-to-b from-[#fcfcff] via-[#f5f7fa] to-[#e8eaf6]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
          <div className="py-[clamp(6rem,11vw,10rem)] text-center">
            <motion.h2
              {...parentStagger}
              className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] bg-clip-text text-transparent"
              style={{ letterSpacing: "-.02em" }}
            >
              Consider yourself limitless.
            </motion.h2>
            <motion.p
              {...parentStagger}
              className="mt-5 text-xl md:text-2xl text-black/70 font-medium"
            >
              If you can describe it, you can master it.
            </motion.p>
          </div>

          <div className="flex flex-col gap-[10rem]">
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
                } items-center gap-16 lg:gap-32 rounded-[48px] bg-gradient-to-br from-[#f7fafd]/90 to-[#f5f7fa]/70 border border-black/10 p-12 md:p-16 shadow-[0_12px_64px_rgba(60,60,80,0.10)] hover:shadow-[0_24px_88px_rgba(60,60,80,0.17)] transition-shadow duration-400 group`}
              >
                {/* Text Content */}
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h3 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-black group-hover:text-[#5f6cff] transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="mt-6 text-black/70 text-lg md:text-xl leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                  <button
                    onClick={handleStartForFreeClick}
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] px-8 py-4 text-lg font-bold text-white shadow-lg hover:from-[#3ddad7] hover:to-[#5f6cff] border-2 border-transparent hover:border-[#5f6cff] transition-all duration-200"
                  >
                    Start Learning
                  </button>
                </div>

                {/* Image Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="lg:w-1/2 relative rounded-[40px] overflow-hidden shadow-[0_16px_64px_rgba(60,60,80,0.15)] border border-black/5 bg-white/95 hover:scale-105 hover:shadow-[0_24px_80px_rgba(60,60,80,0.21)] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#f5f7fa] via-white to-[#e8eaf6] rounded-[40px]" />
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="relative w-full h-auto object-contain rounded-[40px] transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS (Cinematic, dual infinite scroll, premium micro-interactions) === */}
      <section className="relative border-t border-black/10 bg-gradient-to-b from-[#f7fafd] via-[#f0f2f8] to-[#e8eaf6] overflow-hidden mt-[9rem]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20 py-[clamp(6rem,10vw,9rem)] text-center">
          <motion.h2
            {...parentStagger}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-black drop-shadow-[0_2px_24px_rgba(60,60,80,0.10)]"
            style={{ letterSpacing: "-.01em" }}
          >
            “Okay, <span className="bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] bg-clip-text text-transparent">@letsrewise</span> has blown my mind.”
          </motion.h2>
          <motion.p
            {...parentStagger}
            className="mt-5 text-xl md:text-2xl text-black/70 font-medium"
          >
            And other great things our users say about us.
          </motion.p>
          <button
            onClick={handleStartForFreeClick}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] px-8 py-4 text-lg font-bold text-white shadow-lg hover:from-[#3ddad7] hover:to-[#5f6cff] border-2 border-transparent hover:border-[#5f6cff] transition-all duration-200"
          >
            Start Learning
          </button>
        </div>

        {/* Infinite Scrolling Testimonials */}
        <div className="relative w-full overflow-hidden py-20">
          {/* First Row */}
          <div className="flex animate-scroll-left gap-8 md:gap-12 w-max mb-12">
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
              <div
                key={i}
                className="min-w-[420px] bg-white/95 rounded-2xl border border-black/10 shadow-lg p-7 flex flex-col justify-between text-left hover:shadow-2xl hover:scale-[1.035] transition-all duration-250 group backdrop-blur-md"
                tabIndex={0}
              >
                <p className="text-black/90 text-lg leading-relaxed line-clamp-4 font-medium group-hover:text-[#5f6cff] transition-colors">“{t.text}”</p>
                <div className="mt-7 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-black/10 overflow-hidden border border-black/10 shadow">
                      <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-black">{t.name}</p>
                      <p className="text-xs text-black/50">Beta User</p>
                    </div>
                  </div>
                  <div className="text-black/40 text-lg font-bold uppercase">{t.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row (opposite direction) */}
          <div className="flex animate-scroll-right gap-8 md:gap-12 w-max">
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
              <div
                key={i}
                className="min-w-[420px] bg-white/95 rounded-2xl border border-black/10 shadow-lg p-7 flex flex-col justify-between text-left hover:shadow-2xl hover:scale-[1.035] transition-all duration-250 group backdrop-blur-md"
                tabIndex={0}
              >
                <p className="text-black/90 text-lg leading-relaxed line-clamp-4 font-medium group-hover:text-[#5f6cff] transition-colors">“{t.text}”</p>
                <div className="mt-7 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-black/10 overflow-hidden border border-black/10 shadow">
                      <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-black">{t.name}</p>
                      <p className="text-xs text-black/50">Beta User</p>
                    </div>
                  </div>
                  <div className="text-black/40 text-lg font-bold uppercase">{t.icon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
      {/* === PRICING (Investor-grade, cinematic, glossy cards) === */}
      <section id="pricing" className="relative border-t border-black/10 bg-gradient-to-br from-[#0d1117] via-[#171b22] to-[#23272f] text-white py-[clamp(7rem,11vw,10rem)] overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-24">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
              >
                Pricing plans for{" "}
                <span className="bg-gradient-to-r from-[#5f6cff] to-[#a2ff86] bg-clip-text text-transparent">every learner</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="mt-6 text-xl text-white/70 max-w-xl font-medium"
              >
                Start for free and scale as you go with flexible plans designed to match your learning goals.
              </motion.p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-14">
            {/* Free Plan */}
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full md:w-[440px] bg-gradient-to-br from-[#fafdff] via-[#f5f7fa] to-[#e8eaf6] text-black rounded-[36px] shadow-[0_0_90px_rgba(120,180,255,0.09)] p-12 border border-white/10 hover:scale-105 hover:shadow-[0_12px_64px_rgba(120,180,255,0.13)] transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.99) 0%, rgba(245,250,255,0.96) 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255,255,255,0.2), 0 24px 80px rgba(60,60,80,0.16)",
              }}
            >
              <h3 className="text-3xl font-bold mb-8">Start for free.</h3>
              <ul className="space-y-4 mb-10 text-black/80 text-lg">
                <li>✅ 3 uploads per month</li>
                <li>✅ Auto-generated quizzes</li>
                <li>✅ Smart flashcards</li>
                <li>✅ Daily quick revision</li>
              </ul>
              <button
                onClick={handleStartForFreeClick}
                className="rounded-full bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] text-white py-4 px-9 text-lg font-bold shadow-lg hover:from-[#3ddad7] hover:to-[#5f6cff] border-2 border-transparent hover:border-[#5f6cff] transition-all duration-200"
              >
                Start Learning
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ y: 64, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.18 }}
              className="relative w-full md:w-[440px] bg-gradient-to-br from-[#fcfcff] via-[#f5f7fa] to-[#e8eaf6] text-black rounded-[36px] shadow-[0_0_90px_rgba(120,180,255,0.12)] p-12 border border-white/10 hover:scale-105 hover:shadow-[0_12px_64px_rgba(120,180,255,0.17)] transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,250,255,0.95) 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255,255,255,0.22), 0 24px 90px rgba(60,60,80,0.20)",
              }}
            >
              <h3 className="text-3xl font-bold mb-8">Pro plan</h3>
              <p className="text-5xl font-extrabold mb-10">
                £9.99<span className="text-lg font-normal text-black/60">/month</span>
              </p>
              <ul className="space-y-4 mb-10 text-black/80 text-lg">
                <li>✨ Unlimited uploads</li>
                <li>✨ AI Revision Coach</li>
                <li>✨ Share &amp; export sets</li>
                <li>✨ Priority support</li>
              </ul>
              <button
                onClick={handleSeePricingClick}
                className="rounded-full bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] text-white py-4 px-9 text-lg font-bold shadow-lg hover:from-[#3ddad7] hover:to-[#5f6cff] border-2 border-transparent hover:border-[#5f6cff] transition-all duration-200"
              >
                Go Pro
              </button>
            </motion.div>
          </div>
        </div>

        {/* Subtle gradient glow under cards */}
        <div className="absolute inset-x-0 bottom-0 h-[340px] bg-gradient-to-t from-[#aef25d33] via-transparent to-transparent pointer-events-none" />
      </section>
      {/* === FOUNDER/TEAM VISION/MISSION SECTION FOR INVESTORS === */}
      <section className="border-t border-black/10 bg-gradient-to-br from-[#f5f7fa] via-[#e8eaf6]/60 to-[#f0f4f8] py-[clamp(6rem,10vw,8rem)]">
        <div className="mx-auto max-w-3xl px-6 md:px-10 lg:px-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] bg-clip-text text-transparent mb-6"
            style={{ letterSpacing: "-.01em" }}
          >
            Our Mission &amp; Vision
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="text-xl md:text-2xl text-black/80 font-medium leading-relaxed mb-8"
          >
            LetsReWise was founded by passionate educators, engineers, and lifelong learners who struggled with inefficient, one-size-fits-all study tools. Our founder, Sree, experienced firsthand how generic flashcards and rigid systems failed to unlock true mastery. We set out to build a smarter, more adaptive way to learn—one that understands your unique needs and empowers you to reach your full potential.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.10, duration: 0.6 }}
            className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto mb-6"
          >
            <span className="font-bold text-[#5f6cff]">Our vision:</span> To make mastery effortless and accessible for every learner, everywhere. We believe in learning that’s deeply personal, beautifully designed, and powered by intelligent technology.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="text-base md:text-lg text-black/60"
          >
            LetsReWise is built on trust, privacy, and relentless innovation. We’re here to help everyone—students, professionals, teams—learn smarter, not harder. <br />
            <span className="italic text-black/80">Join us as we redefine what’s possible in education, one quiz at a time.</span>
          </motion.p>
          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 justify-center">
              <img src="/logo-mark.svg" alt="LetsReWise logo" className="h-8 w-8 rounded-full bg-[#5f6cff]/10" />
              <span className="text-lg font-bold text-black">Sree &amp; Team</span>
            </div>
            <span className="text-sm text-black/40">Founder &amp; Team, LetsReWise</span>
          </div>
        </div>
      </section>

      {/* === FAQ (Redesigned, Base44-style) === */}
      <section
        id="faq"
        className="border-t border-black/10 bg-gradient-to-br from-[#f5f7fa] via-[#e8eaf6] to-[#f0f4f8] py-[clamp(6rem,10vw,9rem)]"
      >
        <div className="mx-auto max-w-4xl px-6 md:px-10 lg:px-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] bg-clip-text text-transparent"
            style={{ letterSpacing: "-.01em" }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="flex flex-col gap-6">
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 + i * 0.05, ease: "easeOut" }}
                className="bg-white/90 rounded-2xl p-6 shadow-[0_2px_24px_rgba(60,60,80,0.06)] border border-black/10"
              >
                <details className="group transition-all duration-300">
                  <summary className="flex items-center justify-between cursor-pointer text-lg md:text-xl font-bold leading-snug text-[#2b2e49] group-open:text-[#5f6cff] transition-colors">
                    <span>{item.q}</span>
                    <span className="ml-4 text-3xl leading-none text-[#a2a8b8] group-open:rotate-45 transition-transform duration-200 select-none">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 text-black/80 text-base md:text-lg leading-relaxed font-sans">
                    {item.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === HERO-STYLE CTA (Conversion-Optimized, Grey Gradient) === */}
      <section
        id="signup"
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-t border-black/10 bg-gradient-to-b from-[#f7f7f8] via-[#ececec] to-[#e6e6e8]"
      >
        {/* Animated background elements */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 70% at 60% 40%, rgba(0,0,0,0.05) 0%, transparent 80%)",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-40 left-1/2 h-[650px] w-[1100px] -translate-x-1/2 rounded-full blur-[180px] bg-[radial-gradient(circle_at_center,_rgba(60,60,80,0.08),_transparent_80%)]"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-10 lg:px-20 py-28 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-center bg-gradient-to-r from-[#4c4c4c] via-[#2d2d2d] to-[#000000] bg-clip-text text-transparent"
            style={{ letterSpacing: "-.02em" }}
          >
            Stop studying hard. Start learning <span className="underline decoration-[#5f6cff]/30 decoration-4 underline-offset-4">smart</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
            className="mt-8 max-w-3xl text-center text-xl md:text-2xl text-[#2b2e49]/80 font-medium leading-relaxed"
          >
            Let LetsReWise turn your messy notes and PDFs into crystal-clear quizzes, adaptive flashcards, and
            intelligent revision plans—automatically. Our users cut their study time by <strong>50%</strong> and
            retain more by doing less. If you can upload it, you can master it.
          </motion.p>

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
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 rounded-2xl border border-black/10 p-6 shadow-[0_6px_20px_rgba(0,0,0,0.05)] backdrop-blur-sm"
              >
                <h3 className="text-lg md:text-xl font-semibold text-black mb-3">{item.title}</h3>
                <p className="text-black/70 text-base leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            onSubmit={handleSignup}
            className="mt-14 w-full max-w-xl flex flex-col sm:flex-row items-center gap-4 bg-white/90 rounded-[2rem] p-5 shadow-[0_8px_40px_rgba(60,60,80,0.08)] border border-black/10"
          >
            <input
              type="email"
              required
              placeholder="Enter your email to start free"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 w-full rounded-full border border-black/20 px-5 py-4 text-lg font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#5f6cff] bg-white"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-full bg-gradient-to-r from-[#5f6cff] via-[#3ddad7] to-[#a2ff86] px-8 py-4 text-lg font-bold text-white shadow-lg hover:from-[#3ddad7] hover:to-[#5f6cff] transition-colors border-2 border-transparent hover:border-[#5f6cff]"
            >
              Get Started Free
            </motion.button>
          </motion.form>

          {status && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-base text-[#2b2e49]/80 font-semibold"
            >
              {status}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 text-sm text-black/50 max-w-xl text-center"
          >
            No credit card required · Start instantly · Cancel anytime
          </motion.p>
        </div>
      </section>

      {/* === FOOTER (Investor-grade, logo mark, tagline, compact, social links placeholder) === */}
      <footer className="relative border-t border-black/10 bg-gradient-to-r from-[#f5f7fa] via-[#e8eaf6] to-[#f0f4f8] py-8 px-6 md:px-10 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-6 z-30">
        {/* Logo + tagline */}
        <div className="flex items-center gap-4">
          <img src="/logo-mark.svg" alt="LetsReWise Logo" className="h-10 w-10 rounded-full border border-black/10 shadow bg-white/70" />
          <span className="text-xl font-extrabold tracking-tight text-black">LetsReWise</span>
        </div>
        <span className="text-base text-black/60 font-medium mt-2 md:mt-0">
          <span className="font-semibold text-black">Smarter revision, effortless mastery.</span>
        </span>
        {/* Social links placeholder */}
        <div className="flex items-center gap-4">
          {/* Replace with actual links/icons */}
          <a href="#" className="rounded-full bg-white/80 border border-black/10 p-2 shadow-sm hover:bg-[#5f6cff]/10 transition" aria-label="Twitter">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#5f6cff" fillOpacity="0.09"/><path d="M7.5 15c5 0 7.73-4.13 7.73-7.72 0-.12 0-.24-.01-.36A5.49 5.49 0 0 0 17 5.38a5.36 5.36 0 0 1-1.54.42A2.7 2.7 0 0 0 16.5 4.2a5.34 5.34 0 0 1-1.7.65A2.67 2.67 0 0 0 10 7.42c0 .21.02.41.06.6A7.62 7.62 0 0 1 4.1 4.86a2.66 2.66 0 0 0 .83 3.56A2.63 2.63 0 0 1 3.2 7.6v.03c0 1.28.91 2.36 2.15 2.6a2.7 2.7 0 0 1-1.21.05c.34 1.05 1.32 1.81 2.49 1.83A5.37 5.37 0 0 1 3 14.12c.33.19.7.3 1.1.3" stroke="#5f6cff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="#" className="rounded-full bg-white/80 border border-black/10 p-2 shadow-sm hover:bg-[#3ddad7]/10 transition" aria-label="LinkedIn">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#3ddad7" fillOpacity="0.09"/><path d="M6.5 8.5v5m0 0v-5m0 5h1.5m-1.5 0H5m3.5-3V8.5A1.5 1.5 0 0 1 10 7h0a1.5 1.5 0 0 1 1.5 1.5v1.5m0 0v3m0-3h1.5m-1.5 0H9.5" stroke="#3ddad7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="#" className="rounded-full bg-white/80 border border-black/10 p-2 shadow-sm hover:bg-[#a2ff86]/10 transition" aria-label="Email">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#a2ff86" fillOpacity="0.09"/><path d="M4 7.5v5A2.5 2.5 0 0 0 6.5 15h7A2.5 2.5 0 0 0 16 12.5v-5A2.5 2.5 0 0 0 13.5 5h-7A2.5 2.5 0 0 0 4 7.5Z" stroke="#a2ff86" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="m4.5 7.75 5.5 3.5 5.5-3.5" stroke="#a2ff86" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </footer>
    </main>
  );
}

// Monochrome pixel-accurate wave divider (slightly elevated for cinematic flow)
function WaveDivider() {
  return (
    <div className="relative h-14">
      <svg
        className="absolute bottom-0 left-0 h-full w-full text-black/10"
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