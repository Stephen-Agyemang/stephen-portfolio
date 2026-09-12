import React, { useEffect, useState } from "react";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import useIsMobile from "../hooks/useIsMobile";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "credentials", label: "Honors & Certs" },
];

const Navbar = ({ theme = "dark", toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > (window.innerWidth < 768 ? 50 : 100));

      const scrollPos = window.scrollY + 200;
      let newSection = "home";

      NAV_ITEMS.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element && scrollPos >= element.offsetTop) newSection = id;
      });

      setSection(newSection);
    };

    // A phone can fire several scroll events per frame, and each pass reads
    // six offsetTops, which forces layout. Once a frame is all the underline
    // needs. Passive, so the browser never waits on this before scrolling.
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const closeDesktopMenu = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", closeDesktopMenu);
    return () => window.removeEventListener("resize", closeDesktopMenu);
  }, []);

  const activeColor = theme === "dark" ? "#6c9a57" : "#50783d";
  const navSurface = theme === "dark"
    ? "rgba(6, 11, 24, 0.88)"
    : "rgba(255, 255, 255, 0.92)";

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: isMobile ? "10px" : "12px",
    padding: scrolled || isMobile ? "10px 16px" : "15px 30px",
    zIndex: 1000,
    backgroundColor: scrolled || mobileOpen ? navSurface : "transparent",
    backdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
    WebkitBackdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
    boxShadow: scrolled || mobileOpen ? "0 4px 30px rgba(0, 0, 0, 0.15)" : "none",
    borderBottom: scrolled || mobileOpen
      ? (theme === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(108, 154, 87, 0.15)")
      : "none",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const linkStyle = {
    color: theme === "dark" ? "#cbd5e1" : "#334155",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.94rem",
    fontFamily: "var(--font-mono)",
    padding: "6px 8px",
    borderRadius: "6px",
    transition: "color 160ms ease, background-color 160ms ease, border-bottom 160ms ease",
    borderBottom: "2px solid transparent",
  };

  const handleHover = (event, enter) => {
    event.currentTarget.style.color = enter
      ? (theme === "dark" ? "#c9ec9e" : "#50783d")
      : (theme === "dark" ? "#cbd5e1" : "#334155");
  };

  const handleNavClick = (event, id) => {
    event.preventDefault();
    setMobileOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const iconButtonStyle = {
    width: "42px",
    height: "36px",
    borderRadius: "10px",
    border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(108, 154, 87, 0.25)",
    background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(108, 154, 87, 0.08)",
    color: theme === "dark" ? "#c9ec9e" : "#50783d",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const links = NAV_ITEMS.map(({ id, label }) => (
    <a
      key={id}
      href={`#${id}`}
      className="interactive-scale-sm"
      style={{
        ...linkStyle,
        ...(isMobile ? { width: "100%", boxSizing: "border-box", padding: "11px 12px" } : {}),
        borderBottom: section === id ? `2px solid ${activeColor}` : "2px solid transparent",
      }}
      onClick={(event) => handleNavClick(event, id)}
      onMouseOver={(event) => handleHover(event, true)}
      onMouseOut={(event) => handleHover(event, false)}
    >
      {label}
    </a>
  ));

  return (
    <nav style={navStyle} aria-label="Primary navigation">
      {!isMobile && links}

      {toggleTheme && (
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="interactive-scale-sm"
          style={iconButtonStyle}
        >
          {theme === "dark" ? <FaMoon size={13} /> : <FaSun size={13} />}
        </button>
      )}

      {isMobile && (
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          style={iconButtonStyle}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {isMobile && mobileOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "12px",
            right: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            padding: "10px",
            borderRadius: "0 0 14px 14px",
            background: navSurface,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(108,154,87,0.16)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
          }}
        >
          {links}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
