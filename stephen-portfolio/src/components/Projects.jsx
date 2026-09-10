import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { projects } from "../data/projects";
import useIsMobile from '../hooks/useIsMobile';
const ProjectDemoModal = lazy(() => import("./ProjectDemoModal.jsx"));

/**
 * Screenshot band across the top of a project card.
 *
 * Treated as an instrument feed rather than a photo: duotoned toward the
 * project's theme colour at rest, scanlined, and cornered with the same
 * viewfinder ticks the About frame uses, so a browser screenshot reads in the
 * site's HUD language instead of against it. Hovering the card clears the tint
 * and lets the real colours through.
 *
 * `project.image` is a URL into `public/`, not an import, so a screenshot that
 * hasn't been captured yet 404s and drops through to the offline placeholder
 * rather than breaking the build. The band is decorative — the card already
 * carries the name, tagline and description as text — hence `aria-hidden`.
 */
const ProjectFeed = ({ project, themeColor }) => {
    const [failed, setFailed] = useState(false);
    const showImage = Boolean(project.image) && !failed;

    return (
        <div className="project-feed" aria-hidden="true">
            {showImage ? (
                <img
                    src={project.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                />
            ) : (
                <div className="project-feed-empty">
                    <span style={{ color: themeColor }}>[ FEED_OFFLINE ]</span>
                    <span>{`// ${project.id.toUpperCase()}`}</span>
                </div>
            )}
            <div className="project-feed-tint" />
            <div className="project-feed-grain" />
            <span className="project-feed-tick tl" />
            <span className="project-feed-tick tr" />
            <span className="project-feed-tick bl" />
            <span className="project-feed-tick br" />
        </div>
    );
};

/**
 * Skill pills, capped so one heavily-tagged project can't set the height of
 * every card in its grid row. MoNiCa's 15 tags wrapped to five rows and
 * dragged Zork and FridgeJam up 90px with it. The overflow is a toggle
 * rather than a truncation, so nothing is actually hidden.
 */
const MAX_VISIBLE_SKILLS = 6;

const SkillTags = ({ skills, themeColor }) => {
    const [expanded, setExpanded] = useState(false);
    if (!skills || skills.length === 0) return null;

    const overflow = skills.length - MAX_VISIBLE_SKILLS;
    const visible = expanded || overflow <= 0 ? skills : skills.slice(0, MAX_VISIBLE_SKILLS);

    const chip = {
        fontSize: "0.7rem",
        padding: "3px 8px",
        borderRadius: "12px",
        fontWeight: "600",
        background: `color-mix(in srgb, ${themeColor} 10%, transparent)`,
        color: themeColor,
        border: `1px solid color-mix(in srgb, ${themeColor} 13%, transparent)`,
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
            {visible.map((skill, sIdx) => (
                <span key={sIdx} style={chip}>{skill}</span>
            ))}
            {overflow > 0 && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                    style={{
                        ...chip,
                        cursor: "pointer",
                        borderStyle: "dashed",
                        fontFamily: "var(--font-mono)",
                        outline: "none",
                    }}
                >
                    {expanded ? "− less" : `+${overflow}`}
                </button>
            )}
        </div>
    );
};

/**
 * Card description, clamped to three lines with a toggle to open it.
 *
 * The clamp is visual only, so the full paragraph is always in the DOM for
 * crawlers and screen readers whether or not it's expanded.
 *
 * The toggle renders only when the text is genuinely cut off — measured, not
 * guessed from character count, since wrapping depends on the card's width and
 * on when the self-hosted fonts finish loading. A ResizeObserver re-checks on
 * every box change, and skips measuring while the paragraph is open, where
 * scrollHeight and clientHeight agree by definition.
 */
const ProjectBlurb = ({ text, themeColor, isMobile }) => {
    const ref = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [overflows, setOverflows] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const check = () => {
            if (!el.classList.contains("clamped")) return;
            setOverflows(el.scrollHeight > el.clientHeight + 1);
        };

        check();
        const observer = new ResizeObserver(check);
        observer.observe(el);
        return () => observer.disconnect();
    }, [text]);

    return (
        <>
            <p
                ref={ref}
                className={expanded ? "project-blurb" : "project-blurb clamped"}
                style={{
                    fontSize: isMobile ? "0.9rem" : "0.92rem",
                    marginBottom: "10px",
                    color: "var(--text-color)",
                    lineHeight: "1.5",
                    fontFamily: "var(--font-mono)"
                }}
            >
                {text}
            </p>

            {(overflows || expanded) && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                    className="blurb-toggle"
                    style={{ color: themeColor }}
                >
                    {expanded ? "[ read less ]" : "[ read more ]"}
                </button>
            )}
        </>
    );
};

const Projects = () => {
    const isMobile = useIsMobile();
    const [selectedProject, setSelectedProject] = useState(null);

    // Color theme mapping matching the Skills Graph nodes
    const projectColors = {
        monica: "var(--color-monica)",
        zork: "var(--color-zork)",
        fridgejam: "var(--color-fridgejam)",
        fintracker: "var(--color-fintracker)",
        portfolio: "var(--color-portfolio)"
    };

    return (
        <section
            id="projects"
            style={{
                padding: isMobile ? "44px 16px" : "60px 20px",
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
                fontFamily: "var(--font-mono)"
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
                            style={{ '--project-theme': themeColor }}
                        >
                            <ProjectFeed project={project} themeColor={themeColor} />

                            <div
                                className="project-card-body"
                                style={{ padding: isMobile ? "20px" : "24px" }}
                            >
                            {/* Blinking process LED, now riding on top of the feed
                                band — it carries its own chip background so it stays
                                legible against whatever the screenshot puts behind it. */}
                            <div style={{
                                position: "absolute",
                                top: "14px",
                                right: "14px",
                                zIndex: 4,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                background: "var(--chat-input-bg)",
                                border: "1px solid var(--card-border)",
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)"
                            }}>
                                <span className="blink-led" style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: themeColor,
                                    boxShadow: `0 0 10px ${themeColor}, 0 0 4px ${themeColor}`,
                                }} />
                                <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.58rem",
                                    color: "var(--telemetry-color)",
                                    fontWeight: "bold",
                                    letterSpacing: "0.5px"
                                }}>
                                    SEC_SYS // ACT
                                </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                                <h3 style={{
                                    fontSize: isMobile ? "1.4rem" : "1.6rem",
                                    margin: 0,
                                    color: "var(--text-title)",
                                    fontWeight: "800",
                                    fontFamily: "var(--font-mono)"
                                }}>
                                    {project.name}
                                </h3>
                                {project.private && (
                                    <span style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.58rem",
                                        fontWeight: "700",
                                        letterSpacing: "1px",
                                        padding: "3px 8px",
                                        borderRadius: "4px",
                                        border: `1px solid color-mix(in srgb, ${themeColor} 40%, transparent)`,
                                        background: `color-mix(in srgb, ${themeColor} 10%, transparent)`,
                                        color: themeColor,
                                    }}>
                                        // PRIVATE
                                    </span>
                                )}
                            </div>
                            
                            <p style={{
                                fontSize: "0.85rem",
                                color: themeColor,
                                fontWeight: "600",
                                marginBottom: "12px",
                                fontFamily: "var(--font-mono)"
                            }}>
                                {project.tagline}
                            </p>
                            
                            <SkillTags skills={project.skills} themeColor={themeColor} />

                            <ProjectBlurb
                                text={project.description}
                                themeColor={themeColor}
                                isMobile={isMobile}
                            />
                            
                            {/* Action row. `margin-top: auto` inside the flex body
                                pins it to the card floor, which the old absolute
                                positioning faked with a 72px spacer on the paragraph. */}
                            <div style={{
                                marginTop: "auto",
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
                                            // Theme tokens, not hardcoded white — this button
                                            // was invisible against the light theme's background.
                                            background: "var(--btn-secondary-bg)",
                                            color: "var(--btn-secondary-text)",
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

                                {/* 3. View Source Code Link — rendered as a disabled
                                     control when `codeDisabled` is set in projects.js,
                                     so an unreachable repo never ships as a live link. */}
                                {project.codeDisabled ? (
                                    <button
                                        disabled
                                        title="Source code isn't publicly available right now"
                                        style={{
                                            flex: 1,
                                            padding: "10px 4px",
                                            minHeight: "48px",
                                            borderRadius: "12px",
                                            border: "1px dashed var(--btn-secondary-border)",
                                            background: "var(--btn-secondary-bg)",
                                            color: "var(--btn-secondary-text)",
                                            fontWeight: "600",
                                            cursor: "not-allowed",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "4px",
                                            fontSize: "0.78rem",
                                            opacity: 0.45,
                                            outline: 'none'
                                        }}
                                    >
                                        Private
                                    </button>
                                ) : (
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
                                )}
                            </div>
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

                /* Visual clamp only — the full paragraph stays in the DOM for
                   crawlers and screen readers, and the chat assistant is fed the
                   untruncated text either way. */
                .project-blurb.clamped {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    overflow: hidden;
                }

                .blurb-toggle {
                    align-self: flex-start;
                    margin-bottom: 16px;
                    padding: 0;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-family: var(--font-mono);
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    opacity: 0.75;
                    outline: none;
                    transition: opacity 0.2s ease;
                }

                .blurb-toggle:hover {
                    opacity: 1;
                }

                .project-card-body {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-height: 0;
                }

                .project-feed {
                    position: relative;
                    /* Contains the duotone blend so it can't reach the
                       background field showing through the card's glass. */
                    isolation: isolate;
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    flex-shrink: 0;
                    overflow: hidden;
                    background: var(--feed-backdrop);
                    border-bottom: 1px solid color-mix(in srgb, var(--project-theme) 26%, transparent);
                }

                .project-feed img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    /* Anchor to the top: the nav and hero are the recognisable
                       part of a site screenshot, the footer is not. */
                    object-position: top center;
                    filter: saturate(0.35) contrast(1.06) brightness(0.94);
                    transform: scale(1.02);
                    transition: filter 0.4s ease, transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
                }

                .project-card:hover .project-feed img {
                    filter: saturate(1) contrast(1) brightness(1);
                    transform: scale(1.06);
                }

                /* Duotone pass. A 'color' blend keeps the screenshot's luminance,
                   so its layout stays readable, while pulling every hue to the
                   project's theme. Hover releases it to near-true colour. */
                .project-feed-tint {
                    position: absolute;
                    inset: 0;
                    background: var(--project-theme);
                    mix-blend-mode: color;
                    opacity: 0.6;
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }

                .project-card:hover .project-feed-tint {
                    opacity: 0.12;
                }

                /* Scanlines, plus the veil that hands the band off to the card body. */
                .project-feed-grain {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background:
                        repeating-linear-gradient(to bottom, var(--feed-scan) 0 1px, transparent 1px 3px),
                        linear-gradient(to bottom, transparent 64%, var(--feed-veil) 100%);
                }

                /* Stands in until a screenshot exists for the project. */
                .project-feed-empty {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    font-family: var(--font-mono);
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: var(--telemetry-color);
                    background:
                        linear-gradient(color-mix(in srgb, var(--project-theme) 13%, transparent) 1px, transparent 1px) 0 0 / 100% 24px,
                        linear-gradient(90deg, color-mix(in srgb, var(--project-theme) 13%, transparent) 1px, transparent 1px) 0 0 / 24px 100%;
                }

                /* Viewfinder ticks — same vocabulary as the About photo frame. */
                .project-feed-tick {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    z-index: 2;
                    opacity: 0.75;
                    pointer-events: none;
                }
                .project-feed-tick.tl {
                    top: 8px; left: 8px;
                    border-top: 2px solid var(--project-theme);
                    border-left: 2px solid var(--project-theme);
                }
                .project-feed-tick.tr {
                    top: 8px; right: 8px;
                    border-top: 2px solid var(--project-theme);
                    border-right: 2px solid var(--project-theme);
                }
                .project-feed-tick.bl {
                    bottom: 8px; left: 8px;
                    border-bottom: 2px solid var(--project-theme);
                    border-left: 2px solid var(--project-theme);
                }
                .project-feed-tick.br {
                    bottom: 8px; right: 8px;
                    border-bottom: 2px solid var(--project-theme);
                    border-right: 2px solid var(--project-theme);
                }

                @media (prefers-reduced-motion: reduce) {
                    .project-feed img,
                    .project-feed-tint {
                        transition: none;
                    }
                    .project-card:hover .project-feed img {
                        transform: scale(1.02);
                    }
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
