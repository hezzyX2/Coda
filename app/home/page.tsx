"use client";
import Link from "next/link";
import { DiamondLogo } from "@/components/DiamondLogo";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-brand">
            <span className="brand-text">C</span>
            <DiamondLogo size={80} animated={true} />
            <span className="brand-text">da</span>
          </div>
          <h1 className="hero-title">Your AI-Powered Student Companion</h1>
          <p className="hero-subtitle">
            Organize your day, plan your tasks, reflect on your journey, and get personalized advice—all powered by AI.
          </p>
          <div className="hero-cta">
            <Link href="/" className="btn primary large">Get Started</Link>
            <Link href="/tasks" className="btn secondary large">View Features</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="float-card card-1">
              <div className="card-icon">📋</div>
              <div className="card-text">Tasks</div>
            </div>
            <div className="float-card card-2">
              <div className="card-icon">📅</div>
              <div className="card-text">Planning</div>
            </div>
            <div className="float-card card-3">
              <div className="card-icon">💬</div>
              <div className="card-text">Chat</div>
            </div>
            <div className="float-card card-4">
              <div className="card-icon">📖</div>
              <div className="card-text">Journal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">How Coda Works</h2>
        <div className="features-grid">
          <div className={`feature-card ${mounted ? "fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            <div className="feature-icon">🎯</div>
            <h3>Smart Task Management</h3>
            <p>
              Add your tasks with difficulty levels and time estimates. Coda's AI analyzes your workload and provides
              <strong> specific, step-by-step instructions</strong> on how to complete each task, including what materials
              you need and how to break it down.
            </p>
          </div>

          <div className={`feature-card ${mounted ? "fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
            <div className="feature-icon">📊</div>
            <h3>Intelligent Planning</h3>
            <p>
              Our planner automatically creates focus blocks and break sessions based on your preferences. Choose your work
              style—easy tasks first, hard tasks first, or balanced—and watch Coda build your perfect schedule.
            </p>
          </div>

          <div className={`feature-card ${mounted ? "fade-in-up" : ""}`} style={{ animationDelay: "0.3s" }}>
            <div className="feature-icon">🤖</div>
            <h3>AI Life Coach</h3>
            <p>
              Chat with Coda about anything—academics, relationships, personal growth, stress management. Get thoughtful,
              empathetic advice tailored to your chosen tone (encouraging, direct, or gentle).
            </p>
          </div>

          <div className={`feature-card ${mounted ? "fade-in-up" : ""}`} style={{ animationDelay: "0.4s" }}>
            <div className="feature-icon">📔</div>
            <h3>Guided Journaling</h3>
            <p>
              Answer rotating journal prompts designed to foster self-reflection. Optionally share your entries with AI
              to receive personalized insights and growth advice based on your patterns and reflections.
            </p>
          </div>

          <div className={`feature-card ${mounted ? "fade-in-up" : ""}`} style={{ animationDelay: "0.5s" }}>
            <div className="feature-icon">🎨</div>
            <h3>Beautiful Themes</h3>
            <p>
              Choose from multiple aesthetic themes—Lilac Mist, Midnight Neon, Sunset Glow, Ocean Breeze, or Forest Fog.
              Each theme adapts the entire app's appearance to match your mood and style.
            </p>
          </div>

          <div className={`feature-card ${mounted ? "fade-in-up" : ""}`} style={{ animationDelay: "0.6s" }}>
            <div className="feature-icon">⚙️</div>
            <h3>Adaptive Preferences</h3>
            <p>
              Customize focus block lengths, break durations, difficulty bias, notification settings, and AI tone. Coda
              learns your preferences and adapts to make your experience as enjoyable and productive as possible.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">Getting Started</h2>
        <div className="steps-container">
          <div className={`step-item ${mounted ? "slide-in-left" : ""}`} style={{ animationDelay: "0.1s" }}>
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Set Your Preferences</h3>
              <p>Configure your focus blocks, breaks, difficulty bias, and AI tone using the theme selector and app settings.</p>
            </div>
          </div>

          <div className={`step-item ${mounted ? "slide-in-right" : ""}`} style={{ animationDelay: "0.2s" }}>
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Add Your Tasks</h3>
              <p>Create tasks with titles, due dates, difficulty levels (1-5), and time estimates.</p>
            </div>
          </div>

          <div className={`step-item ${mounted ? "slide-in-left" : ""}`} style={{ animationDelay: "0.3s" }}>
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Review Your Plan</h3>
              <p>Check your Dashboard to see your scheduled day and get AI-powered task instructions.</p>
            </div>
          </div>

          <div className={`step-item ${mounted ? "slide-in-right" : ""}`} style={{ animationDelay: "0.4s" }}>
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Chat & Reflect</h3>
              <p>Use Chat for life advice and Journal to reflect on your day with guided prompts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <DiamondLogo size={100} animated={true} />
          <h2>Ready to Transform Your Student Life?</h2>
          <p>Join thousands of students using Coda to stay organized, productive, and mindful.</p>
          <Link href="/" className="btn primary large">Start Organizing</Link>
        </div>
      </section>
    </div>
  );
}

