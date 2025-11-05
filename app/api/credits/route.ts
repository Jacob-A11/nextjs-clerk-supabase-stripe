// app/api/credits/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getCreditBalance,
  getCreditTransactions,
  getCreditUsageStats,
} from "@/lib/credits";

/**
 * GET endpoint to retrieve credit balance and transactions
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "balance") {
      const balance = await getCreditBalance(userId);
      return NextResponse.json({ balance });
    }

    if (action === "transactions") {
      const limit = parseInt(searchParams.get("limit") || "50");
      const transactions = await getCreditTransactions(userId, limit);
      return NextResponse.json({ transactions });
    }

    if (action === "stats") {
      const stats = await getCreditUsageStats(userId);
      return NextResponse.json({ stats });
    }

    // Default: return balance and recent transactions
    const balance = await getCreditBalance(userId);
    const transactions = await getCreditTransactions(userId, 10);

    return NextResponse.json({
      balance,
      recentTransactions: transactions,
    });
  } catch (error: any) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
