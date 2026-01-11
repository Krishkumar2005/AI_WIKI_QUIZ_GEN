import React from "react";

export default function HistoryTable({ items, onView }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr style={{marginBottom: "20px"}}>
          <th>ID</th>
          <th>URL</th>
          <th>Title</th>
          <th>Date</th>
          <th>View</th>
        </tr>
      </thead>

      <tbody>
        {items.map((row) => (
          <tr key={row.quiz_id} style={styles.tableRow}>
            <td>{row.quiz_id.substr(1, 4)}</td>
            <td>{row.url}</td>
            <td>{row.title}</td>
            <td>{new Date(row.date_generated).toLocaleString()}</td>
            <td>
              <button style={styles.button} onClick={() => onView(row.quiz_id)}>
                Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    padding: "20px"
  },
  button: {
    padding: "5px 10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};
