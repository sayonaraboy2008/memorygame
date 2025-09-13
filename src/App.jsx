import React, { useState, useEffect } from "react";
import "./App.css";

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

export default function App() {
  const [cards, setCards] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const [matched, setMatched] = useState([]);
  const [showWin, setShowWin] = useState(false);

  // avtorizatsiya state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState(null);

  // bildirishnoma xabari
  const [message, setMessage] = useState("");

  useEffect(() => {
    resetGame();
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setShowWin(true);
    }
  }, [matched, cards]);

  const handleCardClick = (index) => {
    if (openCards.includes(index) || matched.includes(index)) return;

    if (openCards.length === 1) {
      const firstIndex = openCards[0];
      const secondIndex = index;

      if (cards[firstIndex] === cards[secondIndex]) {
        setMatched((prev) => [...prev, firstIndex, secondIndex]);
      }

      setOpenCards((prev) => [...prev, index]);
      setTimeout(() => setOpenCards([]), 500);
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

  // ro'yhatdan o'tish (avtomatik login bilan)
  const registerUser = async () => {
    try {
      const res = await fetch("https://bb14a0d127d18348.mokky.dev/datas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const newUser = await res.json();
      // Avtomatik login
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUsername("");
      setPassword("");
      showMessage(
        "🎉 Ro'yhatdan o'tish muvaffaqiyatli va avtomatik login qilindi!"
      );
    } catch (err) {
      showMessage("Xatolik: " + err.message, true);
    }
  };

  // login
  const loginUser = async () => {
    try {
      const res = await fetch("https://bb14a0d127d18348.mokky.dev/datas");
      const users = await res.json();
      const found = users.find(
        (u) => u.username === loginUsername && u.password === loginPassword
      );
      if (found) {
        setUser(found);
        localStorage.setItem("user", JSON.stringify(found));
        showMessage("Kirish muvaffaqiyatli!");
      } else {
        showMessage("Username yoki parol xato", true);
      }
    } catch (err) {
      showMessage("Xatolik: " + err.message, true);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    showMessage("Chiqdingiz");
  };

  // toast xabar funksiyasi
  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="container">
      {/* Toast bildirishi */}
      {message && (
        <div className={`custom-alert ${message.isError ? "error" : ""}`}>
          {message.text}
        </div>
      )}

      <h2>Memory Game</h2>

      {user && (
        <div style={{ color: "white", marginBottom: "10px" }}>
          Xush kelibsiz, {user.username}!{" "}
          <button onClick={logout}>Chiqish</button>
        </div>
      )}

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

      {/* Pastda ro'yhatdan o'tish / kirish qismi */}
      {!user && (
        <div className="auth-section">
          <div className="auth-box">
            <h3>Ro'yxatdan o'tish</h3>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={registerUser}>Yuborish</button>
          </div>

          <div className="auth-box">
            <h3>Kirish</h3>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Parol"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button onClick={loginUser}>Kirish</button>
          </div>
        </div>
      )}
    </div>
  );
}
