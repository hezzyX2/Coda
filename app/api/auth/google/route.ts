import { NextRequest } from "next/server";

// This is a simplified server-side handler
// In production, verify Google tokens server-side before accepting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, googleId, profileImage } = body;

    if (!email || !name || !googleId) {
      return Response.json(
        { success: false, error: "Missing required Google account information" },
        { status: 400 }
      );
    }

    // In production, verify the Google ID token here using Google's API
    // For now, we return success and the client will handle the actual sign-in
    // The client-side auth.ts will handle storing the user
    
    return Response.json({ 
      success: true,
      message: "Google authentication successful. User will be signed in client-side."
    });
  } catch (err: any) {
    console.error("[Google Auth] Error:", err);
    return Response.json(
      { success: false, error: err?.message || "Failed to sign in with Google" },
      { status: 500 }
    );
  }
}

