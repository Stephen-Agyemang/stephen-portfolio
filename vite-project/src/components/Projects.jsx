import React from "react";
import arrow from "../assets/arrow.jpg";

const Projects = () => {
    const isMobile = window.innerWidth < 768;
    const projects = [
        {
            name: "Emoji Chatbot", 
            description: "Interactive Python chatbot with guessing game and terminal effects.",
            link: "https://github.com/Stephen-Agyemang/emoji_chatbot",
        
        }, 

        {
            name: "Python Fun Scripts",
            description: "Collection of small Python programs for practice.",
            link: "https://github.com/Stephen-Agyemang/python-fun-scripts",
        },

        {
            name: "Zork v2 game",
            description: "Classic text-based adventure game with new challenges and features.", 
            link: "https://github.com/Stephen-Agyemang/Zork-v2",
        },
    ];

    return ( 
        <section 
        id="projects" 
        style={{ 
            padding: isMobile ? "100px 16px" : "120px 20px", 
            textAlign: "left"
            }}
        >
            <h2 style={{ 
                fontSize: isMobile ? "2rem" : "3rem", 
                marginBottom: isMobile ? "24px" : "40px", 
                color:"#7A9E8E"
                }} 
            >
                Projects
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: isMobile ? "24px" : "40px",
                }}
            >
                {projects.map((project, index) => (
                    <div 
                    key={index} 
                    style={{ 
                        border: isMobile ? "1px solid #4a7c59" : "1px solid #444",
                        borderRadius: "10px",
                        padding: isMobile ? "16px" : "20px",
                        }}
                    >
                        <h3 style={{ 
                            fontSize: isMobile ? "1.5rem" : "2rem", 
                            marginBottom: "10px", 
                            color: isMobile ? "#e5fff7" : "#444" 
                            }}
                        > 
                            {project.name}
                        </h3>
                        <p style={{ 
                            fontSize: isMobile ? "0.95rem" : "1rem", 
                            marginBottom: "10px", 
                            color: isMobile ? "#e5fff7" : "#444", 
                            lineHeight: "1.5",
                            }}
                        >
                            {project.description}
                        </p>
                        <div style={{ display: "flex", gap: "15px", marginTop: "10px"}}>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <button
                                    style={{
                                        position: "relative",
                                        padding: isMobile ? "8px 36px 8px 16px" : "10px 40px 10px 20px",
                                        borderRadius: "5px",
                                        border: "none",
                                        backgroundColor: "#ffffffff",
                                        color: "#1a1a1a",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        fontSize: isMobile ? "0.9rem" : "1rem",
                                        transition: "background-color 0.3s, transform 0.2s",
                                        }}
                                        onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = "#ffffffff";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        }}
                                        onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = "#ffffffff";
                                        e.currentTarget.style.transform = "scale(1)";
                                        }}
                                >
                                        Source code 
                                        <img
                                            src={arrow}
                                            alt="arrow"
                                            style={{
                                                position: "absolute",
                                                right: isMobile ? "8px" : "12px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                height: isMobile ? "16px" : "20px",
                                                pointerEvents: "none",
                                            }}
                                        />                
                                </button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;