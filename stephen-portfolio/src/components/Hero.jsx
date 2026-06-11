import { FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";
import "./Hero.css";
import useIsMobile from '../hooks/useIsMobile';

const Hero = () => {
    const isMobile = useIsMobile();

    return (
        <section id="home" className="hero">
        <div style={{ maxWidth: "900px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1
                    className="hey-there"
                    style={{
                        fontSize: isMobile ? "1.2rem" : "2rem",
                        margin: 0,
                        lineHeight: 1.5,
                        fontFamily: "'Courier New', Courier, monospace",
                        color: "var(--hero-text-grey)",
                        alignSelf: "flex-start",
                        transition: "color 0.4s ease"
                    }}
                >
                    Hey there!
                </h1>
                <h1
                    style={{
                        fontSize: isMobile ? "2.5rem" : "5rem",
                        margin: 0,
                        lineHeight: 1.1,
                        fontFamily: "'Courier New', Courier, monospace",
                        color: "var(--hero-text-white)",
                        alignSelf: "flex-start",
                        marginLeft: isMobile ? "40px" : "100px",
                        transition: "color 0.4s ease"
                    }}
                >
                    I'm
                </h1>

                <h1
                    style={{
                        fontSize: isMobile ? "3rem" : "7rem",
                        margin: 0,
                        lineHeight: 1.1,
                        fontFamily: "'Courier New', Courier, monospace",
                        color: "var(--hero-text-green)",
                        alignSelf: "center",
                        textAlign: "center",
                        textShadow: "0 0 20px rgba(108, 154, 87, 0.4)",
                        transition: "all 0.4s ease"
                    }}
                >
                    Stephen Agyemang
                </h1>
            </div>

            {/* High-Tech Telemetry HUD Bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: isMobile ? "20px" : "28px",
                    position: "relative",
                    zIndex: 20,
                }}
            >
                <div
                    style={{
                        background: "var(--btn-secondary-bg)",
                        border: "1px solid var(--btn-secondary-border)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderRadius: "14px",
                        padding: isMobile ? "8px 16px" : "10px 24px",
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "center",
                        gap: isMobile ? "8px" : "24px",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.4s ease",
                    }}
                >
                    {/* Status item with active LED */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="blink-led" style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "var(--color-monica)",
                            boxShadow: "0 0 8px var(--color-monica)",
                        }} />
                        <span style={{
                            fontFamily: "'Courier New', Courier, monospace",
                            fontSize: "0.72rem",
                            fontWeight: "bold",
                            color: "var(--text-title)",
                            letterSpacing: "0.5px"
                        }}>
                            SYS_STATUS // ACTIVELY_BUILDING
                        </span>
                    </div>

                    {!isMobile && <span style={{ color: "var(--btn-secondary-border)", fontSize: "0.72rem" }}>|</span>}

                    {/* Location item */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                            fontFamily: "'Courier New', Courier, monospace",
                            fontSize: "0.72rem",
                            color: "var(--hero-text-grey)",
                            letterSpacing: "0.5px"
                        }}>
                            LOC // GREENCASTLE_IN
                        </span>
                    </div>

                    {!isMobile && <span style={{ color: "var(--btn-secondary-border)", fontSize: "0.72rem" }}>|</span>}

                    {/* Focus / Backend Aspirations item */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                            fontFamily: "'Courier New', Courier, monospace",
                            fontSize: "0.72rem",
                            color: "var(--hero-text-grey)",
                            letterSpacing: "0.5px"
                        }}>
                            CURRENT_FOCUS // AI_ML_DL / CLOUD
                        </span>
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: isMobile ? "24px" : "30px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    position: "relative",
                    zIndex: 20,
                }}
            >

                {/* LinkedIn */}
                <a
                    href="https://www.linkedin.com/in/stephen-agyemang/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-link"
                    aria-label="Stephen's LinkedIn Profile"
                >
                    <FaLinkedin
                        className="hero-icon-linkedin"
                        style={{ fontSize: isMobile ? "2.5rem" : "4rem" }}
                    />
                </a>

                {/* GitHub */}
                <a
                    href="https://github.com/Stephen-Agyemang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-link"
                    aria-label="Stephen's GitHub Profile"
                >
                    <FaGithub
                        className="hero-icon-github"
                        style={{ fontSize: isMobile ? "2.5rem" : "4rem" }}
                    />
                </a>

                {/* Resume */}
                <a
                    href="https://drive.google.com/file/d/1Web3VDvf_o3d8sOwb2aQrI43sIxOxeqb/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-social-link"
                    aria-label="Stephen's Professional Resume"
                >
                    <FaFileAlt
                        className="hero-icon-resume"
                        style={{ fontSize: isMobile ? "2.5rem" : "4rem" }}
                    />
                </a>
            </div>
        </div>
        </section>
    );
};

export default Hero;