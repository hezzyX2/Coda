"use client";
import { useState, useEffect } from "react";
import { quotes, Quote } from "@/data/quotes";

export default function WisdomPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = [
    { id: "all", name: "All", icon: "✨" },
    { id: "mindset", name: "Mindset", icon: "🧠" },
    { id: "productivity", name: "Productivity", icon: "⚡" },
    { id: "growth", name: "Growth", icon: "🌱" },
    { id: "wisdom", name: "Wisdom", icon: "🔮" },
    { id: "motivation", name: "Motivation", icon: "💪" }
  ];

  useEffect(() => {
    loadFavorites();
    showRandomQuote();
  }, [selectedCategory]);

  function loadFavorites() {
    const saved = localStorage.getItem("coda.favorites");
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }

  function saveFavorites() {
    localStorage.setItem("coda.favorites", JSON.stringify([...favorites]));
  }

  function toggleFavorite(id: string) {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem("coda.favorites", JSON.stringify([...newFavorites]));
  }

  function showRandomQuote() {
    const filtered = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);
    
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentQuote(random);
    }
  }

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  return (
    <div className="page fade-in">
      <div className="wisdom-header">
        <h1 className="page-title">Wisdom & Inspiration</h1>
        <p className="wisdom-subtitle">Fuel your mind with timeless wisdom and philosophical insights</p>
      </div>

      {/* Category Filter */}
      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Random Quote Display */}
      {currentQuote && (
        <section className="card glass quote-display">
          <div className="quote-icon">💫</div>
          <blockquote className="quote-text">"{currentQuote.text}"</blockquote>
          <cite className="quote-author">— {currentQuote.author}</cite>
          <div className="quote-actions">
            <button className="btn secondary" onClick={showRandomQuote}>
              🔄 New Quote
            </button>
            <button
              className={`btn ${favorites.has(currentQuote.id) ? "primary" : "secondary"}`}
              onClick={() => toggleFavorite(currentQuote.id)}
            >
              {favorites.has(currentQuote.id) ? "❤️ Favorited" : "🤍 Favorite"}
            </button>
          </div>
        </section>
      )}

      {/* Favorites Section */}
      {favorites.size > 0 && (
        <section className="card glass">
          <h2 className="section-title-small">⭐ Your Favorites</h2>
          <div className="quotes-grid">
            {quotes.filter(q => favorites.has(q.id)).map(quote => (
              <div key={quote.id} className="quote-card">
                <div className="quote-card-header">
                  <span className="quote-category-badge">{quote.category}</span>
                  <button
                    className="quote-card-favorite"
                    onClick={() => toggleFavorite(quote.id)}
                  >
                    ❤️
                  </button>
                </div>
                <p className="quote-card-text">"{quote.text}"</p>
                <p className="quote-card-author">— {quote.author}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Quotes Grid */}
      <section className="card glass">
        <h2 className="section-title-small">
          {selectedCategory === "all" ? "All Quotes" : categories.find(c => c.id === selectedCategory)?.name + " Quotes"}
        </h2>
        <div className="quotes-grid">
          {filteredQuotes.map(quote => (
            <div key={quote.id} className="quote-card">
              <div className="quote-card-header">
                <span className="quote-category-badge">{quote.category}</span>
                <button
                  className={`quote-card-favorite ${favorites.has(quote.id) ? "favorited" : ""}`}
                  onClick={() => toggleFavorite(quote.id)}
                >
                  {favorites.has(quote.id) ? "❤️" : "🤍"}
                </button>
              </div>
              <p className="quote-card-text">"{quote.text}"</p>
              <p className="quote-card-author">— {quote.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Reflection Section */}
      <section className="card glass reflection-section">
        <h2 className="section-title-small">📝 Daily Reflection</h2>
        <p className="reflection-prompt">
          Take a moment to reflect: Which quote resonates with you today? How can you apply its wisdom to your current challenges?
        </p>
        <textarea
          className="input textarea reflection-input"
          rows={4}
          placeholder="Write your reflection here..."
        />
      </section>
    </div>
  );
}

