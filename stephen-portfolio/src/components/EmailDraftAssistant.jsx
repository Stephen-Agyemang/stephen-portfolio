import React, { useState } from 'react';
import { generateEmailDrafts } from '../services/aiService';
import { FaPaperPlane, FaMagic, FaSpinner } from 'react-icons/fa';

const EmailDraftAssistant = () => {
    const [intent, setIntent] = useState('');
    const [senderName, setSenderName] = useState('');
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDraft, setSelectedDraft] = useState(null);

    const handleGenerate = async () => {
        if (!intent.trim()) return;

        setLoading(true);
        setError('');
        setDrafts([]);
        setSelectedDraft(null);

        try {
            const results = await generateEmailDrafts(intent);
            // Replace placeholder with actual name if provided
            const finalResults = results.map(draft => ({
                ...draft,
                body: senderName ? draft.body.replace("[Your Name]", senderName) : draft.body
            }));
            setDrafts(finalResults);
        } catch (err) {
            setError('Failed to generate drafts. Please check your API key or try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = (draft) => {
        const mailtoLink = `mailto:agyemangstephen2580@gmail.com?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        window.location.href = mailtoLink;
    };

    const isMobile = window.innerWidth < 768;

    return (
        <section id="contact-assistant" style={{
            padding: isMobile ? "50px 16px" : "60px 20px",
            background: "transparent",
            borderTop: "1px solid #eaeaea",
            textAlign: "center"
        }}>
            <h2 style={{
                fontSize: isMobile ? "1.8rem" : "2.5rem",
                marginBottom: "20px",
                color: isMobile ? "#a6bd9bff" : "#444",
                fontFamily: "'Courier New', Courier, monospace"
            }}>
                Email Draft Assistant
            </h2>
            <p style={{
                marginBottom: "30px",
                color: isMobile ? "#a6bd9bff" : "#666",
                fontFamily: "'Inter', sans-serif",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                Not sure what to say? Use let my Intelligent Other here help you draft an email.
            </p>

            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "left", width: "100%", boxSizing: "border-box" }}>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: isMobile ? "#a6bd9bff" : "#555" }}>What would you like to say?</label>
                    <textarea
                        value={intent}
                        onChange={(e) => setIntent(e.target.value)}
                        placeholder="e.g., 'I want to discuss a freelance React project for my startup...'"
                        style={{
                            width: "100%",
                            padding: "15px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            minHeight: "120px",
                            fontSize: "1rem",
                            fontFamily: "'Inter', sans-serif",
                            resize: "vertical",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: isMobile ? "#a6bd9bff" : "#555" }}>Your Name (optional):</label>
                    <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. John Doe"
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            fontSize: "1rem",
                            fontFamily: "'Inter', sans-serif",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !intent.trim()}
                        style={{
                            padding: "12px 30px",
                            borderRadius: "30px",
                            border: "none",
                            background: loading ? "#ccc" : "#c9ec9e",
                            color: "#000",
                            fontSize: "1rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "transform 0.2s"
                        }}
                    >
                        {loading ? <FaSpinner className="spin" /> : <FaMagic />}
                        {loading ? "Drafting..." : "Generate Magic Drafts"}
                    </button>
                </div>

                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                {drafts.length > 0 && (
                    <div style={{ display: "grid", gap: "20px", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
                        {drafts.map((draft, idx) => (
                            <div key={idx} style={{
                                padding: "20px",
                                border: selectedDraft === idx ? "2px solid #c9ec9e" : "1px solid #ddd",
                                borderRadius: "10px",
                                background: "white",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                                onClick={() => setSelectedDraft(idx)}
                            >
                                <div style={{
                                    textTransform: "uppercase",
                                    fontSize: "0.8rem",
                                    color: "#888",
                                    marginBottom: "10px",
                                    fontWeight: "bold",
                                    letterSpacing: "1px"
                                }}>
                                    {draft.style}
                                </div>
                                <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                                    Subject: {draft.subject}
                                </div>
                                <div style={{
                                    fontSize: "0.9rem",
                                    color: "#555",
                                    whiteSpace: "pre-wrap",
                                    marginBottom: "20px",
                                    lineHeight: "1.4"
                                }}>
                                    {draft.body}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSend(draft);
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        border: "none",
                                        background: "#c9ec9e",
                                        color: "#000",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px"
                                    }}
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
            `}</style>
        </section>
    );
};

export default EmailDraftAssistant;
