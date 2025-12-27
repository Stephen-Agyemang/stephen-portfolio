import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [section, setSection] = useState("home");
    const isMobile = window.innerWidth < 768;
    
  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 50);

        const hero = document.getElementById("home");
        const projects = document.getElementById("projects");

        if (hero && projects) {
            const heroBottom = hero.offsetTop + hero.offsetHeight;
            const projectsTop = projects.offsetTop;

            if (window.scrollY < heroBottom) {
                setSection("home"); 
            } else if (window.scrollY < projectsTop + 200) {
                setSection("projects");
            } else {
                setSection("projects");
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
        backgroundColor: section === "home" 
          ? (scrolled ? "rgba(10, 14, 26, 0.75)" : "transparent")
          : (scrolled ? "rgba(250, 250, 250, 0.75)" : "transparent"),
        backdropFilter: scrolled ? "saturate(160%) blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(160%) blur(10px)" : "none",
        boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.25)" : "none",
        borderBottom: scrolled ? (section === "home" ? "1px solid rgba(0,255,180,0.12)" : "1px solid rgba(0,0,0,0.1)") : "none",
        transition: "background-color 220ms ease, box-shadow 220ms ease, padding 220ms ease, border-bottom 220ms ease",
    };

  const linkStyle = {
        color: section === "home" ? "#ffffffff" : "#444",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: isMobile ? "0.9rem" : "1.05rem",
        fontFamily: "'DM Mono', 'Courier New', monospace",
        padding: isMobile ? "4px 8px" : "6px 10px",
        borderRadius: "6px",
        transition: "color 160ms ease, background-color 160ms ease",    
  };

  const handleHover = (e, enter) => {
    if (section === "home") {
        e.target.style.color = enter ? "#a6a8aeff" : "#ffffffff";
        e.target.style.backgroundColor = enter ? "rgba(255,255,255,0.08)" : "transparent";
    }  else {
        e.target.style.color = enter ? "#333" : "#444";
        e.target.style.backgroundColor = enter ? "rgba(0,0,0,0.04)" : "transparent";
    }
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
        style={linkStyle}
        onClick={handleHomeClick}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Home
      </a>
      <a
        href="#about"
        style={linkStyle}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        About
      </a>
      <a
        href="#projects"
        style={linkStyle}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Projects
      </a>
      <a
        href="#skills"
        style={linkStyle}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
      >
        Skills
      </a>
    </nav>
  );
};

export default Navbar;