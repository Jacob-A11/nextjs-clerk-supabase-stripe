// app/api/quizzes/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, answers, timeTaken, startedAt } = body;

    if (!quizId || !answers) {
      return NextResponse.json({ error: "Quiz ID and answers required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get quiz and questions
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index");

    if (!questions) {
      return NextResponse.json({ error: "Questions not found" }, { status: 404 });
    }

    // Grade the quiz
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const gradedAnswers: Record<string, any> = {};

    questions.forEach((question) => {
      const userAnswer = answers[question.id];

      if (!userAnswer || userAnswer === "") {
        skippedCount++;
        gradedAnswers[question.id] = {
          questionText: question.question_text,
          userAnswer: null,
          correctAnswer: question.correct_answer,
          isCorrect: false,
          explanation: question.explanation,
          skipped: true,
        };
      } else {
        const isCorrect =
          userAnswer.toLowerCase().trim() ===
          question.correct_answer.toLowerCase().trim();

        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
        }

        gradedAnswers[question.id] = {
          questionText: question.question_text,
          userAnswer,
          correctAnswer: question.correct_answer,
          isCorrect,
          explanation: question.explanation,
          skipped: false,
        };
      }
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= (quiz.passing_score || 70);

    // Save quiz attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        total_questions: totalQuestions,
        correct_answers: correctCount,
        incorrect_answers: incorrectCount,
        skipped_answers: skippedCount,
        time_taken: timeTaken,
        started_at: startedAt || new Date().toISOString(),
        completed_at: new Date().toISOString(),
        answers: gradedAnswers,
        status: "completed",
        passed,
      })
      .select()
      .single();

    if (attemptError) {
      console.error("Attempt creation error:", attemptError);
      return NextResponse.json({ error: "Failed to save quiz attempt" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        score,
        passed,
        correctCount,
        incorrectCount,
        skippedCount,
        totalQuestions,
        gradedAnswers,
      },
    });
  } catch (error: any) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve quiz attempts
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quizId");
    const attemptId = searchParams.get("attemptId");

    const supabase = await createClient();

    if (attemptId) {
      // Get specific attempt
      const { data: attempt, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("id", attemptId)
        .eq("user_id", userId)
        .single();

      if (error || !attempt) {
        return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
      }

      return NextResponse.json({ attempt });
    } else if (quizId) {
      // Get all attempts for a quiz
      const { data: attempts, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("quiz_id", quizId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: "Failed to fetch attempts" }, { status: 500 });
      }

      return NextResponse.json({ attempts: attempts || [] });
    } else {
      // Get all user's attempts
      const { data: attempts, error } = await supabase
        .from("quiz_attempts")
        .select("*, quizzes(title)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return NextResponse.json({ error: "Failed to fetch attempts" }, { status: 500 });
      }

      return NextResponse.json({ attempts: attempts || [] });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
