import React, { useState, useEffect } from "react";

const Navbar = () => {
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

      const scrollPos = window.scrollY + 150; // Offset for better detection

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
    gap: isMobile ? "12px" : "20px",
    padding: scrolled ? (isMobile ? "10px 16px" : "10px 30px") : (isMobile ? "12px 16px" : "15px 30px"),
    zIndex: 1000,
    backgroundColor: scrolled ? "rgba(240, 239, 236, 0.6)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
    boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.05)" : "none",
    borderBottom: "none",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const linkStyle = {
    color: "#c1c1c1ff",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: isMobile ? "0.9rem" : "1.05rem",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    padding: isMobile ? "4px 8px" : "6px 10px",
    borderRadius: "6px",
    transition: "color 160ms ease, background-color 160ms ease, border-bottom 160ms ease",
    borderBottom: "2px solid transparent",
  };

  const handleHover = (e, enter) => {
    const accent = "#6c9a57";
    e.target.style.color = enter ? accent : "#c1c1c1ff";
    e.target.style.color = enter ? accent : "#c1c1c1ff";
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

  return (
    <nav style={navStyle}>
      <a
        href="#home"
        style={{
          ...linkStyle,
          borderBottom: section === "home" ? "2px solid #6c9a57" : "2px solid transparent",
        }}
        onClick={handleHomeClick}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Home
      </a>
      <a
        href="#about"
        style={{
          ...linkStyle,
          borderBottom: section === "about" ? "2px solid #6c9a57" : "2px solid transparent",
        }}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        About
      </a>
      <a
        href="#projects"
        style={{
          ...linkStyle,
          borderBottom: section === "projects" ? "2px solid #6c9a57" : "2px solid transparent",
        }}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Projects
      </a>
      <a
        href="#skills"
        style={{
          ...linkStyle,
          borderBottom: section === "skills" ? "2px solid #6c9a57" : "2px solid transparent",
        }}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Skills
      </a>
    </nav>
  );
};

export default Navbar;