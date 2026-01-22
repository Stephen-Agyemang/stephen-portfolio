import React from "react";
import Stephen from "../assets/Stephen.jpg"

const About = () => {
  const isMobile = window.innerWidth < 768;

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
      {/* Picture */}
      <img
        src={Stephen}
        alt="Stephen Agyemang"
        style={{
          width: isMobile ? "280px" : "400px",
          height: isMobile ? "280px" : "350px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      {/* About Text */}
      <div style={{ maxWidth: isMobile ? "100%" : "600px", textAlign: "left" }}>
        <h2 style={{
          fontSize: isMobile ? "2rem" : "3rem",
          marginBottom: "20px",
          color: "#6c9a57ff",
          fontFamily: "'Courier New', Courier, monospace"
        }}>
          About Me
        </h2>
        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: isMobile ? "#e5fff7" : "#444",
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          I am a Ghanaian international Computer Science student at DePauw University with a strong passion
          for software engineering and a keen interest in AI and machine learning.
          I am skilled in Python, Java, Git, GitHub, and core data structures and algorithms.
          Building meaningful projects is my purpose as an aspiring software engineer now.
        </p>

        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: isMobile ? "#e5fff7" : "#444",
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          Outside of coding, I am also a Mathematics and Theatre/Acting enthusiast at DePauw.
          I enjoy learning new things, including playing the guitar and piano,
          and I am studying Spanish. To stay active, I play soccer, which helps
          enhance my teamwork skills. I am eager to grow through internships and
          projects that will help me sharpen my software engineering abilities.
        </p>
      </div>
    </section>
  );
};

export default About;