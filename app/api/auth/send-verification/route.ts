import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: number; attempts: number }>();

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return Response.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const code = generateVerificationCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    verificationCodes.set(email.toLowerCase(), {
      code,
      expiresAt,
      attempts: 0
    });

    // Clean up expired codes
    for (const [key, value] of verificationCodes.entries()) {
      if (value.expiresAt < Date.now()) {
        verificationCodes.delete(key);
      }
    }

    // Send email via Resend (if configured)
    try {
      if (!resend) {
        // Development mode - return code in response
        console.log(`[DEV] Verification code for ${email}: ${code}`);
        return Response.json({ 
          success: true, 
          message: "Verification code sent (check console in dev mode)",
          devCode: code
        });
      }

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Codak <noreply@codak.app>",
        to: email,
        subject: "Your Codak Login Verification Code",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; 
                        background: linear-gradient(135deg, #9b87f5, #7aa2ff); color: white; 
                        padding: 20px; border-radius: 12px; margin: 30px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; 
                         font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🔐 Your Codak Verification Code</h1>
                <p>Hello!</p>
                <p>You requested to sign in to your Codak account. Use this verification code to complete your login:</p>
                <div class="code">${code}</div>
                <p><strong>This code will expire in 10 minutes.</strong></p>
                <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
                <div class="footer">
                  <p>© Codak - Student Productivity Platform</p>
                  <p>This is an automated email. Please do not reply.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      // Log verification sent
      logLoginEvent({
        email: email.toLowerCase(),
        type: "verification_sent",
        success: true,
      }, req);

      return Response.json({ success: true, message: "Verification code sent to email" });
    } catch (emailError: any) {
      console.error("[Email] Failed to send:", emailError);
      
      // If Resend is not configured, return code for development
      if (!process.env.RESEND_API_KEY) {
        console.log(`[DEV] Verification code for ${email}: ${code}`);
        return Response.json({ 
          success: true, 
          message: "Verification code sent (check console in dev mode)",
          devCode: code // Only in development
        });
      }

      return Response.json(
        { success: false, error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("[Verification] Error:", err);
    return Response.json(
      { success: false, error: err?.message || "Failed to send verification code" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Verify code endpoint
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  if (!email || !code) {
    return Response.json(
      { success: false, error: "Email and code are required" },
      { status: 400 }
    );
  }

  const stored = verificationCodes.get(email.toLowerCase());
  
  if (!stored) {
    logLoginEvent({
      email: email.toLowerCase(),
      type: "verification_failed",
      success: false,
      error: "Code not found or expired"
    }, req);
    return Response.json({ success: false, error: "Invalid or expired code" }, { status: 400 });
  }

  if (stored.expiresAt < Date.now()) {
    verificationCodes.delete(email.toLowerCase());
    logLoginEvent({
      email: email.toLowerCase(),
      type: "verification_failed",
      success: false,
      error: "Code expired"
    }, req);
    return Response.json({ success: false, error: "Code has expired" }, { status: 400 });
  }

  if (stored.attempts >= 5) {
    verificationCodes.delete(email.toLowerCase());
    logLoginEvent({
      email: email.toLowerCase(),
      type: "verification_failed",
      success: false,
      error: "Too many attempts"
    }, req);
    return Response.json({ success: false, error: "Too many failed attempts" }, { status: 400 });
  }

  stored.attempts++;

  if (stored.code !== code) {
    logLoginEvent({
      email: email.toLowerCase(),
      type: "verification_failed",
      success: false,
      error: "Invalid code"
    }, req);
    return Response.json({ success: false, error: "Invalid verification code" }, { status: 400 });
  }

  // Code is valid - delete it
  verificationCodes.delete(email.toLowerCase());
  
  logLoginEvent({
    email: email.toLowerCase(),
    type: "verification_success",
    success: true,
  }, req);

  return Response.json({ success: true, message: "Code verified successfully" });
}

function logLoginEvent(data: {
  email: string;
  type: "login_attempt" | "login_success" | "login_failed" | "verification_sent" | "verification_success" | "verification_failed";
  success: boolean;
  error?: string;
}, req: NextRequest) {
  // This will be stored client-side via the auth system
  // For now, just log server-side
  const log = {
    id: crypto.randomUUID(),
    email: data.email,
    timestamp: new Date().toISOString(),
    type: data.type,
    ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
    success: data.success,
    error: data.error,
  };

  console.log(`[Login Log] ${log.type} for ${log.email} at ${log.timestamp}`);
}

