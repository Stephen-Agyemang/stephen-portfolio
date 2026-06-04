import React, { useState, useRef, useEffect } from 'react';
import { chatWithAIStream } from '../services/aiService';
import { FaRobot, FaTimes, FaPaperPlane, FaArrowRight } from 'react-icons/fa';
import { projects } from '../data/projects';
import useIsMobile from '../hooks/useIsMobile';


const ProjectDiscovery = () => {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { type: 'bot', content: "Hey! Ask me about my projects, skills, or experience or let's just talk!" }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const lastRequestTimeRef = useRef(0);
    const RATE_LIMIT_MS = 2000;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Chat history resets on page reload (no localStorage persistence)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSearch = async (e) => {
        e.preventDefault();

        const now = Date.now();

        if (now - lastRequestTimeRef.current < RATE_LIMIT_MS) {
            setMessages(prev => [
                ...prev,
                {
                    type: 'bot',
                    content: "Please wait a moment before sending another message."
                }
            ])
            return;
        }
        lastRequestTimeRef.current = now;
        if (!query.trim()) return;

        const userMsg = query;
        setQuery('');

        setMessages(prev => [...prev, { type: 'user', content: userMsg }]);
        setLoading(true);

        setMessages(prev => [...prev, { type: 'bot', content: '' }]);

        let accumulatedContent = '';
        try {
            await chatWithAIStream(userMsg, projects, (chunk) => {
                accumulatedContent += chunk;

                // Split conversational reply from project matches
                const [replyPart, projectsPart] = accumulatedContent.split('---PROJECTS---');

                let matchedProjects = [];
                if (projectsPart) {
                    const projectNames = projectsPart.split(',').map(n => n.trim()).filter(Boolean);
                    matchedProjects = projects.filter(p =>
                        projectNames.some(name => p.name.toLowerCase().includes(name.toLowerCase()))
                    );
                }

                setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: replyPart.trim(),
                        projects: matchedProjects.length > 0 ? matchedProjects : undefined
                    };
                    return updated;
                });
            });
        } catch (err) {
            console.error("AI Chat Error:", err);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "Sorry, I had trouble connecting to my brain."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button — hidden on mobile when chat is open */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-ai-assistant"
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    display: isMobile && isOpen ? "none" : "flex",
                    width: isOpen ? "60px" : "auto",
                    height: "60px",
                    padding: isOpen ? "0" : "0 25px",
                    borderRadius: "30px",
                    background: scrolled || isOpen ? "var(--color-monica)" : "var(--btn-secondary-bg)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    color: scrolled || isOpen ? "var(--bg-color)" : "var(--text-color)",
                    border: scrolled || isOpen ? "1px solid var(--color-monica)" : "1px solid var(--btn-secondary-border)",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    zIndex: 1000,
                    outline: 'none'
                }}
            >
                {isOpen ? (
                    <FaTimes style={{ fontSize: "1.5rem" }} />
                ) : (
                    <>
                        <FaRobot style={{ fontSize: "1.5rem", marginRight: "10px" }} />
                        <span>AI Assistant</span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: "fixed",
                    ...(isMobile ? {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: "100%",
                        height: "100dvh",
                        borderRadius: 0,
                    } : {
                        bottom: "100px",
                        right: "30px",
                        width: "350px",
                        height: "500px",
                        borderRadius: "20px",
                    }),
                    background: "var(--chat-bg)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.18)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1001,
                    overflow: "hidden",
                    border: isMobile ? "none" : "1px solid var(--chat-border)",
                    transition: "all 0.4s ease"
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "15px 20px",
                        background: "var(--chat-header)",
                        color: "var(--chat-user-text)",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        borderBottom: "1px solid var(--chat-border)",
                        fontFamily: "'Courier New', Courier, monospace",
                        letterSpacing: "0.5px"
                    }}>
                        <FaRobot className="blink-led" style={{ color: "var(--chat-user-text)" }} />
                        <span style={{ flex: 1 }}>AI ASSISTANT</span>
                        {isMobile && (
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--chat-user-text)",
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    fontSize: "1.2rem",
                                    display: "flex",
                                    alignItems: "center",
                                    outline: "none",
                                }}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div 
                        className="custom-scrollbar"
                        style={{
                            flex: 1,
                            padding: "20px",
                            overflowY: "auto",
                            background: "var(--chat-msg-area)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                            transition: "background 0.4s ease"
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.type === 'user' ? "flex-end" : "flex-start",
                                maxWidth: "85%",
                            }}>
                                <div style={{
                                    padding: "11px 15px",
                                    borderRadius: "15px",
                                    background: msg.type === 'user' ? "var(--chat-user-bg)" : "var(--chat-bot-bg)",
                                    color: msg.type === 'user' ? "var(--chat-user-text)" : "var(--chat-bot-text)",
                                    border: msg.type === 'user' ? "1px solid var(--chat-user-border)" : "1px solid var(--chat-bot-border)",
                                    boxShadow: msg.type === 'user' ? "0 0 12px rgba(167, 210, 115, 0.05)" : "none",
                                    borderBottomRightRadius: msg.type === 'user' ? "4px" : "15px",
                                    borderBottomLeftRadius: msg.type === 'bot' ? "4px" : "15px",
                                    fontSize: "0.82rem",
                                    lineHeight: "1.45",
                                    wordBreak: "break-word",
                                    fontFamily: msg.type === 'bot' ? "'Inter', sans-serif" : "'Courier New', Courier, monospace",
                                    transition: "all 0.3s ease"
                                }}>
                                    {msg.content}
                                </div>

                                {/* Render matching projects if any */}
                                {msg.projects && (
                                    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {msg.projects.map((p, pIdx) => (
                                            <a
                                                key={pIdx}
                                                href={p.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="interactive-scale-sm"
                                                style={{
                                                    display: "block",
                                                    padding: "10px",
                                                    background: "var(--chat-bot-bg)",
                                                    borderRadius: "10px",
                                                    border: "1px solid var(--chat-border)",
                                                    textDecoration: "none",
                                                    color: "var(--chat-bot-text)",
                                                    fontSize: "0.85rem",
                                                    transition: "background 0.2s"
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = "var(--chat-header)"}
                                                onMouseOut={(e) => e.currentTarget.style.background = "var(--chat-bot-bg)"}
                                            >
                                                <div style={{ fontWeight: "bold", color: "var(--chat-user-text)", marginBottom: "4px" }}>
                                                    {p.name}
                                                </div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-color)", display: "flex", alignItems: "center", gap: "4px" }}>
                                                    View Code <FaArrowRight style={{ fontSize: "0.65rem" }} />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: "flex-start", color: "var(--chat-user-text)", fontSize: "0.78rem", marginLeft: "10px", fontFamily: "'Courier New', Courier, monospace" }} className="blink-led">
                                SEC_AI // Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSearch} style={{
                        padding: "15px",
                        paddingBottom: isMobile ? "max(15px, env(safe-area-inset-bottom))" : "15px",
                        background: "var(--chat-form-bg)",
                        borderTop: "1px solid var(--chat-border)",
                        display: "flex",
                        gap: "10px"
                    }}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about projects, skills..."
                            style={{
                                flex: 1,
                                padding: "10px 15px",
                                borderRadius: "20px",
                                border: "1px solid var(--chat-input-border)",
                                background: "var(--chat-input-bg)",
                                color: "var(--text-title)",
                                outline: "none",
                                fontSize: "0.85rem",
                                fontFamily: "'Inter', sans-serif",
                                transition: "all 0.25s ease"
                            }}
                            onFocus={e => e.target.style.borderColor = "var(--chat-user-text)"}
                            onBlur={e => e.target.style.borderColor = "var(--chat-input-border)"}
                        />
                        <button
                            type="submit"
                            disabled={!query.trim()}
                            className="interactive-scale-sm"
                            style={{
                                background: !query.trim() ? "var(--chat-border)" : "var(--chat-user-text)",
                                color: "var(--bg-color)",
                                border: "none",
                                borderRadius: "12px",
                                width: "54px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: !query.trim() ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: "none",
                                outline: 'none'
                            }}
                            onMouseOver={e => {
                                if (query.trim()) {
                                    e.currentTarget.style.filter = "brightness(0.9)";
                                }
                            }}
                            onMouseOut={e => {
                                if (query.trim()) {
                                    e.currentTarget.style.filter = "brightness(1)";
                                }
                            }}
                        >
                            <FaArrowRight size={20} />
                        </button>
                    </form>
                </div>
            )}
            <style>{`
                .btn-ai-assistant {
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .btn-ai-assistant:hover {
                    transform: scale(1.08) translateY(-2px) !important;
                    background: var(--color-monica) !important;
                    color: var(--bg-color) !important;
                    border-color: var(--color-monica) !important;
                    box-shadow: 0 12px 35px rgba(167, 210, 115, 0.3) !important;
                }
            `}</style>
        </>
    );
};

export default ProjectDiscovery;
