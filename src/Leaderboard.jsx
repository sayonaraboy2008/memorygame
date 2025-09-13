import React, { useState, useEffect } from "react";

export default function Leaderboard({ apiUrl }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/scores`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.score - a.score);
        setScores(sorted);
      });
  }, [apiUrl]);

  return (
    <div className="auth-section">
      <h3>Top Reyting</h3>
      <ul>
        {scores.map((item) => (
          <li key={item.id}>
            User ID {item.userId}: {item.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}
