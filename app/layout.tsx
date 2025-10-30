import "@/styles/globals.css";
import "@/styles/themes.css";
import "@/styles/home.css";
import "@/styles/wisdom.css";
import "@/styles/auth.css";
import "@/styles/premium.css";
import "@/styles/error.css";
import "@/styles/admin.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/Nav";
import { AuthGuard } from "@/components/AuthGuard";
import { metadata } from "./metadata";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export { metadata };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthGuard>
              <div className="app-shell">
                <Nav />
                <main className="main-content">{children}</main>
              </div>
            </AuthGuard>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
