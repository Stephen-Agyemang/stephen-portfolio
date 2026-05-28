import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import ProjectDiscovery from "./components/ProjectDiscovery.jsx";
import Skills from "./components/Skills.jsx";
import EmailDraftAssistant from "./components/EmailDraftAssistant.jsx";
import Footer from "./components/Footer.jsx";
import useIsMobile from "./hooks/useIsMobile";

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
}

function App() {
  const isMobile = useIsMobile(1200); // Only show circuit sidebar on screens wider than 1200px
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      const home = document.getElementById("home");
      const about = document.getElementById("about");
      const projects = document.getElementById("projects");
      const skills = document.getElementById("skills");
      const contact = document.getElementById("contact-assistant");

      const scrollPos = window.scrollY + 200; // Dynamic offset

      let current = "home";

      if (home && about && projects && skills) {
        if (contact && scrollPos >= contact.offsetTop) {
          current = "contact";
        } else if (scrollPos >= skills.offsetTop) {
          current = "skills";
        } else if (scrollPos >= projects.offsetTop) {
          current = "projects";
        } else if (scrollPos >= about.offsetTop) {
          current = "about";
        } else {
          current = "home";
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="app-container" style={{
      background: "var(--bg-color)",
      color: "var(--text-color)",
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.4s ease, color 0.4s ease"
    }}>
      {/* Dynamic Ambient Background Lights */}
      <div className="ambient-glow-wrapper">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="ambient-glow-3" />
      </div>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <ProjectDiscovery />
      <Projects />
      <Skills />
      <EmailDraftAssistant />
      <Footer />
    </div>
  );
}

export default App;
