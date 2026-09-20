import { useState, useEffect, useRef } from "react";
import API from "../api/axiosInstance";
import {
    Bot,
    Send,
    Sparkles,
    Zap,
    Loader2,
    User,
    AlertCircle,
    Plus,
    MessageSquare,
    Trash2,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

const AiAssistantPage = () => {
    const [prompt, setPrompt] = useState("");
    const [aiPoints, setAiPoints] = useState(10);
    const [fetchingPoints, setFetchingPoints] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Chat History & Active Chat State
    const [chats, setChats] = useState([
        {
            id: "chat-1",
            title: "New Conversation",
            messages: [
                {
                    sender: "ai",
                    text: "Assalamu Alaikum! Main aapka AI Study Assistant hoon. Main aapki padhai aur concepts samajhne me kaise madad kar sakta hoon?",
                },
            ],
        },
    ]);
    const [activeChatId, setActiveChatId] = useState("chat-1");

    const chatEndRef = useRef(null);

    // Current Active Chat Object
    const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

    // Auto Scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages, loading]);

    // Fetch Daily AI Points on Load
    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            setFetchingPoints(true);
            const { data } = await API.get("/ai/points");
            if (data.success) {
                setAiPoints(data.aiPoints);
            }
        } catch (err) {
            console.error("Failed to fetch AI Points:", err);
        } finally {
            setFetchingPoints(false);
        }
    };

    // Create New Chat
    const handleNewChat = () => {
        const newId = `chat-${Date.now()}`;
        const newChatObj = {
            id: newId,
            title: "New Conversation",
            messages: [
                {
                    sender: "ai",
                    text: "New chat started! Aap apna sawal pooch sakte hain.",
                },
            ],
        };
        setChats([newChatObj, ...chats]);
        setActiveChatId(newId);
    };

    // Delete Chat
    const handleDeleteChat = (id, e) => {
        e.stopPropagation();
        if (chats.length === 1) return; // Don't delete last remaining chat
        const updated = chats.filter((c) => c.id !== id);
        setChats(updated);
        if (activeChatId === id) {
            setActiveChatId(updated[0].id);
        }
    };

    // Send Prompt to AI Endpoint
    const handleSend = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || loading || aiPoints <= 0) return;

        const userMessage = prompt.trim();
        setPrompt("");

        // 1. Update UI immediately with User Message
        const updatedMessages = [
            ...activeChat.messages,
            { sender: "user", text: userMessage },
        ];

        // Auto-update Chat Title if it's default
        let updatedTitle = activeChat.title;
        if (activeChat.title === "New Conversation") {
            updatedTitle = userMessage.length > 25 ? userMessage.substring(0, 25) + "..." : userMessage;
        }

        setChats((prev) =>
            prev.map((c) =>
                c.id === activeChatId
                    ? { ...c, title: updatedTitle, messages: updatedMessages }
                    : c
            )
        );

        setLoading(true);

        try {
            // 2. Call Backend API
            const { data } = await API.post("/ai/ask", { prompt: userMessage });

            if (data.success) {
                setChats((prev) =>
                    prev.map((c) =>
                        c.id === activeChatId
                            ? {
                                ...c,
                                messages: [
                                    ...c.messages,
                                    { sender: "ai", text: data.answer },
                                ],
                            }
                            : c
                    )
                );
                setAiPoints(data.remainingPoints);
            }
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                "AI response generate karne me error aaya. Kripya dubara try karein.";

            setChats((prev) =>
                prev.map((c) =>
                    c.id === activeChatId
                        ? {
                            ...c,
                            messages: [
                                ...c.messages,
                                { sender: "ai", text: `⚠️ ${errorMsg}`, isError: true },
                            ],
                        }
                        : c
                )
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
            {/* MOBILE BACKDROP OVERLAY */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden transition-opacity"
                />
            )}

            {/* LEFT SIDEBAR (CHAT HISTORY) */}
            <aside
                className={`fixed lg:relative top-0 bottom-0 left-0 z-40 flex flex-col justify-between bg-slate-900 border-r border-slate-800/80 transition-all duration-300 shrink-0 h-full ${sidebarOpen
                        ? "w-72 translate-x-0"
                        : "-translate-x-full lg:translate-x-0 lg:w-16"
                    }`}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* SIDEBAR HEADER */}
                    <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-full flex items-center justify-between text-slate-400 hover:text-white hover:font-bold transition rounded-lg p-1.5  "
                            title="Toggle Sidebar"
                        >
                            {/* Jab sidebar open hoga to Dashboard text show hoga */}
                            {/* {sidebarOpen && <span className="text-xs font-semibold truncate">Dashboard</span>} */}

                            {/* Dynamic Icon Switch */}
                            {sidebarOpen ? (
                                <span className="text-xs font-semibold truncate">Close</span>
                            ) : (
                                <Menu className="w-4 h-4 shrink-0 mx-auto" />
                            )}
                        </button>
                    </div>

                    {/* NEW CHAT BUTTON */}
                    <div className="p-3 shrink-0">
                        <button
                            onClick={handleNewChat}
                            className={`w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 transition cursor-pointer ${!sidebarOpen && "px-0"
                                }`}
                        >
                            <Plus className="w-4 h-4 stroke-[3] shrink-0" />
                            {sidebarOpen && <span>New Chat</span>}
                        </button>
                    </div>

                    {/* CHAT HISTORY LIST */}
                    {sidebarOpen && (
                        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 mb-2">
                                Recent Chats
                            </p>

                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => {
                                        setActiveChatId(chat.id);
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                    className={`group w-full p-2.5 rounded-xl text-xs font-medium flex items-center justify-between gap-2 cursor-pointer transition ${activeChatId === chat.id
                                            ? "bg-slate-800 text-amber-400 border border-amber-500/20"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 truncate min-w-0">
                                        <MessageSquare className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{chat.title}</span>
                                    </div>

                                    {chats.length > 1 && (
                                        <button
                                            onClick={(e) => handleDeleteChat(chat.id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition shrink-0"
                                            title="Delete Chat"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SIDEBAR FOOTER */}
                    {sidebarOpen && (
                        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/50 shrink-0">
                            <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                        Daily AI Points
                                    </p>
                                    <p className="text-xs font-black text-amber-400 truncate">
                                        {fetchingPoints ? "..." : `${aiPoints} / 10 Remaining`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* MAIN CHAT AREA */}
            <main className="flex-1 flex flex-col h-full w-full min-w-0 bg-slate-950 relative overflow-hidden">
                {/* TOP MAIN HEADER */}
                <header className="h-14 sm:h-16 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between bg-slate-900/40 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition shrink-0"
                            >
                                <Menu className="w-4 h-4" />
                            </button>
                        )}

                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shrink-0">
                            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1 truncate">
                                <span className="truncate">Academy AI Workspace</span>
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            </h1>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 truncate hidden sm:block">
                                Learn • Understand • Revise with AI
                            </p>
                        </div>
                    </div>

                    {/* POINTS BADGE */}
                    <div
                        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border flex items-center gap-1 sm:gap-1.5 shrink-0 transition ${aiPoints > 0
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            }`}
                    >
                        <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                        <span className="text-[11px] sm:text-xs font-black">
                            {aiPoints}/10
                        </span>
                    </div>
                </header>

                {/* CHAT MESSAGES BODY */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl w-full mx-auto scrollbar-thin scrollbar-thumb-slate-800">
                    {activeChat?.messages?.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-2.5 sm:gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.sender === "ai" && (
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed break-words ${msg.sender === "user"
                                        ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10"
                                        : msg.isError
                                            ? "bg-rose-950/40 border border-rose-500/30 text-rose-200 rounded-tl-none"
                                            : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>

                            {msg.sender === "user" && (
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 mt-0.5">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* AI TYPING INDICATOR */}
                    {loading && (
                        <div className="flex items-center gap-3 justify-start">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 sm:p-4 flex items-center gap-2 text-xs text-amber-400">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating response...</span>
                            </div>
                        </div>
                    )}

                    {/* NO POINTS WARNING BANNER */}
                    {aiPoints === 0 && (
                        <div className="p-3 sm:p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-1">
                            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xs sm:text-sm">
                                <AlertCircle className="w-4 h-4" /> Daily Points Limit Reached
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-400">
                                Aapke aaj ke 10 points complete ho gaye hain. Kal raat 12 baje
                                aapke points auto-reset ho jayenge!
                            </p>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* INPUT PROMPT FOOTER */}
                <footer className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 shrink-0">
                    <div className="max-w-4xl mx-auto space-y-1.5">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={
                                    aiPoints > 0
                                        ? "Poochhiye apna sawal..."
                                        : "Daily limit reached. Kal aaiye!"
                                }
                                disabled={loading || aiPoints <= 0}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-2xl pl-4 pr-12 sm:pr-14 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition disabled:opacity-50 shadow-inner"
                            />

                            <button
                                type="submit"
                                disabled={loading || !prompt.trim() || aiPoints <= 0}
                                className="absolute right-2 p-2 sm:p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed font-bold shadow-md cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                ) : (
                                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                )}
                            </button>
                        </form>

                        <p className="text-[9px] sm:text-[10px] text-center text-slate-500">
                            1 Prompt = 1 AI Point. Daily 10 points auto-reset at midnight.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AiAssistantPage;