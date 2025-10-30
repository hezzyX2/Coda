"use client";
import { useEffect, useState } from "react";
import { Task } from "@/lib/models";
import { ai } from "@/lib/ai";
import { loadPreferences } from "@/lib/storage";
import { isPremium } from "@/lib/auth";

export function TipsPanel({ tasks }: { tasks: Task[] }) {
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadTips = async () => {
      const prefs = loadPreferences();
      const premium = isPremium();
      const res = await ai().generateTaskTips(tasks, prefs?.tone, premium);
      if (isMounted) setTips(res);
    };
    loadTips();
    return () => { isMounted = false; };
  }, [tasks]);

  return (
    <ul className="list vertical">
      {tips.map((t, i) => (
        <li key={i} className="item">
          <div className="item-body">{t}</div>
        </li>
      ))}
      {tips.length === 0 && <li className="muted">No tips yet.</li>}
    </ul>
  );
}


