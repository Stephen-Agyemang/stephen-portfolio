import React, {useEffect, useState } from "react";
import "./Skills.css";


const skills = [
    { name: "Java", cls: "devicon-java-plain colored", url: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
    { name: "Python", cls: "devicon-python-plain colored", url: "https://www.youtube.com/watch?v=rfscVS0vtbw"},
    { name: "JavaScript", cls: "devicon-javascript-plain colored", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
    { name: "C++", cls: "devicon-cplusplus-plain colored", url: "https://www.youtube.com/@programmingwithmosh" },
    { name: "React", cls: "devicon-react-original colored", url: "https://www.youtube.com/watch?v=SqcY0GlETPk" },
    { name: "Node.js", cls: "devicon-nodejs-plain colored", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
    { name: "Git", cls: "devicon-git-plain colored", url: "https://www.youtube.com/watch?v=mJ-qvsxPHpY" },
    { name: "GitHub", cls: "devicon-github-original", url: "https://www.youtube.com/watch?v=r8jQ9hVA2qs&list=PL0lo9MOBetEFcp4SCWinBdpml9B2U25-f" },
    { name: "HTML", cls: "devicon-html5-plain colored", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
    { name: "CSS", cls: "devicon-css3-plain colored", url: "https://www.youtube.com/watch?v=ieTHC78giGQ" },
    { name: "VS Code", cls: "devicon-vscode-plain colored", url: "https://www.youtube.com/watch?v=B-s71n0dHUk" },
    { name: "PyCharm", cls: "devicon-pycharm-plain colored", url: "https://www.youtube.com/watch?v=HHcZbXsZtm0" },
    { name: "IntelliJ IDEA", cls: "devicon-intellij-plain colored", url: "https://www.youtube.com/watch?v=GSKERVTMWqs" },
    { name: "Spring Boot", cls: "devicon-spring-plain colored", url: "https://www.youtube.com/watch?v=gJrjgg1KVL4" }
];

const Skills = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section 
      id="skills" 
      className="skills"
      style={{ padding: isMobile ? "100px 16px" : "120px 20px", }}
    >
        <h2 
        className="skills-title" 
        style={{ fontSize: isMobile ? "2rem" : "3rem", marginBottom: isMobile ? "24px" : "40px"}}
        >
          Skills
        </h2>
        <ul className="skills-grid" role="list" style={{ gap: isMobile ? "8px" : "18px" }}>
           {skills.map(({ name, cls, url }) => (
            <li key={name} className="skill-card">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="skill-link"
            aria-label={`Learn more about ${name}`}
          >
            <i className={cls} style={{ fontSize: isMobile ? 28 : 44 }} aria-hidden="true"></i>
            <span className="skill-label" style={{ fontSize : isMobile ? "0.75rem" : "1rem" }}>
              {name}
            </span>
          </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;