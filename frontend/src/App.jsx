import React, { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/Home";
import GenerateQuizTab from "./tabs/GenerateQuizTab";
import HistoryTab from "./tabs/HistoryTab";

export default function App() {
  const [active, setActive] = useState("home");

  return (
    <div>
      <Navbar active={active} onNavigate={setActive} />

      {active === "home" && <HomePage onStart={() => setActive("generate")} />}
      {active === "generate" && <GenerateQuizTab />}
      {active === "history" && <HistoryTab />}
      {active === "service" && (
        <div className="page-container">
          <div className="card" style={{ textAlign: "center" }}>
            <h2>Our Service</h2>
            <p>
              We generate accurate, fast, and AI-powered quizzes from Wikipedia URLs.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
