import React, { useRef } from "react";

import html2pdf from "html2pdf.js";


export default function QuizDisplay({ quiz }) {

  const quizRef = useRef();

  const handleDownloadPDF = () => {
    const element = quizRef.current;

    const options = {
      margin: 10,
      filename: `${quiz.title.replace(/ /g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <div style={styles.container}>
      <button onClick={handleDownloadPDF} className="button-primary" style={styles.downloadBtn}>
        Download as PDF
      </button>

      <div ref={quizRef} className="card">
        <h2 style={styles.title}><strong>Title: </strong>{quiz.title}</h2>
        <p style={styles.summary}><strong>Summary: </strong>{quiz.summary}</p>

        <strong>Questions</strong>
        {quiz.questions.map((q, i) => (
          <div style={styles.card} key={i}>
            <p><strong>Q{i + 1}:</strong> {q.question}</p>
            <ul>
              {q.options.map((opt, idx) => (
                <li key={idx}
                  style={{
                    fontWeight: opt === q.correct_answer ? "bold" : "normal",
                    color: opt === q.correct_answer ? "green" : "black"
                  }}
                >
                  {opt}
                </li>
              ))}
            </ul>
            <p style={{color: "green"}}><strong>Correct: </strong>{q.correct_answer}</p>
          </div>
        ))}

        <strong>Related Topics</strong>

        <div style={styles.card}>
          <ul>
            {quiz.related_topics.map((rt, idx) => (
              <li key={idx}>
                <p>{rt}</p>
              </li>
            ))}
          </ul>
        </div>


      </div>
    </div>
  );
}


const styles = {
  container: { padding: "10px" },
  downloadBtn: { marginBottom: "20px" },
  title: { fontSize: "24px", fontWeight: "bold" },
  summary: { marginBottom: "15px", fontStyle: "italic" },
  section: { marginTop: "20px", marginBottom: "10px", fontSize: "18px" },
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    background: "#f9f9f9"
  }
};
