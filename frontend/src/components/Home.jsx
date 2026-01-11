import React from "react";

export default function HomePage({ onStart }) {
  return (
    <>
      <div style={styles.heroContainer}>
        <div style={styles.left}>
          <h1 style={styles.title}>
            Generate <span style={styles.highlight}>quizzes</span> instantly with AI
          </h1>

          <p style={styles.subtitle}>
            Create high-quality quizzes from Wikipedia URLs in one click.
          </p>

          <button style={styles.startBtn} onClick={onStart}>
            Start Generating →
          </button>
        </div>

        <div style={styles.right}>
          <img
            src="https://res.cloudinary.com/doauyp2eg/image/upload/v1768132440/1OAnDloge6OrPaAOd3fLE1AmUE_bsx98j.avif"
            alt="AI Quiz Illustration"
            style={styles.image}
          />
        </div>

      </div>
      <footer style={{textAlign: "center", fontSize: "14px" , marginBottom: "20px", color: "gray"}}>
        © {new Date().getFullYear()} AI Wiki Quiz Generator — Built with ❤️ by Krish Kumar
      </footer>
    </>
  );
}

const styles = {
  heroContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "80%",
    maxHeight: "100%",
    margin: "40px auto",
    padding: "20px",
    flexWrap: "wrap-reverse",     // <-- Fix mobile overflow
    gap: "30px",
    textAlign: "left",
  },


  left: { maxWidth: "50%" },
  title: {
    fontSize: "42px",
    fontWeight: "bold",
    lineHeight: "1.2",
  },
  highlight: {
    color: "#3b82f6",
  },
  subtitle: {
    marginTop: "10px",
    fontSize: "18px",
    opacity: 0.8,
  },
  startBtn: {
    marginTop: "20px",
    padding: "14px 24px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    cursor: "pointer",
  },
  right: { maxWidth: "45%" },
  image: { width: "75%", marginLeft: "100px" }
};
