"use client";
import { useState, useEffect } from "react";
import { JournalEntry } from "@/lib/models";
import { loadPreferences } from "@/lib/storage";
import { PremiumGate } from "./PremiumGate";
import { isPremium } from "@/lib/auth";

export function JournalAdvice({ entries }: { entries: JournalEntry[] }) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const prefs = loadPreferences();
  const premium = isPremium();

  async function getAdvice() {
    if (!consent || entries.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/journal-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries,
          tone: prefs?.tone || "encouraging",
          premium: premium
        })
      });
      if (!res.ok) throw new Error("Failed");
      const data = (await res.json()) as { advice?: string };
      setAdvice(data.advice || "Thank you for sharing!");
    } catch {
      setAdvice("Sorry, couldn't generate advice right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (consent && entries.length > 0) {
      getAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, entries.length]);

  if (entries.length === 0) return null;

  return (
    <PremiumGate feature="AI Journal Analysis">
      <section className="card glass journal-advice">
        <div className="advice-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2>AI Journal Insights</h2>
            {premium && <span className="premium-badge">✨ Premium</span>}
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={!premium}
            />
            <span>Enable AI advice (I consent to sharing my entries)</span>
          </label>
        </div>
        {consent && premium && (
          <div className="advice-content">
            {loading ? (
              <div className="loading-spinner">Analyzing your reflections...</div>
            ) : advice ? (
              <div className="advice-text">{advice}</div>
            ) : null}
          </div>
        )}
      </section>
    </PremiumGate>
  );
}

