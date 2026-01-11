import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>X</button>
        <div style={{ marginTop: "10px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative"
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 8px",
    cursor: "pointer",
    borderRadius: "4px",
  }
};
