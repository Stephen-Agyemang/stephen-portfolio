import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = ({ theme = 'dark', toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState("home");
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth < 768 ? 50 : 100;
      setScrolled(window.scrollY > threshold);

      const home = document.getElementById("home");
      const about = document.getElementById("about");
      const projects = document.getElementById("projects");
      const skills = document.getElementById("skills");

      const scrollPos = window.scrollY + 200; // Offset for better detection

      let newSection = "home";

      if (home && about && projects && skills) {
        // Check from bottom to top
        if (scrollPos >= skills.offsetTop) {
          newSection = "skills";
        } else if (scrollPos >= projects.offsetTop) {
          newSection = "projects";
        } else if (scrollPos >= about.offsetTop) {
          newSection = "about";
        } else {
          newSection = "home";
        }
      }

      setSection(newSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: isMobile ? "10px" : "20px",
    padding: scrolled ? (isMobile ? "10px 16px" : "10px 30px") : (isMobile ? "12px 16px" : "15px 30px"),
    zIndex: 1000,
    backgroundColor: scrolled ? (theme === 'dark' ? "rgba(6, 11, 24, 0.75)" : "rgba(255, 255, 255, 0.85)") : "transparent",
    backdropFilter: scrolled ? "blur(16px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
    boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.15)" : "none",
    borderBottom: scrolled ? (theme === 'dark' ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(108, 154, 87, 0.15)") : "none",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const linkStyle = {
    color: theme === 'dark' ? "#cbd5e1" : "#334155",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: isMobile ? "0.85rem" : "1.02rem",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    padding: isMobile ? "4px 6px" : "6px 10px",
    borderRadius: "6px",
    transition: "color 160ms ease, background-color 160ms ease, border-bottom 160ms ease",
    borderBottom: "2px solid transparent",
  };

  const handleHover = (e, enter) => {
    const accent = "#c9ec9e";
    e.target.style.color = enter ? (theme === 'dark' ? accent : "#50783d") : (theme === 'dark' ? "#cbd5e1" : "#334155");
  };

  const handleHomeClick = (e) => {
    e.preventDefault();

    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const activeColor = theme === 'dark' ? "#6c9a57" : "#50783d";

  return (
    <nav style={navStyle}>
      <a
        href="#home"
        className="interactive-scale-sm"
        style={{
          ...linkStyle,
          borderBottom: section === "home" ? `2px solid ${activeColor}` : "2px solid transparent",
        }}
        onClick={handleHomeClick}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Home
      </a>
      <a
        href="#about"
        className="interactive-scale-sm"
        style={{
          ...linkStyle,
          borderBottom: section === "about" ? `2px solid ${activeColor}` : "2px solid transparent",
        }}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        About
      </a>
      <a
        href="#projects"
        className="interactive-scale-sm"
        style={{
          ...linkStyle,
          borderBottom: section === "projects" ? `2px solid ${activeColor}` : "2px solid transparent",
        }}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Projects
      </a>
      <a
        href="#skills"
        className="interactive-scale-sm"
        style={{
          ...linkStyle,
          borderBottom: section === "skills" ? `2px solid ${activeColor}` : "2px solid transparent",
        }}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Skills
      </a>

      {/* Futuristic sliding Day/Night Switch */}
      {toggleTheme && (
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="interactive-scale-sm"
          style={{
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(108, 154, 87, 0.08)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(108, 154, 87, 0.25)',
            borderRadius: '20px',
            width: '46px',
            height: '24px',
            padding: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none',
            boxSizing: 'border-box',
            marginLeft: '5px'
          }}
        >
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: theme === 'dark' ? '#c9ec9e' : '#50783d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: theme === 'dark' ? '24px' : '2px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: theme === 'dark' ? '0 0 8px #c9ec9e' : 'none'
          }}>
            {theme === 'dark' ? (
              <FaMoon size={9} style={{ color: '#030712' }} />
            ) : (
              <FaSun size={9} style={{ color: '#ffffff' }} />
            )}
          </div>
        </button>
      )}
    </nav>
  );
};

export default Navbar;