import { FaCertificate, FaTrophy, FaExternalLinkAlt } from "react-icons/fa";
import { credentials } from "../data/credentials";
import useIsMobile from "../hooks/useIsMobile";

// Certifications read as verified skill; honors read as recognition. Giving each
// its own accent lets the grid stay a single flow while still being scannable.
const TYPE_META = {
    cert: { label: "CERT", color: "var(--color-monica)", Icon: FaCertificate },
    honor: { label: "AWARD", color: "var(--color-zork)", Icon: FaTrophy },
};

const Credentials = () => {
    const isMobile = useIsMobile();

    return (
        <section
            id="credentials"
            style={{
                padding: isMobile ? "44px 16px" : "60px 20px",
                textAlign: "left",
                zIndex: 2,
                position: "relative",
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
                <div className="section-telemetry">[ SEC_05 // CREDENTIALS ]</div>
                <h2
                    className="section-title-neon"
                    style={{
                        fontSize: isMobile ? "2rem" : "3rem",
                        marginBottom: "10px",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    Honors &amp; Certifications
                </h2>
                <p
                    style={{
                        margin: "0 0 40px",
                        fontSize: isMobile ? "0.9rem" : "1.05rem",
                        color: "var(--text-color)",
                        maxWidth: "600px",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    Recognition earned and programs completed along the way — the training
                    behind the skill graph above.
                </p>

                <div
                    style={{
                        display: "grid",
                        // Columns follow the room available, not the 768px
                        // breakpoint — see the matching note in Projects.jsx.
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
                        gap: isMobile ? "20px" : "24px",
                        // Only one credential carries a description, so stretching
                        // would leave the rest of its row mostly empty.
                        alignItems: "start",
                    }}
                >
                    {credentials.map((item) => {
                        const meta = TYPE_META[item.type] || TYPE_META.cert;
                        const { Icon } = meta;

                        return (
                            <article
                                key={item.id}
                                className="credential-card"
                                style={{
                                    "--credential-theme": meta.color,
                                    padding: isMobile ? "22px" : "26px",
                                }}
                            >
                                {/* Type badge */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "7px",
                                        marginBottom: "14px",
                                    }}
                                >
                                    <Icon size={11} style={{ color: meta.color }} />
                                    <span
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.58rem",
                                            fontWeight: "700",
                                            letterSpacing: "1.5px",
                                            color: meta.color,
                                        }}
                                    >
                                        {meta.label}
                                    </span>
                                    <span
                                        style={{
                                            flex: 1,
                                            height: "1px",
                                            background: `linear-gradient(90deg, color-mix(in srgb, ${meta.color} 25%, transparent), transparent)`,
                                        }}
                                    />
                                </div>

                                <h3
                                    style={{
                                        fontSize: isMobile ? "1.05rem" : "1.15rem",
                                        margin: "0 0 8px",
                                        color: "var(--text-title)",
                                        fontWeight: "800",
                                        fontFamily: "var(--font-mono)",
                                        lineHeight: "1.35",
                                    }}
                                >
                                    {item.name}
                                </h3>

                                <p
                                    style={{
                                        fontSize: "0.8rem",
                                        color: meta.color,
                                        fontWeight: "600",
                                        margin: "0 0 4px",
                                        fontFamily: "var(--font-mono)",
                                    }}
                                >
                                    {item.issuer}
                                </p>

                                <p
                                    style={{
                                        fontSize: "0.72rem",
                                        color: "var(--telemetry-color)",
                                        margin: "0 0 14px",
                                        fontFamily: "var(--font-mono)",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    {item.date}
                                    {item.note && ` // ${item.note}`}
                                    {item.credentialId && ` // ID ${item.credentialId}`}
                                </p>

                                {item.description && (
                                    <p
                                        style={{
                                            fontSize: "0.84rem",
                                            color: "var(--text-color)",
                                            lineHeight: "1.55",
                                            margin: "0 0 14px",
                                            fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        {item.description}
                                    </p>
                                )}

                                {item.skills?.length > 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "6px",
                                            marginBottom: item.credentialUrl ? "16px" : 0,
                                        }}
                                    >
                                        {item.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                style={{
                                                    fontSize: "0.68rem",
                                                    padding: "3px 8px",
                                                    background: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
                                                    color: meta.color,
                                                    borderRadius: "12px",
                                                    fontWeight: "600",
                                                    border: `1px solid color-mix(in srgb, ${meta.color} 13%, transparent)`,
                                                    fontFamily: "var(--font-mono)",
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Rendered only when a real credential link exists, so
                                    there is never a button that leads nowhere. */}
                                {item.credentialUrl && (
                                    <a
                                        href={item.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="interactive-scale-md credential-verify"
                                        aria-label={`Show credential for ${item.name}`}
                                    >
                                        Show credential <FaExternalLinkAlt size={8} />
                                    </a>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .credential-card {
                    background: var(--card-bg-init);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--card-border);
                    border-left: 3px solid var(--credential-theme);
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
                                box-shadow 0.3s ease,
                                border-color 0.3s ease,
                                background 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    box-sizing: border-box;
                }

                .credential-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 34px 0 color-mix(in srgb, var(--credential-theme) 12%, transparent);
                    border-color: color-mix(in srgb, var(--credential-theme) 30%, transparent);
                    border-left-color: var(--credential-theme);
                    background: var(--card-bg-hover);
                }

                .credential-verify {
                    align-self: flex-start;
                    margin-top: auto;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 9px 14px;
                    min-height: 40px;
                    border-radius: 10px;
                    /* Tinted with the card's own accent rather than filled solid:
                       the accent flips between a light and a dark green across
                       themes, so a solid fill would need the label colour to
                       flip too. This stays legible in both. */
                    border: 1px solid color-mix(in srgb, var(--credential-theme) 40%, transparent);
                    background: color-mix(in srgb, var(--credential-theme) 12%, transparent);
                    color: var(--credential-theme);
                    font-family: var(--font-mono);
                    font-size: 0.74rem;
                    font-weight: 700;
                    text-decoration: none;
                    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .credential-verify:hover {
                    background: color-mix(in srgb, var(--credential-theme) 22%, transparent);
                    border-color: color-mix(in srgb, var(--credential-theme) 65%, transparent);
                    box-shadow: 0 4px 14px color-mix(in srgb, var(--credential-theme) 18%, transparent);
                }

                @media (prefers-reduced-motion: reduce) {
                    .credential-card,
                    .credential-card:hover {
                        transition: none;
                        transform: none;
                    }
                }
            `}</style>
        </section>
    );
};

export default Credentials;
