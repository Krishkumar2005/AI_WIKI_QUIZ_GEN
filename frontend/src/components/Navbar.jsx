import React from "react";

export default function Navbar({ onNavigate, active }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>AI QuizGen</div>

      <div style={styles.links}>
        <button
          style={active === "home" ? styles.activeLink : styles.link}
          onClick={() => onNavigate("home")}
        >
          Home
        </button>

        <button
          style={active === "generate" ? styles.activeLink : styles.link}
          onClick={() => onNavigate("generate")}
        >
          Generate
        </button>

        <button
          style={active === "history" ? styles.activeLink : styles.link}
          onClick={() => onNavigate("history")}
        >
          History
        </button>

        <button
          style={active === "service" ? styles.activeLink : styles.link}
          onClick={() => onNavigate("service")}
        >
          Our Service
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    width: "95%",
    padding: "15px 40px",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#3b82f6",
    whiteSpace: "nowrap",
  },

  /** FIXED NAV LINKS LAYOUT */
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center",
    flex: 1, // spread links but do NOT push too far
    marginLeft: "40px", // control spacing from logo
  },

  /** NORMAL BUTTON */
  link: {
    background: "transparent",
    border: "none",
    padding: "8px 16px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "6px",
    whiteSpace: "nowrap",
  },

  /** ACTIVE BUTTON */
  activeLink: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "6px",
    whiteSpace: "nowrap",
  },
};
