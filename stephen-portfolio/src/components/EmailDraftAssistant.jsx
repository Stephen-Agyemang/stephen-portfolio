import React, { useState } from 'react';
import { generateEmailDrafts } from '../services/aiService';
import { FaPaperPlane, FaMagic, FaSpinner } from 'react-icons/fa';
import useIsMobile from '../hooks/useIsMobile';

const EmailDraftAssistant = () => {
    const [intent, setIntent] = useState('');
    const [senderName, setSenderName] = useState('');
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [isBtnHovered, setIsBtnHovered] = useState(false);

    const handleGenerate = async () => {
        if (!intent.trim()) {
            setError('Please enter what you would like to say in the text box above first!');
            return;
        }

        setLoading(true);
        setError('');
        setDrafts([]);
        setSelectedDraft(null);

        try {
            const data = await generateEmailDrafts(intent);
            const results = data.options || [];
            // Replace placeholder with actual name if provided
            const finalResults = results.map(draft => ({
                ...draft,
                body: senderName ? draft.body.replace("[Your Name]", senderName) : draft.body
            }));
            setDrafts(finalResults);
        } catch {
            setError('Failed to generate drafts. Please check your API key or try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = (draft) => {
        const mailtoLink = `mailto:agyemangstephen2580@gmail.com?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        window.location.href = mailtoLink;
    };

    const isMobile = useIsMobile();

    return (
        <section id="contact-assistant" style={{
            padding: isMobile ? "80px 16px" : "100px 20px",
            background: "transparent",
            borderTop: "1px solid var(--footer-border)",
            textAlign: "center",
            zIndex: 2,
            position: "relative",
            transition: "border-top 0.4s ease"
        }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
            <div className="section-telemetry" style={{ justifyContent: "center" }}>[ SEC_04 // SYS_MAIL ]</div>
            <h2 className="section-title-neon" style={{
                fontSize: isMobile ? "1.8rem" : "2.5rem",
                marginBottom: "12px",
                fontFamily: "'Courier New', Courier, monospace"
            }}>
                Email Draft Assistant
            </h2>
            <p style={{
                marginBottom: "40px",
                color: "var(--text-color)",
                fontFamily: "'Inter', sans-serif",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: isMobile ? "0.9rem" : "1.05rem",
                transition: "color 0.4s ease"
            }}>
                Not sure what to say? Use my Intelligent Assistant here to help you draft a structured email.
            </p>

            <div className="email-assistant-container">
                <div style={{ marginBottom: "20px" }}>
                    <label className="email-assistant-label">What would you like to say?</label>
                    <textarea
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                        placeholder="e.g., 'I want to inform Stephen about a potential opportunity or just inquire about something...'"
                        className="email-assistant-textarea"
                    />
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <label className="email-assistant-label">Your Name (optional):</label>
                    <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Sam Smith"
                        className="email-assistant-input"
                    />
                </div>

                <div style={{ textAlign: "center", marginBottom: drafts.length > 0 ? "30px" : "0" }}>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn-email-generate"
                    >
                        {loading ? <FaSpinner className="spin" /> : <FaMagic />}
                        {loading ? "Generating Drafts..." : "Generate Custom Drafts"}
                    </button>
                </div>

                {error && <p style={{ color: "#ff5e5e", textAlign: "center", fontSize: "0.9rem", margin: "10px 0 0" }}>{error}</p>}

                {drafts.length > 0 && (
                    <div style={{ display: "grid", gap: "20px", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                        {drafts.map((draft, idx) => (
                            <div 
                                key={idx} 
                                className={`email-draft-card ${selectedDraft === idx ? 'selected' : ''}`}
                                onClick={() => setSelectedDraft(idx)}
                            >
                                <div style={{
                                    textTransform: "uppercase",
                                    fontSize: "0.7rem",
                                    color: "var(--telemetry-color)",
                                    marginBottom: "10px",
                                    fontWeight: "bold",
                                    letterSpacing: "1px"
                                }}>
                                    {draft.style}
                                </div>
                                <div style={{ fontWeight: "bold", marginBottom: "8px", color: "var(--email-glass-btn-text)", fontSize: "0.9rem" }}>
                                    Subject: {draft.subject}
                                </div>
                                <div style={{
                                    fontSize: "0.85rem",
                                    color: "var(--email-glass-label)",
                                    whiteSpace: "pre-wrap",
                                    marginBottom: "20px",
                                    lineHeight: "1.5"
                                }}>
                                    {draft.body}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSend(draft);
                                    }}
                                    className="btn-draft-send"
                                >
                                    <FaPaperPlane /> Send to Stephen
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                .email-assistant-container {
                    max-width: 750px;
                    margin: 0 auto;
                    text-align: left;
                    width: 100%;
                    box-sizing: border-box;
                    background: var(--email-glass-bg);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid var(--email-glass-border);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 50px rgba(255, 255, 255, 0.03), 0 10px 30px rgba(0, 0, 0, 0.12);
                    transition: all 0.4s ease;
                }

                @media (max-width: 768px) {
                    .email-assistant-container {
                        padding: 24px !important;
                    }
                }

                .email-assistant-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: var(--email-glass-label);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: color 0.4s ease;
                }

                .email-assistant-textarea {
                    width: 100%;
                    padding: 15px;
                    border-radius: 12px;
                    border: 1px solid var(--email-glass-input-border);
                    background: var(--email-glass-input-bg);
                    color: var(--email-glass-btn-text);
                    min-height: 120px;
                    font-size: 0.95rem;
                    font-family: 'Inter', sans-serif;
                    resize: vertical;
                    box-sizing: border-box;
                    outline: none;
                    transition: all 0.25s ease;
                }

                .email-assistant-textarea:focus {
                    border-color: var(--email-glass-btn-border);
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
                }

                .email-assistant-input {
                    width: 100%;
                    padding: 12px 15px;
                    border-radius: 12px;
                    border: 1px solid var(--email-glass-input-border);
                    background: var(--email-glass-input-bg);
                    color: var(--email-glass-btn-text);
                    font-size: 0.95rem;
                    font-family: 'Inter', sans-serif;
                    box-sizing: border-box;
                    outline: none;
                    transition: all 0.25s ease;
                }

                .email-assistant-input:focus {
                    border-color: var(--email-glass-btn-border);
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
                }

                .btn-email-generate {
                    padding: 12px 30px;
                    border-radius: 30px;
                    border: 1px solid var(--email-glass-btn-border);
                    background: var(--email-glass-btn-bg);
                    color: var(--email-glass-btn-text);
                    font-weight: bold;
                    font-size: 0.95rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.03);
                    outline: none;
                }

                .btn-email-generate:hover:not(:disabled) {
                    background: var(--email-glass-btn-hover);
                    border-color: var(--email-glass-btn-border);
                    transform: scale(1.05) translateY(-1px);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.18);
                }

                .btn-email-generate:disabled {
                    background: rgba(255, 255, 255, 0.03);
                    border-color: rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.25);
                    cursor: not-allowed;
                }

                .email-draft-card {
                    padding: 20px;
                    border: 1px solid var(--email-glass-input-border);
                    border-radius: 14px;
                    background: var(--email-glass-input-bg);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
                }

                .email-draft-card:hover {
                    transform: scale(1.03) translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.08);
                    border-color: var(--email-glass-btn-border);
                }

                .email-draft-card.selected {
                    border: 2.5px solid var(--email-glass-btn-border) !important;
                    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.08) !important;
                }

                .btn-draft-send {
                    width: 100%;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid var(--email-glass-btn-border);
                    background: var(--email-glass-btn-bg);
                    color: var(--email-glass-btn-text);
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.25s ease;
                    outline: none;
                }

                .btn-draft-send:hover {
                    background: var(--email-glass-btn-hover);
                    border-color: var(--email-glass-btn-border);
                    transform: scale(1.05) translateY(-1px);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.18) !important;
                }
            `}</style>
            </div>
        </section>
    );
};

export default EmailDraftAssistant;
