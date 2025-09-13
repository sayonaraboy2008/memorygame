// MemoryGame.jsx
import React, { useState, useEffect } from "react";

const emojis = [
  "😍",
  "😍",
  "❤",
  "❤",
  "😵",
  "😵",
  "😥",
  "😥",
  "😎",
  "😎",
  "🤩",
  "🤩",
  "🤬",
  "🤬",
  "👍",
  "👍",
];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    // shuffle
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMatched([]);
    setOpenCards([]);
    setShowWin(false);
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setShowWin(true);
    }
  }, [matched]);

  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      const firstIndex = openCards[0];
      const secondIndex = index;

      if (cards[firstIndex] === cards[secondIndex]) {
        setMatched([...matched, firstIndex, secondIndex]);
      }

      setTimeout(() => setOpenCards([]), 600);
      setOpenCards([...openCards, index]);
    } else {
      setOpenCards([index]);
    }
  };

  const resetGame = () => {
    const shuffled = [...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMatched([]);
    setOpenCards([]);
    setShowWin(false);
  };

  return (
    <div className="game-wrapper">
      {showWin && (
        <div className="win-modal">
          <div className="win-content">
            <h2>🎉 Tabriklaymiz! Siz yutdingiz! 🎉</h2>
            <button onClick={resetGame}>Qayta boshlash</button>
          </div>
        </div>
      )}
      <div className="game">
        {cards.map((emoji, index) => {
          const isFlipped =
            openCards.includes(index) || matched.includes(index);
          return (
            <div
              key={index}
              className={`item ${isFlipped ? "boxOpen" : ""}`}
              onClick={() => handleCardClick(index)}>
              {emoji}
            </div>
          );
        })}
      </div>
      <button className="reset" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}
