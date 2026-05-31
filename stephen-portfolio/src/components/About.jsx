import React from "react";
import Stephen from "../assets/Stephen.jpg"
import useIsMobile from '../hooks/useIsMobile';

const About = () => {
  const isMobile = useIsMobile();

  return (
    <section
      id="about"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "24px" : "50px",
        padding: isMobile ? "60px 16px" : "100px 20px",
        flexWrap: "wrap",
      }}
    >
      {/* Picture wrapped in a glowing cyber viewport frame */}
      <div style={{
        position: "relative",
        width: isMobile ? "280px" : "340px",
        height: isMobile ? "280px" : "340px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        margin: "10px 0"
      }}>
        {/* Reticle Brackets */}
        <div style={{
          position: "absolute",
          inset: "-8px",
          border: "1.5px solid var(--card-border)",
          borderRadius: "100%",
          pointerEvents: "none",
          animation: "spinSlow 45s linear infinite",
          borderDasharray: "20 40 10 20",
        }} />
        <div style={{
          position: "absolute",
          inset: "-16px",
          border: "1px dashed rgba(56, 189, 248, 0.2)",
          borderRadius: "100%",
          pointerEvents: "none",
          animation: "spinReverseSlow 60s linear infinite",
        }} />
        {/* Viewfinder Target corner ticks */}
        <div style={{
          position: "absolute",
          top: "-5px",
          left: "-5px",
          width: "15px",
          height: "15px",
          borderTop: "3px solid var(--email-label)",
          borderLeft: "3px solid var(--email-label)",
        }} />
        <div style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          width: "15px",
          height: "15px",
          borderTop: "3px solid var(--email-label)",
          borderRight: "3px solid var(--email-label)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-5px",
          left: "-5px",
          width: "15px",
          height: "15px",
          borderBottom: "3px solid var(--email-label)",
          borderLeft: "3px solid var(--email-label)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-5px",
          right: "-5px",
          width: "15px",
          height: "15px",
          borderBottom: "3px solid var(--email-label)",
          borderRight: "3px solid var(--email-label)",
        }} />
        {/* Telemetry coordinate label */}
        <div style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "0.6rem",
          background: "var(--chat-input-bg)",
          color: "var(--email-label)",
          padding: "2px 6px",
          borderRadius: "4px",
          border: "1px solid var(--card-border)",
          fontWeight: "bold",
          zIndex: 2,
          letterSpacing: "0.5px"
        }}>
          TRC_LOC // 41.52° N
        </div>
        <img
          src={Stephen}
          alt="Stephen Agyemang"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "100%",
            objectFit: "cover",
            border: "2px solid var(--card-border)",
            boxShadow: "0 0 25px var(--card-border)",
          }}
        />
      </div>

      {/* About Text */}
      <div style={{ maxWidth: isMobile ? "100%" : "600px", textAlign: "left", zIndex: 2 }}>
        <div className="section-telemetry">[ SEC_01 // USER_INFO ]</div>
        <h2 className="section-title-neon" style={{
          fontSize: isMobile ? "2rem" : "3rem",
          marginBottom: "20px",
          fontFamily: "'Courier New', Courier, monospace"
        }}>
          About Me
        </h2>
        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: "var(--text-color)",
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          I am a Ghanaian Honor Scholar at DePauw University studying Computer Science,
          with a strong interest in software engineering and AI/ML/DL research.
          I am an incoming DL/ML researcher and ITAP intern — drawn to building systems
          that are scalable, efficient, and built to last.
        </p>

        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: "var(--text-color)",
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          I build full-stack projects and I am comfortable across the stack, but I have a
          growing passion for how things work under the hood — system design, cloud infrastructure,
          and the engineering that powers great software at scale. Always learning, always building.
        </p>

        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: "var(--text-color)",
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          Beyond the terminal, I am a multi-disciplinary thinker — minoring in Mathematics and Theatre,
          picking up piano and guitar, shooting photography, and playing soccer. I thrive in
          fast-paced environments that demand both precision and creativity.
        </p>
      </div>
    </section>
  );
};

export default About;