import React, { useState } from "react";
import { generateQuiz } from "../services/api";
import QuizDisplay from "../components/QuizDisplay";

export default function GenerateQuizTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setQuiz(null);

    if (!url.startsWith("http")) {
      setError("Enter a valid URL");
      return;
    }

    setLoading(true);
    const res = await generateQuiz(url);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setQuiz(res.data.quiz);
  };

  return (
    <div className="page-container">
    <div className="card">
      <h2 style={{marginLeft: "80px"}}>Generate Quiz from Wikipedia URL</h2>

      <input
        type="text"
        placeholder="Enter Wikipedia URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleGenerate} style={styles.button}>
        Generate Quiz
      </button>

      {loading && <p style={styles.loading}>Generating quiz...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {quiz && <QuizDisplay quiz={quiz} />}
    </div>
  </div>
  );
}

const styles = {
  input: {
    width: "70%",
    padding: "10px",
    marginTop: "10px",
    marginRight: "30px",
    marginLeft: "80px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    padding: "10px 15px",
    background: "blue",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  loading: { color: "orange" },
  error: { color: "red" }
};
