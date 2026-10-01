import { useState, useEffect, useRef } from "react";
import API from "../api/axiosInstance";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  Menu,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import AiErrorCard from "../components/AiErrorCard";

const AiAssistantPage = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
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

  // Fetch Daily AI Points and Chat History on Load
  useEffect(() => {
    fetchPoints();
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const { data } = await API.get("/ai/history");
      if (data.success && data.chats && data.chats.length > 0) {
        const formattedChats = data.chats.map((c) => ({
          id: c.chatId || c._id || c.id,
          title: c.title || "Untitled Chat",
          messages: c.messages || [],
        }));
        setChats(formattedChats);
        setActiveChatId(formattedChats[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

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
    setChats((prev) => [newChatObj, ...prev]);
    setActiveChatId(newId);
  };

  // Delete Chat
  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    if (chats.length === 1) return; // Don't delete last remaining chat

    const updated = chats.filter((c) => c.id !== id);
    setChats(updated);

    if (activeChatId === id) {
      setActiveChatId(updated[0].id);
    }

    try {
      await API.delete(`/ai/history/${id}`);
    } catch (err) {
      console.error("Failed to delete chat on backend:", err);
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

    // Auto-update Chat Title if default
    let updatedTitle = activeChat.title;
    if (activeChat.title === "New Conversation") {
      updatedTitle =
        userMessage.length > 25
          ? userMessage.substring(0, 25) + "..."
          : userMessage;
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
      const { data } = await API.post("/ai/ask", {
        prompt: userMessage,
        chatId: activeChatId,
      });

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
        if (typeof data.remainingPoints === "number") {
          setAiPoints(data.remainingPoints);
        }
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

  // Copy Message Function
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  // Share Message Function
  const handleShare = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Academy AI Response",
          text: text,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Response copied to clipboard for sharing!");
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-800 overflow-hidden font-sans relative">
      {/* MOBILE BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      {/* LEFT SIDEBAR (CHAT HISTORY) */}
      <aside
        className={`fixed lg:relative top-0 bottom-0 left-0 z-40 flex flex-col justify-between bg-white border-r border-slate-200 transition-all duration-300 shrink-0 h-full ${
          sidebarOpen
            ? "w-72 translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-16"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* SIDEBAR HEADER */}
          <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-100 shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-between text-slate-500 hover:text-slate-900 hover:font-bold transition rounded-lg p-1.5"
              title="Toggle Sidebar"
            >
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
              className={`w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                !sidebarOpen && "px-0"
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3] shrink-0" />
              {sidebarOpen && <span>New Chat</span>}
            </button>
          </div>

          {/* CHAT HISTORY LIST */}
          {sidebarOpen && (
            <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-2">
                Recent Chats
              </p>

              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`group w-full p-2.5 rounded-xl text-xs font-medium flex items-center justify-between gap-2 cursor-pointer transition ${
                    activeChatId === chat.id
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </div>

                  {chats.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition shrink-0"
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
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm">
                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    Daily AI Points
                  </p>
                  <p className="text-xs font-black text-amber-600 truncate">
                    {fetchingPoints
                      ? "..."
                      : `${aiPoints} / 10 Remaining`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col h-full w-full min-w-0 bg-slate-50 relative overflow-hidden">
        {/* TOP MAIN HEADER */}
        <header className="h-14 sm:h-16 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 transition shrink-0"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1 truncate">
                <span className="truncate">Academy AI Workspace</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-500 truncate hidden sm:block">
                Learn • Understand • Revise with AI
              </p>
            </div>
          </div>

          {/* POINTS BADGE */}
          <div
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border flex items-center gap-1 sm:gap-1.5 shrink-0 transition ${
              aiPoints > 0
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-rose-50 border-rose-200 text-rose-600"
            }`}
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span className="text-[11px] sm:text-xs font-black">
              {aiPoints}/10
            </span>
          </div>
        </header>

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl w-full mx-auto scrollbar-thin scrollbar-thumb-slate-200">
          {activeChat?.messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2.5 sm:gap-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl text-xs sm:text-sm leading-relaxed break-words ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-white font-medium rounded-tr-none shadow-sm p-3 sm:p-5"
                    : msg.isError
                    ? "bg-rose-50 border border-rose-200 text-rose-700 rounded-tl-none p-3.5 sm:p-4 shadow-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none p-3 sm:p-5 shadow-sm"
                }`}
              >
                {msg.sender === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : msg.isError ? (
                  <AiErrorCard message={msg.text.replace("⚠️ ", "")} />
                ) : (
                  <div className="space-y-3">
                    <div className="markdown-body text-slate-800 space-y-3">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-base sm:text-lg font-bold text-amber-700 border-b border-slate-200 pb-1 mt-3 mb-2"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-sm sm:text-base font-bold text-amber-600 mt-3 mb-1.5"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-xs sm:text-sm font-semibold text-amber-600 mt-2 mb-1"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p
                              className="text-xs sm:text-sm leading-relaxed text-slate-700 my-1"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc list-inside space-y-1 my-2 pl-1 text-slate-700"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal list-inside space-y-1 my-2 pl-1 text-slate-700"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="leading-relaxed" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className="font-semibold text-amber-800"
                              {...props}
                            />
                          ),
                          code: ({ node, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const isBlock =
                              match || String(children).includes("\n");

                            return isBlock ? (
                              <pre className="bg-slate-900 border border-slate-800 p-3 rounded-xl overflow-x-auto my-2 text-[11px] sm:text-xs font-mono text-slate-100">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code
                                className="bg-slate-100 text-amber-700 border border-slate-200 px-1.5 py-0.5 rounded text-[11px] font-mono"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="border-l-2 border-amber-500 pl-3 py-1 italic bg-amber-50 my-2 rounded-r-lg text-slate-600"
                              {...props}
                            />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3">
                              <table
                                className="w-full text-left border-collapse border border-slate-200 text-xs"
                                {...props}
                              />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              className="bg-slate-100 border border-slate-200 p-2 font-semibold text-amber-700"
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              className="border border-slate-200 p-2 text-slate-700"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>

                    {/* COPY & SHARE BUTTONS FOR AI MESSAGES */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 justify-end">
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition"
                        title="Copy message"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleShare(msg.text)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition"
                        title="Share message"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          ))}

          {/* AI TYPING INDICATOR */}
          {loading && (
            <div className="flex items-center gap-3 justify-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 sm:p-4 flex items-center gap-2 text-xs text-amber-600 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating response...</span>
              </div>
            </div>
          )}

          {/* NO POINTS WARNING BANNER */}
          {aiPoints === 0 && (
            <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-amber-700 font-bold text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4" /> Daily Points Limit Reached
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600">
                Aapke aaj ke 10 points complete ho gaye hain. Kal raat 12 baje
                aapke points auto-reset ho jayenge!
              </p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT PROMPT FOOTER */}
        <footer className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
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
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500/50 focus:bg-white rounded-2xl pl-4 pr-12 sm:pr-14 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition disabled:opacity-50 shadow-inner"
              />

              <button
                type="submit"
                disabled={loading || !prompt.trim() || aiPoints <= 0}
                className="absolute right-2 p-2 sm:p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed font-bold shadow-md cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </form>

            <p className="text-[9px] sm:text-[10px] text-center text-slate-400">
              1 Prompt = 1 AI Point. Daily 10 points auto-reset at midnight.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AiAssistantPage;