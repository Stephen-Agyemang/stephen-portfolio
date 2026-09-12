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

// How many consecutive frames the document height must hold steady before a
// deep link is considered to have landed.
const SETTLE_FRAMES = 8;
// Give up after this long rather than fighting a page that never stops growing.
const DEEP_LINK_TIMEOUT_MS = 8000;

/**
 * Scroll to the section named by the URL hash on a fresh load.
 *
 * The browser resolves #projects as soon as it finishes parsing the document,
 * but every section below the hero is React.lazy() — the element does not
 * exist yet, so the jump finds nothing and silently gives up, dropping the
 * visitor at the top. Only externally shared links hit this; the navbar
 * scrolls imperatively and never writes a hash.
 *
 * Two details matter beyond "wait for the element":
 *
 *  - It re-scrolls each frame instead of once. Sections *above* the target are
 *    still reserved-height placeholders when it first mounts, and each one that
 *    resolves grows to its real height and pushes the target down, so a single
 *    scroll would leave the visitor short of it.
 *  - Any real scroll input aborts it. Otherwise chasing a still-growing page
 *    would fight someone who has already started scrolling — the same way the
 *    old scrollTo(0, 0) used to swallow the first flick.
 */
function useHashDeepLink() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let frame = 0;
    let lastHeight = -1;
    let stable = 0;
    const deadline = Date.now() + DEEP_LINK_TIMEOUT_MS;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      for (const evt of ["wheel", "touchstart", "keydown"]) {
        window.removeEventListener(evt, stop);
      }
    };

    const settle = () => {
      const target = document.getElementById(id);
      const height = document.documentElement.scrollHeight;

      if (target) {
        // 'instant', not 'auto' — html carries scroll-behavior: smooth, and
        // 'auto' defers to it, which would animate the visitor down several
        // thousand pixels instead of putting them there.
        target.scrollIntoView({ behavior: "instant", block: "start" });
        stable = height === lastHeight ? stable + 1 : 0;
      }
      lastHeight = height;

      if (stable >= SETTLE_FRAMES || Date.now() > deadline) {
        stop();
        return;
      }
      frame = requestAnimationFrame(settle);
    };

    for (const evt of ["wheel", "touchstart", "keydown"]) {
      window.addEventListener(evt, stop, { passive: true, once: true });
    }
    frame = requestAnimationFrame(settle);
    return stop;
  }, []);
}

function App() {
  useHashDeepLink();

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
