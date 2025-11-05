// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import { extractText, validateDocument, chunkText, cleanText } from "@/lib/document-processing/text-extractor";
import { generateEmbeddings, analyzeDocument } from "@/lib/ai/quiz-generator";
import { deductCredits, CREDIT_COSTS, hasEnoughCredits } from "@/lib/credits";

export const maxDuration = 60; // 60 seconds for document processing

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId, CREDIT_COSTS.DOCUMENT_UPLOAD);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient credits", required: CREDIT_COSTS.DOCUMENT_UPLOAD },
        { status: 402 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate document
    const fileType = file.name.split(".").pop() || "";
    const validation = validateDocument(buffer, fileType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = await createClient();

    // Upload file to Supabase Storage
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    // Extract text from document
    const extracted = await extractText(buffer, fileType);
    const cleanedText = cleanText(extracted.text);

    // Analyze document
    const analysis = await analyzeDocument(cleanedText);

    // Create document record
    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        title: title || file.name,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        status: "processing",
        word_count: extracted.wordCount,
        page_count: extracted.pageCount,
        topics: analysis.topics,
      })
      .select()
      .single();

    if (docError || !document) {
      console.error("Document creation error:", docError);
      return NextResponse.json({ error: "Failed to create document record" }, { status: 500 });
    }

    // Process document in background (chunking and embedding)
    processDocumentBackground(document.id, cleanedText, userId);

    // Deduct credits
    await deductCredits(
      userId,
      CREDIT_COSTS.DOCUMENT_UPLOAD,
      "document_upload",
      `Uploaded document: ${file.name}`,
      { documentId: document.id, fileName: file.name }
    );

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        status: document.status,
        wordCount: document.word_count,
        topics: document.topics,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Background processing for document chunking and embedding
 */
async function processDocumentBackground(
  documentId: string,
  text: string,
  userId: string
) {
  try {
    const supabase = await createClient();

    // Chunk the text
    const chunks = chunkText(text, {
      maxChunkSize: 1000,
      overlap: 100,
      splitOn: "paragraph",
    });

    // Generate embeddings for chunks
    const embeddings = await generateEmbeddings(chunks);

    // Insert chunks with embeddings
    const chunkRecords = chunks.map((content, index) => ({
      document_id: documentId,
      content,
      embedding: JSON.stringify(embeddings[index]),
      chunk_index: index,
      tokens: Math.ceil(content.split(" ").length * 1.3),
    }));

    const { error: chunkError } = await supabase
      .from("document_chunks")
      .insert(chunkRecords);

    if (chunkError) {
      console.error("Chunk insertion error:", chunkError);
      throw chunkError;
    }

    // Update document status
    await supabase
      .from("documents")
      .update({
        status: "completed",
        processed_at: new Date().toISOString(),
        chunk_count: chunks.length,
      })
      .eq("id", documentId);

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error("Background processing error:", error);

    // Update document status to failed
    const supabase = await createClient();
    await supabase
      .from("documents")
      .update({
        status: "failed",
        processing_error: error instanceof Error ? error.message : "Unknown error",
      })
      .eq("id", documentId);
  }
}

/**
 * GET endpoint to check document processing status
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: document, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
