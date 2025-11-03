import { NextRequest } from "next/server";

// Debug endpoint to check auth state (development only)
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not available in production" }, { status: 403 });
  }

  // This is just for debugging - in a real app, you'd check localStorage client-side
  return Response.json({
    message: "Use browser console to check localStorage",
    instructions: [
      "1. Open browser console (F12)",
      "2. Run: localStorage.getItem('codak.users.v1')",
      "3. Run: localStorage.getItem('codak.auth.v1')",
      "4. Run: Object.keys(localStorage).filter(k => k.includes('password'))",
    ]
  });
}

