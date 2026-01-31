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
        fetchPriority="high"
        style={{
          width: isMobile ? "300px" : "400px",
          height: isMobile ? "280px" : "350px",
          borderRadius: "100%",
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
          I am a Ghanaian Honor Scholar at DePauw University, pursuing a degree
          in Computer Science with a current GPA of 4.00. As an Honor Scholar, I focus on building
          scalable software and exploring the intersections of AI and Machine Learning.
        </p>

        <p style={{
          fontSize: isMobile ? "1rem" : "1.2rem",
          lineHeight: "1.6",
          color: isMobile ? "#e5fff7" : "#444",
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          My technical toolkit includes Java (Spring Boot), Python, and Git, with a deep
          interest in optimizing data structures and algorithms. Beyond the terminal,
          I am a multi-disciplinary enthusiast—blending the logic of Mathematics with
          the creative expression of Theatre and Acting. Whether I am collaborating on
          a soccer pitch or architecting a full-stack application like Zork v2, I thrive 
          in environments that challenge my problem-solving and teamwork skills.
        </p>
      </div>
    </section>
  );
};

export default About;