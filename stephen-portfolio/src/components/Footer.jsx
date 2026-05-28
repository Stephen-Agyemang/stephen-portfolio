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
        borderTop: "1px solid var(--footer-border)",
        marginTop: isMobile ? "65px" : "75px",
        position: "relative",
        zIndex: 2,
        transition: "border-top 0.4s ease"
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
          className="footer-social-link"
        >
          <FaLinkedin className="footer-icon-linkedin" />
        </a>

        <a
          href="https://github.com/Stephen-Agyemang"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="footer-social-link"
        >
          <FaGithub className="footer-icon-github" />
        </a>

        <a
          href="mailto:agyemangstephen2580@gmail.com"
          aria-label="Email"
          className="footer-social-link"
        >
          <FaEnvelope className="footer-icon-envelope" />
        </a>
      </div>

      {/* Copyright Text */}
      <p
        style={{
          margin: "6px 0 0 0",
          fontSize: isMobile ? "0.8rem" : "0.9rem",
          color: "var(--footer-text)",
          transition: "color 0.4s ease"
        }}
      >
        © {currentYear} Stephen B. Agyemang. All rights reserved.
      </p>

      <p
        style={{
          margin: "3px 0 0 0",
          fontSize: isMobile ? "0.75rem" : "0.85rem",
          color: "var(--footer-text)",
          transition: "color 0.4s ease"
        }}
      >
        Built with React & Vite
      </p>

      <style>{`
        .footer-social-link {
          display: inline-block !important;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .footer-social-link:hover {
          transform: scale(1.25) translateY(-3px) !important;
        }
        .footer-icon-linkedin {
          font-size: 1.5rem;
          color: var(--color-monica);
          transition: color 0.3s ease !important;
        }
        .footer-social-link:hover .footer-icon-linkedin {
          color: #0077b5 !important;
        }
        .footer-icon-github {
          font-size: 1.5rem;
          color: var(--color-monica);
          transition: color 0.3s ease !important;
        }
        .footer-social-link:hover .footer-icon-github {
          color: var(--text-title) !important;
        }
        .footer-icon-envelope {
          font-size: 1.5rem;
          color: var(--color-monica);
          transition: color 0.3s ease !important;
        }
        .footer-social-link:hover .footer-icon-envelope {
          color: #ff5e5e !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
