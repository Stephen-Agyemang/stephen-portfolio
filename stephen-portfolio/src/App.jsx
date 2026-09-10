import { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import BackgroundField from "./components/BackgroundField.jsx";
import SketchDesk from "./components/SketchDesk.jsx";

const About = lazy(() => import("./components/About.jsx"));
const Projects = lazy(() => import("./components/Projects.jsx"));
const ProjectDiscovery = lazy(() => import("./components/ProjectDiscovery.jsx"));
const Skills = lazy(() => import("./components/Skills.jsx"));
const Experience = lazy(() => import("./components/Experience.jsx"));
const Credentials = lazy(() => import("./components/Credentials.jsx"));
const EmailDraftAssistant = lazy(() => import("./components/EmailDraftAssistant.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));

// Opt out of the browser restoring a previous scroll position on reload.
//
// 'manual' on its own is enough to land at the top. The explicit
// scrollTo(0, 0) that used to follow it ran at module-eval time — which is
// routinely *after* a visitor has already flicked the wheel — and yanked them
// back, so the first scroll on a fresh load appeared to do nothing. It also
// overrode #hash deep links, dropping /#projects at the top of the page.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/**
 * Placeholder that holds a lazy section's space until its chunk arrives.
 *
 * With `fallback={null}` the document stayed exactly one viewport tall for the
 * ~400ms it took the section chunks to land, so a wheel flick in that window
 * had nowhere to scroll — it looked like the first scroll was being swallowed.
 * Reserving height makes the page scrollable from the first frame.
 */
const SectionFallback = ({ minHeight = "70vh" }) => (
  <div aria-hidden="true" style={{ minHeight }} />
);

function App() {
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
        } else if (scrollPos >= projects.offsetTop) {
          current = "projects";
        } else if (scrollPos >= skills.offsetTop) {
          current = "skills";
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
      fontFamily: "var(--font-mono)",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.4s ease, color 0.4s ease"
    }}>
      <BackgroundField />
      <SketchDesk />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        {/* One boundary per section rather than one around all seven: a shared
            boundary makes every section wait for the slowest chunk, so nothing
            below the hero rendered until the last one resolved. */}
        <Suspense fallback={<SectionFallback />}><About /></Suspense>
        <Suspense fallback={<SectionFallback />}><Skills /></Suspense>
        <Suspense fallback={<SectionFallback />}><Projects /></Suspense>
        <Suspense fallback={<SectionFallback />}><Experience /></Suspense>
        <Suspense fallback={<SectionFallback />}><Credentials /></Suspense>
        <Suspense fallback={<SectionFallback />}><EmailDraftAssistant /></Suspense>
        <Suspense fallback={<SectionFallback minHeight="30vh" />}><Footer /></Suspense>
      </main>
      <Suspense fallback={null}>
        <ProjectDiscovery />
      </Suspense>
    </div>
  );
}

export default App;
