import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Check, Upload, Brain, BarChart3, Zap, Shield, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">LetsReWise</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Start for Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              Upload → Learn → Revise → Retake → Master
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Transform your documents into intelligent quizzes
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
              Upload your notes, PDFs, or study materials and let AI create personalized quizzes, flashcards, and revision plans—automatically. Cut your study time by 50%.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="text-base px-8">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="text-base px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Start instantly · Cancel anytime
            </p>
          </div>
        </section>

        {/* Product Preview */}
        <section className="container pb-24">
          <div className="mx-auto max-w-6xl">
            <Card className="overflow-hidden border-2">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-center p-8">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Dashboard Preview</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload documents, generate quizzes, track progress
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-24 bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything you need to master any subject
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Powered by AI, designed for learners. From document upload to exam mastery.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <Card>
                <CardHeader>
                  <Upload className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Instant Document Processing</CardTitle>
                  <CardDescription>
                    Upload PDFs, Word docs, or notes. Our AI extracts key concepts and generates quizzes in seconds.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2 */}
              <Card>
                <CardHeader>
                  <Brain className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>AI-Powered Quiz Generation</CardTitle>
                  <CardDescription>
                    GPT-4 creates contextual questions with multiple choice, true/false, and short answer formats.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Smart Flashcards</CardTitle>
                  <CardDescription>
                    Spaced repetition algorithm ensures you review at optimal intervals for maximum retention.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 4 */}
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Progress Analytics</CardTitle>
                  <CardDescription>
                    Track your performance, identify weak areas, and watch your scores improve over time.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 5 */}
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your documents and data are encrypted and protected with enterprise-grade security.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 6 */}
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>
                    Share quiz sets with classmates or study groups. Learn together, achieve together.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="container py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by students and professionals worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join 1,000+ learners who are mastering their exams with LetsReWise
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-4xl font-bold">50%</div>
                <p className="text-muted-foreground mt-2">Less study time needed</p>
              </div>
              <div>
                <div className="text-4xl font-bold">95%</div>
                <p className="text-muted-foreground mt-2">Pass rate improvement</p>
              </div>
              <div>
                <div className="text-4xl font-bold">1,000+</div>
                <p className="text-muted-foreground mt-2">Active learners</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container py-24 bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple, credit-based pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Pay only for what you use. All plans include full access to features.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Free Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">£0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    0 credits · Perfect for trying out
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Access to all features
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Buy credits as needed
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Community support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/sign-up" className="w-full">
                    <Button variant="outline" className="w-full">Get Started</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Starter Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">£9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    108 credits/month · For casual learners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      3 document uploads
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      36 quiz generations
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Unused credits roll over
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Email support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full">Start Learning</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="relative border-primary shadow-lg">
                <Badge className="absolute top-4 right-4">Most Popular</Badge>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">£29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    348 credits/month · For serious students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      11 document uploads
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      116 quiz generations
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Priority AI processing
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Priority support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full">Go Pro</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Team Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">£99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="mt-2">
                    1,200 credits/month · For groups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      40 document uploads
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      400 quiz generations
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Team collaboration
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Shared quiz libraries
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      Dedicated support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/sign-up" className="w-full">
                    <Button className="w-full">Get Team Plan</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Credit Costs */}
            <div className="mt-16 text-center">
              <h3 className="text-xl font-semibold mb-6">How credits work</h3>
              <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <div className="text-3xl font-bold">30</div>
                    <CardDescription>credits per document upload</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="text-3xl font-bold">3</div>
                    <CardDescription>credits per quiz generation</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="text-3xl font-bold">1</div>
                    <CardDescription>credit per AI explanation</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Need more credits? Purchase additional credits anytime at £0.003 per credit.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container py-24">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What makes LetsReWise different from other study tools?</AccordionTrigger>
                <AccordionContent>
                  LetsReWise uses advanced AI (GPT-4) to generate contextual, accurate quizzes from your documents. Unlike generic quiz tools, we analyze your specific content and create questions that test real understanding, not just memorization. Plus, our credit-based pricing means you only pay for what you use.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do credits work?</AccordionTrigger>
                <AccordionContent>
                  Credits are used for AI-powered features. Uploading a document costs 30 credits, generating a quiz costs 3 credits, and getting an AI explanation costs 1 credit. Monthly plans include credits that roll over if unused. You can also purchase additional credits anytime.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Is my data secure and private?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. All your documents and data are encrypted in transit and at rest. We use enterprise-grade security (Supabase with Row Level Security) to ensure your content stays private. We never share your data with third parties, and you can delete your account and all data anytime.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use LetsReWise for any subject or exam?</AccordionTrigger>
                <AccordionContent>
                  Yes! LetsReWise works with any subject—from law (SQE, Bar exams) to accounting (ACCA, CPA), medicine (USMLE), or university courses. Our AI adapts to your content and creates relevant questions regardless of the topic.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Do I need to format my notes in a special way?</AccordionTrigger>
                <AccordionContent>
                  No special formatting required! Upload PDFs, Word documents, or plain text files. Our AI automatically extracts key concepts and generates quizzes. The better organized your notes, the better the quizzes, but we handle messy notes too.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I share quiz sets with my study group?</AccordionTrigger>
                <AccordionContent>
                  Yes! Team plan users can share quiz sets and collaborate with classmates. You can also export quizzes as PDFs or share links to specific quiz sets.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>What's included in the free plan?</AccordionTrigger>
                <AccordionContent>
                  The free plan gives you access to all features but doesn't include monthly credits. You can purchase credits as needed to upload documents and generate quizzes. It's perfect for trying out the platform before committing to a paid plan.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>How fast can I start revising after upload?</AccordionTrigger>
                <AccordionContent>
                  Most documents are processed in under 60 seconds. Once uploaded, you can generate quizzes immediately. The AI works in the background to create embeddings for semantic search, but you don't have to wait for that to start learning.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container py-24 bg-muted/30">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to transform your learning?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Join thousands of students and professionals who are mastering their exams with AI-powered quizzes and flashcards.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="text-base px-8">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="text-base px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Start instantly · Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-bold mb-4">LetsReWise</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered learning platform for students and professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link href="/security" className="text-muted-foreground hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LetsReWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
