// lib/document-processing/text-extractor.ts
// Extract text from various document formats

import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export interface ExtractedDocument {
  text: string;
  pageCount?: number;
  wordCount: number;
  metadata?: Record<string, any>;
}

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    const data = await pdf(buffer);

    return {
      text: data.text,
      pageCount: data.numpages,
      wordCount: data.text.split(/\s+/).length,
      metadata: data.info,
    };
  } catch (error: any) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from DOCX buffer
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });

    return {
      text: result.value,
      wordCount: result.value.split(/\s+/).length,
      metadata: {},
    };
  } catch (error: any) {
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from plain text buffer
 */
export function extractTextFromTXT(buffer: Buffer): ExtractedDocument {
  const text = buffer.toString("utf-8");

  return {
    text,
    wordCount: text.split(/\s+/).length,
  };
}

/**
 * Main extraction function that handles all formats
 */
export async function extractText(
  buffer: Buffer,
  fileType: string
): Promise<ExtractedDocument> {
  const normalizedType = fileType.toLowerCase().replace(".", "");

  switch (normalizedType) {
    case "pdf":
      return await extractTextFromPDF(buffer);
    case "docx":
    case "doc":
      return await extractTextFromDOCX(buffer);
    case "txt":
    case "md":
    case "markdown":
      return extractTextFromTXT(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Clean and normalize extracted text
 */
export function cleanText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove special characters but keep punctuation
      .replace(/[^\w\s.,;:!?()-]/g, "")
      // Normalize line breaks
      .replace(/\n{3,}/g, "\n\n")
      // Trim
      .trim()
  );
}

/**
 * Split text into semantic chunks
 */
export function chunkText(
  text: string,
  options: {
    maxChunkSize?: number;
    overlap?: number;
    splitOn?: "paragraph" | "sentence" | "word";
  } = {}
): string[] {
  const { maxChunkSize = 1000, overlap = 100, splitOn = "paragraph" } = options;

  let chunks: string[] = [];

  if (splitOn === "paragraph") {
    // Split on double line breaks (paragraphs)
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);

    let currentChunk = "";
    for (const para of paragraphs) {
      if ((currentChunk + para).length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        // Add overlap
        const words = currentChunk.split(" ");
        currentChunk = words.slice(-Math.floor(overlap / 5)).join(" ") + " " + para;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + para;
      }
    }
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
  } else if (splitOn === "sentence") {
    // Split on sentence boundaries
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    let currentChunk = "";
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += " " + sentence;
      }
    }
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
  } else {
    // Split on words (fallback)
    const words = text.split(/\s+/);
    const wordsPerChunk = Math.floor(maxChunkSize / 5); // Rough estimate

    for (let i = 0; i < words.length; i += wordsPerChunk - Math.floor(overlap / 5)) {
      const chunk = words.slice(i, i + wordsPerChunk).join(" ");
      if (chunk.trim()) {
        chunks.push(chunk.trim());
      }
    }
  }

  return chunks.filter((chunk) => chunk.length > 50); // Filter out very small chunks
}

/**
 * Validate document before processing
 */
export function validateDocument(buffer: Buffer, fileType: string): {
  valid: boolean;
  error?: string;
} {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (buffer.length > maxSize) {
    return { valid: false, error: "File too large (max 10MB)" };
  }

  // Check file type
  const allowedTypes = ["pdf", "docx", "doc", "txt", "md"];
  const normalizedType = fileType.toLowerCase().replace(".", "");
  if (!allowedTypes.includes(normalizedType)) {
    return { valid: false, error: `Unsupported file type: ${fileType}` };
  }

  return { valid: true };
}

/**
 * Estimate processing time based on document size
 */
export function estimateProcessingTime(wordCount: number): number {
  // Rough estimate: 1000 words per second
  const baseTime = Math.ceil(wordCount / 1000);
  // Add overhead for AI processing
  return baseTime + 5; // seconds
}

/**
 * Extract metadata from document
 */
export function extractMetadata(text: string): {
  language: string;
  readingLevel: string;
  estimatedReadingTime: number;
} {
  const wordCount = text.split(/\s+/).length;

  // Simple language detection (very basic)
  const language = /[а-яА-Я]/.test(text) ? "ru" : "en";

  // Estimate reading level based on average word length
  const avgWordLength =
    text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / wordCount;
  const readingLevel =
    avgWordLength < 5 ? "easy" : avgWordLength < 7 ? "medium" : "advanced";

  // Estimate reading time (200 words per minute)
  const estimatedReadingTime = Math.ceil(wordCount / 200);

  return {
    language,
    readingLevel,
    estimatedReadingTime,
  };
}
