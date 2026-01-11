import React, { useEffect, useState } from "react";
import { getHistory, getQuizById } from "../services/api";
import HistoryTable from "../components/HistoryTable";
import Modal from "../components/Modal";
import QuizDisplay from "../components/QuizDisplay";

export default function HistoryTab() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const res = await getHistory();
    if (res.ok) setItems(res.data.items);
    else setError(res.error);
  };

  const handleView = async (id) => {
    const res = await getQuizById(id);
    if (res.ok) {
      setSelectedQuiz(res.data.quiz);
      setOpen(true);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="page-container">
    <div className="card">
      <h2>Quiz History</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <HistoryTable items={items} onView={handleView} />

      <Modal open={open} onClose={() => setOpen(false)}>
        <QuizDisplay quiz={selectedQuiz} />
      </Modal>
    </div>
  </div>
  );
}
