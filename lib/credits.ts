// lib/credits.ts
// Credit system utilities for LetsReWise

import { createClient } from "@/utils/supabase/server";

/**
 * Credit costs for different actions
 */
export const CREDIT_COSTS = {
  DOCUMENT_UPLOAD: 30,
  QUIZ_GENERATION: 3,
  FLASHCARD_GENERATION: 2,
  AI_EXPLANATION: 1,
  DOCUMENT_REPROCESS: 15,
} as const;

/**
 * Plan configurations with monthly credits
 */
export const PLAN_CONFIGS = {
  free: {
    name: "Free",
    monthlyCredits: 0,
    price: 0,
    features: ["0 uploads", "Community support"],
  },
  starter: {
    name: "Starter",
    monthlyCredits: 108,
    price: 9,
    features: ["3 uploads", "6 quizzes", "Email support"],
  },
  pro: {
    name: "Pro",
    monthlyCredits: 348,
    price: 29,
    features: ["10 uploads", "16 quizzes", "Priority support", "Export"],
  },
  team: {
    name: "Team",
    monthlyCredits: 1200,
    price: 99,
    features: ["Unlimited uploads", "400 quizzes", "Team analytics", "Dedicated support"],
  },
  enterprise: {
    name: "Enterprise",
    monthlyCredits: 0,
    price: 0,
    features: ["Custom"],
  },
} as const;

/**
 * Check if user has enough credits for an action
 */
export async function hasEnoughCredits(
  userId: string,
  requiredCredits: number
): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (!profile) return false;

  return profile.credits >= requiredCredits;
}

/**
 * Deduct credits from user account
 */
export async function deductCredits(
  userId: string,
  amount: number,
  transactionType: string,
  description: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const supabase = await createClient();

  try {
    // Get current balance
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return { success: false, newBalance: 0, error: "User not found" };
    }

    const currentBalance = profile.credits;
    const newBalance = currentBalance - amount;

    if (newBalance < 0) {
      return {
        success: false,
        newBalance: currentBalance,
        error: "Insufficient credits",
      };
    }

    // Update user balance
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ credits: newBalance })
      .eq("user_id", userId);

    if (updateError) {
      return { success: false, newBalance: currentBalance, error: updateError.message };
    }

    // Record transaction
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -amount,
      balance_after: newBalance,
      transaction_type: transactionType,
      description,
      metadata: metadata || {},
    });

    return { success: true, newBalance };
  } catch (error: any) {
    return { success: false, newBalance: 0, error: error.message };
  }
}

/**
 * Add credits to user account
 */
export async function addCredits(
  userId: string,
  amount: number,
  transactionType: string,
  description: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const supabase = await createClient();

  try {
    // Get current balance
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return { success: false, newBalance: 0, error: "User not found" };
    }

    const currentBalance = profile.credits;
    const newBalance = currentBalance + amount;

    // Update user balance
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ credits: newBalance })
      .eq("user_id", userId);

    if (updateError) {
      return { success: false, newBalance: currentBalance, error: updateError.message };
    }

    // Record transaction
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: amount,
      balance_after: newBalance,
      transaction_type: transactionType,
      description,
      metadata: metadata || {},
    });

    return { success: true, newBalance };
  } catch (error: any) {
    return { success: false, newBalance: 0, error: error.message };
  }
}

/**
 * Get user's current credit balance
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("credits")
    .eq("user_id", userId)
    .single();

  return profile?.credits || 0;
}

/**
 * Get user's credit transaction history
 */
export async function getCreditTransactions(
  userId: string,
  limit: number = 50
): Promise<any[]> {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return transactions || [];
}

/**
 * Check if action is allowed based on credits
 */
export async function canPerformAction(
  userId: string,
  action: keyof typeof CREDIT_COSTS
): Promise<{ allowed: boolean; reason?: string }> {
  const cost = CREDIT_COSTS[action];
  const balance = await getCreditBalance(userId);

  if (balance >= cost) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Insufficient credits. Need ${cost}, have ${balance}`,
  };
}

/**
 * Perform action with automatic credit deduction
 */
export async function performActionWithCredits<T>(
  userId: string,
  action: keyof typeof CREDIT_COSTS,
  actionFn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<{ success: boolean; data?: T; error?: string }> {
  // Check if user has enough credits
  const { allowed, reason } = await canPerformAction(userId, action);

  if (!allowed) {
    return { success: false, error: reason };
  }

  try {
    // Perform the action
    const result = await actionFn();

    // Deduct credits
    const cost = CREDIT_COSTS[action];
    const { success, error } = await deductCredits(
      userId,
      cost,
      action.toLowerCase(),
      `Performed action: ${action}`,
      metadata
    );

    if (!success) {
      return { success: false, error: error || "Failed to deduct credits" };
    }

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Grant monthly credits based on subscription plan
 */
export async function grantMonthlyCredits(userId: string): Promise<void> {
  const supabase = await createClient();

  // Get user's plan
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("plan_type")
    .eq("user_id", userId)
    .single();

  if (!profile) return;

  const planType = profile.plan_type as keyof typeof PLAN_CONFIGS;
  const monthlyCredits = PLAN_CONFIGS[planType]?.monthlyCredits || 0;

  if (monthlyCredits > 0) {
    await addCredits(
      userId,
      monthlyCredits,
      "subscription",
      `Monthly credits for ${planType} plan`,
      { plan: planType }
    );
  }
}

/**
 * Get credit usage statistics for a user
 */
export async function getCreditUsageStats(userId: string): Promise<{
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  byCategory: Record<string, number>;
}> {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("amount, transaction_type")
    .eq("user_id", userId);

  if (!transactions) {
    return {
      totalEarned: 0,
      totalSpent: 0,
      currentBalance: 0,
      byCategory: {},
    };
  }

  const totalEarned = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = Math.abs(
    transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const byCategory: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.amount < 0) {
      byCategory[t.transaction_type] =
        (byCategory[t.transaction_type] || 0) + Math.abs(t.amount);
    }
  });

  const currentBalance = await getCreditBalance(userId);

  return {
    totalEarned,
    totalSpent,
    currentBalance,
    byCategory,
  };
}
