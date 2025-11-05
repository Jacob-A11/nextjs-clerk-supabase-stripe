// lib/ai/quiz-generator.ts
// AI-powered quiz generation using OpenAI

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QuizQuestion {
  questionText: string;
  questionType: "multiple_choice" | "true_false" | "short_answer" | "fill_blank";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export interface QuizGenerationOptions {
  documentChunks: string[];
  questionCount: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  topics?: string[];
  questionTypes?: string[];
}

/**
 * Generate quiz questions from document chunks using GPT-4o-mini
 */
export async function generateQuizQuestions(
  options: QuizGenerationOptions
): Promise<QuizQuestion[]> {
  const {
    documentChunks,
    questionCount,
    difficulty = "medium",
    topics = [],
    questionTypes = ["multiple_choice", "true_false"],
  } = options;

  // Combine document chunks into context
  const context = documentChunks.join("\n\n");

  // Construct the prompt
  const systemPrompt = `You are an expert educator creating high-quality quiz questions from study materials.

Your questions should:
1. Test understanding, not just memorization
2. Have clear, unambiguous correct answers
3. Include plausible distractors that reveal common misconceptions
4. Provide detailed, educational explanations
5. Be appropriate for the specified difficulty level

Output ONLY valid JSON, no additional text.`;

  const userPrompt = `Create ${questionCount} quiz questions from the following study material.

STUDY MATERIAL:
${context}

REQUIREMENTS:
- Difficulty: ${difficulty}
- Question types: ${questionTypes.join(", ")}
${topics.length > 0 ? `- Focus on topics: ${topics.join(", ")}` : ""}

OUTPUT FORMAT (JSON array):
[
  {
    "questionText": "What is...?",
    "questionType": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "Detailed explanation of why this is correct...",
    "difficulty": "medium",
    "tags": ["topic1", "topic2"]
  }
]

Generate ${questionCount} questions now:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions || [];

    // Validate and normalize questions
    return questions.map((q: any) => ({
      questionText: q.questionText || q.question || "",
      questionType: q.questionType || "multiple_choice",
      options: q.options || [],
      correctAnswer: q.correctAnswer || q.answer || "",
      explanation: q.explanation || "",
      difficulty: q.difficulty || difficulty,
      tags: q.tags || [],
    }));
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
}

/**
 * Generate a single AI explanation for a question
 */
export async function generateExplanation(
  question: string,
  correctAnswer: string,
  userAnswer: string,
  context?: string
): Promise<string> {
  const prompt = `Explain why the correct answer to this question is "${correctAnswer}" and why "${userAnswer}" is ${
    userAnswer === correctAnswer ? "correct" : "incorrect"
  }.

Question: ${question}
${context ? `Context: ${context}` : ""}

Provide a clear, educational explanation in 2-3 sentences.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || "No explanation available.";
  } catch (error: any) {
    console.error("Explanation generation error:", error);
    return "Unable to generate explanation at this time.";
  }
}

/**
 * Validate quiz questions for quality
 */
export function validateQuizQuestions(questions: QuizQuestion[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  questions.forEach((q, index) => {
    if (!q.questionText || q.questionText.length < 10) {
      errors.push(`Question ${index + 1}: Question text too short`);
    }

    if (!q.correctAnswer) {
      errors.push(`Question ${index + 1}: Missing correct answer`);
    }

    if (q.questionType === "multiple_choice") {
      if (!q.options || q.options.length < 2) {
        errors.push(`Question ${index + 1}: Multiple choice needs at least 2 options`);
      }

      if (q.options && !q.options.includes(q.correctAnswer)) {
        errors.push(`Question ${index + 1}: Correct answer not in options`);
      }
    }

    if (!q.explanation || q.explanation.length < 20) {
      errors.push(`Question ${index + 1}: Explanation too short or missing`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate flashcards from document chunks
 */
export async function generateFlashcards(
  documentChunks: string[],
  count: number = 10
): Promise<Array<{ front: string; back: string; hint?: string }>> {
  const context = documentChunks.join("\n\n");

  const prompt = `Create ${count} flashcards from the following study material. Each flashcard should have a clear question/concept on the front and a concise answer on the back.

STUDY MATERIAL:
${context}

OUTPUT FORMAT (JSON array):
[
  {
    "front": "What is...?",
    "back": "Concise answer...",
    "hint": "Optional hint..."
  }
]

Generate ${count} flashcards now:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.flashcards || [];
  } catch (error: any) {
    console.error("Flashcard generation error:", error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
}

/**
 * Analyze document and extract topics
 */
export async function analyzeDocument(text: string): Promise<{
  topics: string[];
  difficulty: string;
  summary: string;
  wordCount: number;
}> {
  const prompt = `Analyze this study material and provide:
1. Main topics (3-5 key topics)
2. Difficulty level (easy, medium, hard, expert)
3. Brief summary (2-3 sentences)

MATERIAL:
${text.substring(0, 3000)}

OUTPUT FORMAT (JSON):
{
  "topics": ["topic1", "topic2", "topic3"],
  "difficulty": "medium",
  "summary": "Brief summary..."
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return {
      topics: parsed.topics || [],
      difficulty: parsed.difficulty || "medium",
      summary: parsed.summary || "",
      wordCount: text.split(/\s+/).length,
    };
  } catch (error: any) {
    console.error("Document analysis error:", error);
    return {
      topics: [],
      difficulty: "medium",
      summary: "",
      wordCount: text.split(/\s+/).length,
    };
  }
}

/**
 * Generate embeddings for text chunks
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
      dimensions: 512,
    });

    return response.data.map((item) => item.embedding);
  } catch (error: any) {
    console.error("Embedding generation error:", error);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

/**
 * Cost estimation for AI operations
 */
export function estimateAICost(operation: string, units: number): number {
  const costs = {
    quiz_generation: 0.002, // per question
    flashcard_generation: 0.001, // per flashcard
    explanation: 0.0005, // per explanation
    embedding: 0.00001, // per chunk
    analysis: 0.001, // per document
  };

  return (costs[operation as keyof typeof costs] || 0) * units;
}
