import { FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";
import "./Hero.css";

const Hero = () => {
    const isMobile = window.innerWidth < 768;

    return (
        <section id="home" className="hero"
            style={{
                paddingTop: isMobile ? "140px" : "212.8px",
                paddingLeft: isMobile ? "16px" : "20px",
                paddingRight: isMobile ? "16px" : "20px",
                textAlign: "left",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1
                    className="hey-there"
                    style={{
                        fontSize: isMobile ? "1.2rem" : "2rem",
                        margin: 0,
                        lineHeight: 1.5,
                        fontFamily: "'Courier New', Courier, monospace",
                        color: "#8c8c8cff",
                        alignSelf: "flex-start",
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
                        color: "#ffffffff",
                        alignSelf: "flex-start",
                        marginLeft: isMobile ? "40px" : "100px",
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
                        color: "#6c9a57ff",
                        alignSelf: "center",
                        textAlign: "center",
                    }}
                >
                    Stephen Agyemang
                </h1>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: isMobile ? "24px" : "30px",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >

                {/* LinkedIn */}
                <a
                    href="https://www.linkedin.com/in/stephen-agyemang/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaLinkedin
                        style={{ fontSize: isMobile ? "2.5rem" : "4rem", color: "#0899e7ff", transition: "transform 0.3s, color 0.3s" }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                            e.currentTarget.style.color = "#0077b5";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.color = "#0899e7ff";
                        }}
                    />
                </a>

                {/* GitHub */}
                <a
                    href="https://github.com/Stephen-Agyemang"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaGithub
                        style={{ fontSize: isMobile ? "2.5rem" : "4rem", color: "#505050ff", transition: "transform 0.3s, color 0.3s" }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                            e.currentTarget.style.color = "#9da4a3";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.color = "#505050ff";
                        }}
                    />
                </a>

                {/* Resume */}
                <a
                    href="https://drive.google.com/file/d/1YT1g8U-sZy3RfXnT_NT-_BTgPjLKcax3/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FaFileAlt
                        style={{ fontSize: isMobile ? "2.5rem" : "4rem", color: "#505050ff", transition: "transform 0.3s, color 0.3s" }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                            e.currentTarget.style.color = "#9da4a3";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.color = "#505050ff";
                        }}
                    />
                </a>
            </div>
        </section>
    );
};

export default Hero;