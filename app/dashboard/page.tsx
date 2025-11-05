"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Brain, Zap, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    credits: 0,
    documents: 0,
    quizzes: 0,
    attempts: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch credits
      const creditsRes = await fetch("/api/credits?action=balance");
      const creditsData = await creditsRes.json();

      // Fetch documents count
      const docsRes = await fetch("/api/documents/list");
      const docsData = await docsRes.json();

      // Fetch quizzes count
      const quizzesRes = await fetch("/api/quizzes/list");
      const quizzesData = await quizzesRes.json();

      // Fetch quiz attempts
      const attemptsRes = await fetch("/api/quizzes/submit");
      const attemptsData = await attemptsRes.json();

      const avgScore =
        attemptsData.attempts?.length > 0
          ? attemptsData.attempts.reduce((sum: number, a: any) => sum + a.score, 0) /
            attemptsData.attempts.length
          : 0;

      setStats({
        credits: creditsData.balance || 0,
        documents: docsData.documents?.length || 0,
        quizzes: quizzesData.quizzes?.length || 0,
        attempts: attemptsData.attempts?.length || 0,
        averageScore: Math.round(avgScore),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            LetsReWise
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{stats.credits}</span>
              <span className="text-sm text-muted-foreground">credits</span>
            </div>
            <Button asChild variant="outline">
              <Link href="/credits/purchase">Buy Credits</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents}</div>
              <p className="text-xs text-muted-foreground">Total uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.quizzes}</div>
              <p className="text-xs text-muted-foreground">Generated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attempts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attempts}</div>
              <p className="text-xs text-muted-foreground">Quiz attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <Progress value={stats.averageScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/upload">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Upload Document</CardTitle>
                    <CardDescription>
                      Upload a PDF, DOCX, or TXT file to get started
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/documents">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Generate Quiz</CardTitle>
                    <CardDescription>
                      Create AI-powered quizzes from your documents
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Tabs for Recent Activity */}
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Recent Documents</TabsTrigger>
            <TabsTrigger value="quizzes">Recent Quizzes</TabsTrigger>
            <TabsTrigger value="attempts">Recent Attempts</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Your recently uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDocuments />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Quizzes</CardTitle>
                <CardDescription>Your recently generated quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentQuizzes />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attempts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Attempts</CardTitle>
                <CardDescription>Your recent quiz attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAttempts />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function RecentDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents/list?limit=5");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No documents yet. Upload your first document to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc: any) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{doc.title}</p>
              <p className="text-sm text-muted-foreground">
                {doc.word_count} words • {doc.status}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/documents/${doc.id}`}>View</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

function RecentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes/list?limit=5");
      const data = await res.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No quizzes yet. Generate your first quiz from a document!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz: any) => (
        <div
          key={quiz.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{quiz.title}</p>
              <p className="text-sm text-muted-foreground">
                {quiz.question_count} questions • {quiz.difficulty}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/quiz/${quiz.id}`}>Start</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

function RecentAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await fetch("/api/quizzes/submit?limit=5");
      const data = await res.json();
      setAttempts(data.attempts || []);
    } catch (error) {
      console.error("Failed to fetch attempts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No attempts yet. Take your first quiz!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {attempts.map((attempt: any) => (
        <div
          key={attempt.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                attempt.passed ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
              }`}
            >
              <TrendingUp
                className={`h-5 w-5 ${
                  attempt.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              />
            </div>
            <div>
              <p className="font-medium">{attempt.quizzes?.title || "Quiz"}</p>
              <p className="text-sm text-muted-foreground">
                Score: {attempt.score}% • {attempt.passed ? "Passed" : "Failed"}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/quiz/${attempt.quiz_id}/results/${attempt.id}`}>Review</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
