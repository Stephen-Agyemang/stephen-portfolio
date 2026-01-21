import React, { useState, useRef, useEffect } from 'react';
import { findMatchingProjects } from '../services/aiService';
import { FaRobot, FaTimes, FaPaperPlane, FaArrowRight } from 'react-icons/fa';
import { projects } from '../data/projects';

const ProjectDiscovery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [messages, setMessages] = useState([
        { type: 'bot', content: "Hi! I'm Stephen's AI Assistant. Ask me about his projects or skills!" }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMsg = query;
        setQuery('');
        setMessages(prev => [...prev, { type: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await findMatchingProjects(userMsg, projects);
            const { reply, matches } = response;
            const matchedProjects = projects.filter(p => matches.includes(p.name));

            setMessages(prev => [...prev, {
                type: 'bot',
                content: reply,
                projects: matchedProjects.length > 0 ? matchedProjects : null
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', content: "Sorry, I had trouble connecting to my brain. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    width: isOpen ? "60px" : "auto",
                    height: "60px",
                    padding: isOpen ? "0" : "0 25px",
                    borderRadius: "30px",
                    background: scrolled || isOpen ? "#c9ec9e" : (isHovered ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)"),
                    backdropFilter: scrolled || isOpen ? "none" : "blur(5px)",
                    WebkitBackdropFilter: scrolled || isOpen ? "none" : "blur(5px)",
                    boxShadow: scrolled || isOpen ? "0 4px 15px rgba(0,0,0,0.1)" : "0 4px 15px rgba(0,0,0,0.05)",
                    color: scrolled || isOpen ? "#000" : "white",
                    border: scrolled || isOpen ? "none" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    zIndex: 1000
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
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
                    bottom: "100px",
                    right: "30px",
                    width: "350px",
                    height: "500px",
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.4)"
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "15px 20px",
                        background: "#c9ec9e",
                        color: "#000",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <FaRobot /> AI Assistant
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: "20px",
                        overflowY: "auto",
                        background: "#f9f9f9",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px"
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.type === 'user' ? "flex-end" : "flex-start",
                                maxWidth: "80%",
                            }}>
                                <div style={{
                                    padding: "12px 16px",
                                    borderRadius: "15px",
                                    background: msg.type === 'user' ? "#c9ec9e" : "white",
                                    color: msg.type === 'user' ? "#000" : "#333",
                                    boxShadow: msg.type === 'bot' ? "0 2px 5px rgba(0,0,0,0.05)" : "none",
                                    borderBottomRightRadius: msg.type === 'user' ? "4px" : "15px",
                                    borderBottomLeftRadius: msg.type === 'bot' ? "4px" : "15px",
                                    fontSize: "0.95rem",
                                    lineHeight: "1.4"
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
                                                style={{
                                                    display: "block",
                                                    padding: "10px",
                                                    background: "white",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ddd",
                                                    textDecoration: "none",
                                                    color: "#333",
                                                    fontSize: "0.9rem",
                                                    transition: "background 0.2s"
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = "#f0f8f4"}
                                                onMouseOut={(e) => e.currentTarget.style.background = "white"}
                                            >
                                                <div style={{ fontWeight: "bold", color: "#6cad45", marginBottom: "4px" }}>
                                                    {p.name}
                                                </div>
                                                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                                    View Code <FaArrowRight style={{ fontSize: "0.7rem", verticalAlign: "middle" }} />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: "flex-start", color: "#888", fontSize: "0.8rem", marginLeft: "10px" }}>
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSearch} style={{
                        padding: "15px",
                        background: "white",
                        borderTop: "1px solid #eee",
                        display: "flex",
                        gap: "10px"
                    }}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about projects..."
                            style={{
                                flex: 1,
                                padding: "10px 15px",
                                borderRadius: "20px",
                                border: "1px solid #ddd",
                                outline: "none",
                                fontSize: "0.95rem"
                            }}
                        />
                        <button type="submit" style={{
                            background: "#c9ec9e",
                            color: "#000",
                            border: "none",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            transition: "background 0.2s"
                        }}
                            onMouseOver={(e) => e.currentTarget.style.background = "#b8db8d"}
                            onMouseOut={(e) => e.currentTarget.style.background = "#c9ec9e"}
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ProjectDiscovery;
