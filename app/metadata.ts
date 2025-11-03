import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codak - Advanced AI-Powered Student Success Platform",
  description: "The ultimate AI-powered platform for students. Advanced task management, intelligent study planning, habit tracking, mood analysis, and personalized AI coaching. Transform your academic journey with cutting-edge AI technology.",
  keywords: ["Codak", "AI student platform", "AI productivity", "intelligent study planner", "AI habit tracker", "AI writing assistant", "student success", "AI coaching"],
  authors: [{ name: "Codak" }],
  creator: "Codak",
  publisher: "Codak",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: (() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) return new URL("https://coda.app");
    try {
      // Add https:// if not present
      const url = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
      return new URL(url);
    } catch {
      return new URL("https://coda.app");
    }
  })(),
  openGraph: {
    title: "Codak - Advanced AI-Powered Student Success Platform",
    description: "Transform your academic journey with cutting-edge AI. Intelligent study planning, habit tracking, mood analysis, and personalized coaching.",
    url: "/",
    siteName: "Codak",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codak - Advanced AI-Powered Student Success Platform",
    description: "Transform your academic journey with cutting-edge AI. Intelligent study planning, habit tracking, and personalized coaching.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
};

