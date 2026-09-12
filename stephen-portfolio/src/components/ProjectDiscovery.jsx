import React, { useState, useRef, useEffect } from 'react';
import { chatWithAIStream } from '../services/aiService';
import { FaRobot, FaTimes, FaPaperPlane, FaArrowRight, FaRedo } from 'react-icons/fa';
import { projects } from '../data/projects';
import useIsMobile from '../hooks/useIsMobile';


const ProjectDiscovery = () => {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { type: 'bot', content: "Hey! Ask me about my projects, skills, or experience or let's just talk!" }
    ]);
    const [loading, setLoading] = useState(false);
    // The API is serverless, so an idle-cold first request is slow but fine.
    // Saying so beats a silent bubble that reads as the assistant being broken.
    const [warming, setWarming] = useState(false);
    const panelRef = useRef(null);
    const messagesAreaRef = useRef(null);
    const lastRequestTimeRef = useRef(0);
    const RATE_LIMIT_MS = 2000;

    useEffect(() => {
        const openChat = () => setIsOpen(true);
        window.addEventListener('open-ai-assistant', openChat);
        return () => window.removeEventListener('open-ai-assistant', openChat);
    }, []);

    // Chat history resets on page reload (no localStorage persistence)

    // Scroll the message list itself. scrollIntoView also scrolls every
    // scrollable ancestor, which on a phone dragged the page behind the chat.
    const scrollToBottom = () => {
        const area = messagesAreaRef.current;
        area?.scrollTo({ top: area.scrollHeight, behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Full-screen on a phone. The panel tracks the visible area instead of
    // 100dvh, which ignores the keyboard on iOS: the keyboard covered the
    // input or pushed the header off the top. The page underneath holds still.
    useEffect(() => {
        if (!isOpen || !isMobile) return;
        const root = document.documentElement;
        const previousOverflow = root.style.overflow;
        root.style.overflow = "hidden";

        const vv = window.visualViewport;
        const panel = panelRef.current;
        const sync = () => {
            panel.style.setProperty("--chat-top", `${vv.offsetTop}px`);
            panel.style.setProperty("--chat-height", `${vv.height}px`);
        };
        // The keyboard shrinks the list, so keep the newest message in view.
        const onResize = () => {
            sync();
            const area = messagesAreaRef.current;
            if (area) area.scrollTop = area.scrollHeight;
        };
        if (vv && panel) {
            sync();
            vv.addEventListener("resize", onResize);
            vv.addEventListener("scroll", sync);
        }
        return () => {
            vv?.removeEventListener("resize", onResize);
            vv?.removeEventListener("scroll", sync);
            root.style.overflow = previousOverflow;
        };
    }, [isOpen, isMobile]);

    // Returns false, and says so in the chat, when the last request was too recent.
    const claimRequestSlot = () => {
        const now = Date.now();
        if (now - lastRequestTimeRef.current < RATE_LIMIT_MS) {
            setMessages(prev => [
                ...prev,
                {
                    type: 'bot',
                    content: "Please wait a moment before sending another message."
                }
            ]);
            return false;
        }
        lastRequestTimeRef.current = now;
        return true;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Checked before the rate limiter so an empty submit doesn't use up its
        // window. One reply at a time: a second stream writes into the same bubble.
        if (!query.trim() || loading || !claimRequestSlot()) return;
        const userMsg = query;
        setQuery('');
        streamReply(userMsg);
    };

    const retryReply = (userMsg) => {
        if (loading || !claimRequestSlot()) return;
        streamReply(userMsg, { retry: true });
    };

    const streamReply = async (userMsg, { retry = false } = {}) => {
        setLoading(true);
        // A retry swaps the failed reply for a fresh placeholder; a new message
        // gets its own bubble first.
        setMessages(prev => retry
            ? [...prev.slice(0, -1), { type: 'bot', content: '' }]
            : [...prev, { type: 'user', content: userMsg }, { type: 'bot', content: '' }]);

        let accumulatedContent = '';
        const warmupTimer = setTimeout(() => setWarming(true), 4000);
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
            }, {
                onStatus: (phase) => {
                    if (phase === 'streaming' || phase === 'done') {
                        clearTimeout(warmupTimer);
                        setWarming(false);
                    }
                }
            });

            if (!accumulatedContent.trim()) {
                const empty = new Error("That reply came back empty. Give it another try.");
                empty.retryable = true;
                throw empty;
            }
        } catch (err) {
            console.error("AI Chat Error:", err);
            const failure = {
                type: 'bot',
                // Rate-limit replies explain what to do next, so show them as-is
                // rather than burying them under the generic failure message.
                content: err?.message || "Sorry, I had trouble connecting to my brain.",
                retryWith: err?.retryable ? userMsg : undefined
            };
            // Fill the empty bubble opened for this reply. Appending instead left
            // it behind as a blank stray above the error. A reply that stalled
            // partway keeps its text and gets the error underneath.
            setMessages(prev => {
                const last = prev[prev.length - 1];
                const isEmptyPlaceholder = last?.type === 'bot' && !last.content && !last.projects;
                return isEmptyPlaceholder ? [...prev.slice(0, -1), failure] : [...prev, failure];
            });
        } finally {
            clearTimeout(warmupTimer);
            setWarming(false);
            setLoading(false);
        }
    };

    // On a phone the button drops its label and shrinks to an icon: the full
    // pill sat on top of whatever card was scrolled under it.
    const fabSize = isMobile ? 56 : 60;
    const fabCompact = isMobile || isOpen;
    const canSend = Boolean(query.trim()) && !loading;

    return (
        <>
            {/* Floating Toggle Button — hidden on mobile when chat is open */}
            <button
                id="ai-assistant-btn"
                onClick={() => setIsOpen(!isOpen)}
                className={`btn-ai-assistant${isOpen ? " is-open" : ""}`}
                aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
                aria-expanded={isOpen}
                style={{
                    position: "fixed",
                    bottom: isMobile ? "calc(16px + env(safe-area-inset-bottom, 0px))" : "30px",
                    right: isMobile ? "16px" : "30px",
                    display: isMobile && isOpen ? "none" : "flex",
                    width: fabCompact ? `${fabSize}px` : "auto",
                    height: `${fabSize}px`,
                    padding: fabCompact ? "0" : "0 25px",
                    borderRadius: `${fabSize / 2}px`,
                    background: "var(--color-monica)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    boxShadow: "0 0 20px rgba(167,210,115,0.22), 0 8px 30px rgba(0,0,0,0.12)",
                    color: "var(--bg-color)",
                    border: "1px solid var(--color-monica)",
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
                ) : isMobile ? (
                    <FaRobot style={{ fontSize: "1.5rem" }} />
                ) : (
                    <>
                        <FaRobot style={{ fontSize: "1.5rem", marginRight: "10px" }} />
                        <span>AI Assistant</span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div ref={panelRef} style={{
                    position: "fixed",
                    ...(isMobile ? {
                        // Set from visualViewport by the effect above.
                        top: "var(--chat-top, 0px)",
                        left: 0,
                        right: 0,
                        width: "100%",
                        height: "var(--chat-height, 100dvh)",
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
                    // Not `all`: top and height follow the keyboard and mustn't lag it.
                    transition: "background 0.4s ease, border-color 0.4s ease"
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
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.5px"
                    }}>
                        <FaRobot className="blink-led" style={{ color: "var(--chat-user-text)" }} />
                        <span style={{ flex: 1 }}>AI ASSISTANT</span>
                        {isMobile && (
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close AI assistant"
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
                        ref={messagesAreaRef}
                        className="custom-scrollbar"
                        style={{
                            flex: 1,
                            padding: "20px",
                            overflowY: "auto",
                            // Reaching the end of the list mustn't hand the swipe to the page.
                            overscrollBehavior: "contain",
                            background: "var(--chat-msg-area)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                            transition: "background 0.4s ease"
                        }}
                    >
                        {/* A reply's bubble stays hidden until its first words arrive;
                            the Thinking line below covers the wait. */}
                        {messages.map((msg, idx) => !msg.content && !msg.projects ? null : (
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
                                    fontFamily: "var(--font-mono)",
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

                                {msg.retryWith && idx === messages.length - 1 && !loading && (
                                    <button
                                        type="button"
                                        onClick={() => retryReply(msg.retryWith)}
                                        className="interactive-scale-sm"
                                        style={{
                                            marginTop: "8px",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "6px 12px",
                                            borderRadius: "12px",
                                            border: "1px solid var(--chat-user-border)",
                                            background: "var(--chat-user-bg)",
                                            color: "var(--chat-user-text)",
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.75rem",
                                            fontWeight: "bold",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <FaRedo style={{ fontSize: "0.7rem" }} /> Try again
                                    </button>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: "flex-start", color: "var(--chat-user-text)", fontSize: "0.78rem", marginLeft: "10px", fontFamily: "var(--font-mono)" }} className="blink-led">
                                {warming ? 'SEC_AI // Waking up, first request is slow...' : 'SEC_AI // Thinking...'}
                            </div>
                        )}
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
                            aria-label="Message the AI assistant"
                            enterKeyHint="send"
                            style={{
                                flex: 1,
                                padding: "10px 15px",
                                borderRadius: "20px",
                                border: "1px solid var(--chat-input-border)",
                                background: "var(--chat-input-bg)",
                                color: "var(--text-title)",
                                outline: "none",
                                fontSize: "0.85rem",
                                fontFamily: "var(--font-mono)",
                                transition: "all 0.25s ease"
                            }}
                            onFocus={e => e.target.style.borderColor = "var(--chat-user-text)"}
                            onBlur={e => e.target.style.borderColor = "var(--chat-input-border)"}
                        />
                        <button
                            type="submit"
                            disabled={!canSend}
                            aria-label="Send message"
                            className="interactive-scale-sm"
                            style={{
                                background: !canSend ? "var(--chat-border)" : "var(--chat-user-text)",
                                color: "var(--bg-color)",
                                border: "none",
                                borderRadius: "12px",
                                width: "54px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: !canSend ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: "none",
                                outline: 'none'
                            }}
                            onMouseOver={e => {
                                if (canSend) {
                                    e.currentTarget.style.filter = "brightness(0.9)";
                                }
                            }}
                            onMouseOut={e => {
                                if (canSend) {
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
                .btn-ai-assistant:not(.is-open) {
                    animation: ai-pulse-ring 2.2s ease-out infinite, ai-shake 5s ease-in-out infinite;
                }
                /* On a phone the button floats over whatever is being read; the
                   pulse is enough without a shake every five seconds as well. */
                @media (max-width: 767px), (hover: none) {
                    .btn-ai-assistant:not(.is-open) {
                        animation: ai-pulse-ring 2.2s ease-out infinite;
                    }
                }
                @keyframes ai-pulse-ring {
                    0%   { box-shadow: 0 0 20px rgba(167,210,115,0.22), 0 8px 30px rgba(0,0,0,0.12), 0 0 0 0 rgba(167,210,115,0.55); }
                    65%  { box-shadow: 0 0 20px rgba(167,210,115,0.22), 0 8px 30px rgba(0,0,0,0.12), 0 0 0 20px rgba(167,210,115,0); }
                    100% { box-shadow: 0 0 20px rgba(167,210,115,0.22), 0 8px 30px rgba(0,0,0,0.12), 0 0 0 0 rgba(167,210,115,0); }
                }
                @keyframes ai-shake {
                    0%, 78%, 100% { transform: translateX(0) rotate(0deg); }
                    80%  { transform: translateX(-4px) rotate(-1.5deg); }
                    82%  { transform: translateX(4px) rotate(1.5deg); }
                    84%  { transform: translateX(-3px) rotate(-1deg); }
                    86%  { transform: translateX(3px) rotate(1deg); }
                    88%  { transform: translateX(-1px) rotate(0deg); }
                    90%  { transform: translateX(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .btn-ai-assistant:not(.is-open) { animation: none; }
                }
                /* Hover lift only where hover exists: a tap on iOS leaves :hover
                   stuck on, which kept the button scaled up after the tap. */
                @media (hover: hover) {
                    .btn-ai-assistant:hover {
                        transform: scale(1.08) translateY(-2px) !important;
                        background: var(--color-monica) !important;
                        color: var(--bg-color) !important;
                        border-color: var(--color-monica) !important;
                        box-shadow: 0 12px 35px rgba(167, 210, 115, 0.3) !important;
                    }
                }
            `}</style>
        </>
    );
};

export default ProjectDiscovery;
