import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coda - AI-Powered Student Organizer",
  description: "Organize your day, plan your tasks, reflect on your journey, and get personalized AI advice. The complete student productivity companion.",
  keywords: ["student organizer", "AI assistant", "productivity", "task management", "journaling", "study planner", "student app"],
  authors: [{ name: "Coda" }],
  creator: "Coda",
  publisher: "Coda",
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
    title: "Coda - AI-Powered Student Organizer",
    description: "Organize your day with AI. Plan tasks, journal your thoughts, and get personalized advice.",
    url: "/",
    siteName: "Coda",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coda - AI-Powered Student Organizer",
    description: "Organize your day with AI. Plan tasks, journal your thoughts, and get personalized advice.",
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

