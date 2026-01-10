import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = window.innerWidth < 768;

  return (
    <footer
      style={{
        padding: isMobile ? "6px 10px" : "8px 15px",
        textAlign: "center",
        borderTop: isMobile ? "1px solid rgba(74, 124, 89, 0.5)" : "1px solid rgba(108, 154, 87, 0.3)",
        marginTop: isMobile ? "65px" : "75px",
      }}
    >
      {/* Social Links */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="https://www.linkedin.com/in/stephen-agyemang/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          style={{ textDecoration: "none" }}
        >
          <FaLinkedin
            style={{
              fontSize: "1.5rem",
              color: "#6c9a57ff",
              transition: "transform 0.3s, color 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.2)";
              e.currentTarget.style.color = "rgb(8, 124, 186)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#6c9a57ff";
            }}
          />
        </a>

        <a
          href="https://github.com/Stephen-Agyemang"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          style={{ textDecoration: "none" }}
        >
          <FaGithub
            style={{
              fontSize: "1.5rem",
              color: "#6c9a57ff",
              transition: "transform 0.3s, color 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.2)";
              e.currentTarget.style.color = "rgb(0, 0, 0)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#6c9a57ff";
            }}
          />
        </a>

        <a
          href="mailto:agyemangstephen2580@gmail.com"
          aria-label="Email"
          style={{ textDecoration: "none" }}
        >
          <FaEnvelope
            style={{
              fontSize: "1.5rem",
              color: "#6c9a57ff",
              transition: "transform 0.3s, color 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.2)";
              e.currentTarget.style.color = "rgb(201, 201, 201)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#6c9a57ff";
            }}
          />
        </a>
      </div>

      {/* Copyright Text */}
      <p
        style={{
          margin: "6px 0 0 0",
          fontSize: isMobile ? "0.8rem" : "0.9rem",
          color: isMobile ? "#e5fff7" : "#444",
        }}
      >
        © {currentYear} Stephen B. Agyemang. All rights reserved.
      </p>

      <p
        style={{
          margin: "3px 0 0 0",
          fontSize: isMobile ? "0.75rem" : "0.85rem",
          color: isMobile ? "#e5fff7" : "#444",
        }}
      >
        Built with React & Vite
      </p>
    </footer>
  );
};

export default Footer;
