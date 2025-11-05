// app/api/quizzes/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import { generateQuizQuestions, validateQuizQuestions } from "@/lib/ai/quiz-generator";
import { deductCredits, CREDIT_COSTS, hasEnoughCredits } from "@/lib/credits";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const {
      documentId,
      title,
      questionCount = 10,
      difficulty = "medium",
      questionTypes = ["multiple_choice", "true_false"],
    } = body;

    if (!documentId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, CREDIT_COSTS.QUIZ_GENERATION);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits", required: CREDIT_COSTS.QUIZ_GENERATION },
        { status: 402 }
      );
    }

    const supabase = await createClient();

    // Verify document exists and belongs to user
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (document.status !== "completed") {
      return NextResponse.json(
        { error: "Document is still processing" },
        { status: 400 }
      );
    }

    // Get document chunks for context
    const { data: chunks, error: chunksError } = await supabase
      .from("document_chunks")
      .select("content")
      .eq("document_id", documentId)
      .order("chunk_index")
      .limit(10); // Use first 10 chunks for quiz generation

    if (chunksError || !chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: "No content available for quiz generation" },
        { status: 400 }
      );
    }

    // Generate quiz questions using AI
    const questions = await generateQuizQuestions({
      documentChunks: chunks.map((c) => c.content),
      questionCount,
      difficulty,
      questionTypes,
      topics: document.topics || [],
    });

    // Validate generated questions
    const validation = validateQuizQuestions(questions);
    if (!validation.valid) {
      console.error("Question validation failed:", validation.errors);
      return NextResponse.json(
        { error: "Generated questions failed validation", details: validation.errors },
        { status: 500 }
      );
    }

    // Create quiz record
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: userId,
        document_id: documentId,
        title: title || `Quiz: ${document.title}`,
        difficulty,
        question_count: questions.length,
        status: "published",
      })
      .select()
      .single();

    if (quizError || !quiz) {
      console.error("Quiz creation error:", quizError);
      return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }

    // Insert questions
    const questionRecords = questions.map((q, index) => ({
      quiz_id: quiz.id,
      question_text: q.questionText,
      question_type: q.questionType,
      options: q.options || [],
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      order_index: index,
      tags: q.tags || [],
    }));

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(questionRecords);

    if (questionsError) {
      console.error("Questions insertion error:", questionsError);
      // Clean up quiz if questions failed
      await supabase.from("quizzes").delete().eq("id", quiz.id);
      return NextResponse.json({ error: "Failed to create questions" }, { status: 500 });
    }

    // Deduct credits
    await deductCredits(
      userId,
      CREDIT_COSTS.QUIZ_GENERATION,
      "quiz_generation",
      `Generated quiz: ${quiz.title}`,
      {
        quizId: quiz.id,
        documentId,
        questionCount: questions.length,
      }
    );

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        questionCount: questions.length,
        difficulty: quiz.difficulty,
      },
    });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve quiz with questions
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("id");

    if (!quizId) {
      return NextResponse.json({ error: "Quiz ID required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .eq("user_id", userId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index");

    if (questionsError) {
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }

    return NextResponse.json({
      quiz,
      questions: questions || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
