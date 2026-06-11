import React, { useState, lazy, Suspense } from "react";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { projects } from "../data/projects";
import useIsMobile from '../hooks/useIsMobile';
const ProjectDemoModal = lazy(() => import("./ProjectDemoModal.jsx"));

const Projects = () => {
    const isMobile = useIsMobile();
    const [selectedProject, setSelectedProject] = useState(null);

    // Color theme mapping matching the Skills Graph nodes
    const projectColors = {
        monica: "var(--color-monica)",
        zork: "var(--color-zork)",
        fridgejam: "var(--color-fridgejam)",
        // fintracker: "var(--color-fintracker)",
        portfolio: "var(--color-portfolio)"
    };

    return (
        <section
            id="projects"
            style={{
                padding: isMobile ? "80px 16px" : "100px 20px",
                textAlign: "left",
                zIndex: 2,
                position: "relative"
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <div className="section-telemetry">[ SEC_02 // DEPLOY_DB ]</div>
            <h2 className="section-title-neon" style={{
                fontSize: isMobile ? "2rem" : "3rem",
                marginBottom: isMobile ? "24px" : "40px",
                fontFamily: "'Courier New', Courier, monospace"
            }}
            >
                Projects
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(310px, 1fr))",
                    gap: isMobile ? "30px" : "40px",
                    justifyContent: "center"
                }}
            >
                {projects.map((project, index) => {
                    const themeColor = projectColors[project.id] || "#6c9a57";
                    
                    return (
                        <div
                            key={index}
                            className="project-card"
                            style={{
                                '--project-theme': themeColor,
                                padding: isMobile ? "24px" : "28px"
                            }}
                        >
                            {/* Blinking process LED in top-right corner */}
                            <div style={{
                                position: "absolute",
                                top: "18px",
                                right: "18px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }}>
                                <span className="blink-led" style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: themeColor,
                                    boxShadow: `0 0 10px ${themeColor}, 0 0 4px ${themeColor}`,
                                }} />
                                <span style={{
                                    fontFamily: "'Courier New', Courier, monospace",
                                    fontSize: "0.58rem",
                                    color: "var(--telemetry-color)",
                                    fontWeight: "bold",
                                    letterSpacing: "0.5px"
                                }}>
                                    SEC_SYS // ACT
                                </span>
                            </div>

                            <h3 style={{
                                fontSize: isMobile ? "1.4rem" : "1.6rem",
                                marginBottom: "4px",
                                color: "var(--text-title)",
                                fontWeight: "800",
                                fontFamily: "'Inter', sans-serif"
                            }}>
                                {project.name}
                            </h3>
                            
                            <p style={{
                                fontSize: "0.85rem",
                                color: themeColor,
                                fontWeight: "600",
                                marginBottom: "12px",
                                fontFamily: "'Courier New', Courier, monospace"
                            }}>
                                {project.tagline}
                            </p>
                            
                            {/* Skill Tags */}
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px",
                                marginBottom: "16px"
                            }}>
                                {project.skills && project.skills.map((skill, sIdx) => (
                                    <span key={sIdx} style={{
                                        fontSize: "0.7rem",
                                        padding: "3px 8px",
                                        background: `color-mix(in srgb, ${themeColor} 10%, transparent)`, // 10% opacity
                                        color: themeColor,
                                        borderRadius: "12px",
                                        fontWeight: "600",
                                        border: `1px solid color-mix(in srgb, ${themeColor} 13%, transparent)`
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            
                            <p style={{
                                fontSize: isMobile ? "0.9rem" : "0.92rem",
                                marginBottom: "72px", // Space for action buttons
                                color: "var(--text-color)",
                                lineHeight: "1.5",
                                fontFamily: "'Inter', sans-serif"
                            }}>
                                {project.description}
                            </p>
                            
                            {/* Action overlays at card footer */}
                            <div style={{
                                position: "absolute",
                                bottom: "18px",
                                left: "18px",
                                right: "18px",
                                display: "flex",
                                gap: "8px"
                            }}>
                                {/* 1. Simulated Demo Trigger */}
                                <button
                                    onClick={() => setSelectedProject(project)}
                                    className="interactive-scale-md"
                                    style={{
                                        flex: 1,
                                        padding: "10px 4px",
                                        minHeight: "48px",
                                        borderRadius: "12px",
                                        border: project.liveUrl ? "1px solid var(--btn-secondary-border)" : "none",
                                        background: project.liveUrl ? "var(--btn-secondary-bg)" : `linear-gradient(135deg, ${themeColor}, color-mix(in srgb, ${themeColor} 86%, transparent))`,
                                        color: project.liveUrl ? "var(--btn-secondary-text)" : "#fff",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "4px",
                                        fontSize: "0.78rem",
                                        boxShadow: project.liveUrl ? "none" : `0 4px 12px color-mix(in srgb, ${themeColor} 13%, transparent)`,
                                        outline: 'none'
                                    }}
                                >
                                    <FaPlay size={8} /> Demo
                                </button>

                                {/* 2. Deployed Live Site link (or placeholder) */}
                                {project.liveUrl ? (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ flex: 1, textDecoration: "none" }}
                                        aria-label={`Visit live site for ${project.name}`}
                                    >
                                        <button
                                            className="interactive-scale-md"
                                            style={{
                                                width: "100%",
                                                padding: "10px 4px",
                                                minHeight: "48px",
                                                borderRadius: "12px",
                                                border: "none",
                                                background: `linear-gradient(135deg, ${themeColor}, color-mix(in srgb, ${themeColor} 86%, transparent))`,
                                                color: "#fff",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "4px",
                                                fontSize: "0.78rem",
                                                boxShadow: `0 4px 12px color-mix(in srgb, ${themeColor} 13%, transparent)`,
                                                outline: 'none'
                                            }}
                                        >
                                            Live Site
                                        </button>
                                    </a>
                                ) : (
                                    <button
                                        disabled
                                        style={{
                                            flex: 1,
                                            padding: "10px 4px",
                                            minHeight: "48px",
                                            borderRadius: "12px",
                                            border: "1px dashed var(--btn-secondary-border)",
                                            background: "rgba(255, 255, 255, 0.01)",
                                            color: "rgba(255, 255, 255, 0.25)",
                                            fontWeight: "600",
                                            cursor: "not-allowed",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "4px",
                                            fontSize: "0.75rem",
                                            opacity: 0.5,
                                            outline: 'none'
                                        }}
                                    >
                                        In Works
                                    </button>
                                )}

                                {/* 3. View Source Code Link */}
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1,
                                        textDecoration: "none"
                                    }}
                                    aria-label={`View source code for ${project.name}`}
                                >
                                    <button
                                        className="interactive-scale-md"
                                        style={{
                                            width: "100%",
                                            padding: "10px 4px",
                                            minHeight: "48px",
                                            borderRadius: "12px",
                                            border: "1px solid var(--btn-secondary-border)",
                                            background: "var(--btn-secondary-bg)",
                                            color: "var(--btn-secondary-text)",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "4px",
                                            fontSize: "0.78rem",
                                            outline: 'none'
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.background = "var(--btn-secondary-hover-bg)";
                                            e.currentTarget.style.color = "var(--btn-secondary-hover-text)";
                                            e.currentTarget.style.border = "1px solid var(--btn-secondary-hover-border)";
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.background = "var(--btn-secondary-bg)";
                                            e.currentTarget.style.color = "var(--btn-secondary-text)";
                                            e.currentTarget.style.border = "1px solid var(--btn-secondary-border)";
                                        }}
                                    >
                                        Code
                                    </button>
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Simulated Live Playground Dialog */}
            <Suspense fallback={null}>
                <ProjectDemoModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            </Suspense>
            </div>

            <style>{`
                .project-card {
                    background: var(--card-bg-init);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--card-border);
                    border-top: 3px solid var(--project-theme) !important;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    overflow: hidden;
                    max-width: 380px;
                    width: 100%;
                    margin: 0 auto;
                    box-sizing: border-box;
                }

                .project-card:hover {
                    transform: translateY(-6px) !important;
                    box-shadow: 0 16px 40px 0 color-mix(in srgb, var(--project-theme) 13%, transparent) !important;
                    border: 1px solid color-mix(in srgb, var(--project-theme) 33%, transparent) !important;
                    border-top: 3px solid var(--project-theme) !important;
                    background: var(--card-bg-hover) !important;
                }
            `}</style>
        </section>
    );
};

export default Projects;