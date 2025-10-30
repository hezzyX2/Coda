import { NextRequest } from "next/server";

const ADMIN_KEY = process.env.ADMIN_API_KEY || "";

export async function GET(req: NextRequest) {
  try {
    // Verify admin access (in production, use proper authentication)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_KEY}` && ADMIN_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get stats (in production, query from database)
    const stats = {
      totalUsers: 0,
      premiumUsers: 0,
      totalRevenue: 0,
      monthlyRecurringRevenue: 0,
      activeSubscriptions: 0,
      canceledSubscriptions: 0,
      totalTasks: 0,
      totalJournalEntries: 0,
      aiRequests: 0,
      timestamp: new Date().toISOString(),
    };

    // In a real app, query from database
    // For now, return structure that can be populated
    
    return Response.json({ stats });
  } catch (err: any) {
    console.error("[Admin Stats] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

