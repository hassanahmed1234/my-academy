import { useState, useEffect, } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/axiosInstance";
import { Bot, Sparkles, Zap } from "lucide-react";

const AiAssistantButton = () => {
    const location = useLocation();

    // Agar current path AI assistant page ka hai to button show nahi hoga
    if (location.pathname === "/ai-assistant") {
        return null;
    }
    const [aiPoints, setAiPoints] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/ai/points");
            if (data.success) {
                setAiPoints(data.aiPoints);
            }
        } catch (err) {
            console.error("Failed to fetch AI points for floating button:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link
            to="/ai-assistant"
            className="fixed bottom-5 right-5 z-50 group transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
        >
            {/* AMBIENT GLOW */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-300 pointer-events-none" />

            {/* COMPACT GLASS CONTAINER */}
            <div className="relative flex items-center gap-2.5 bg-slate-950/85 hover:bg-slate-900/90 border border-amber-500/30 group-hover:border-amber-400/60 px-2.5 py-2 rounded-xl shadow-xl backdrop-blur-md overflow-hidden">

                {/* LIGHT SHEEN HOVER EFFECT */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                {/* ICON AVATAR */}
                <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 p-[1px] shadow-sm shadow-amber-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center relative overflow-hidden">
                            <Bot className="w-4 h-4 text-amber-400 group-hover:scale-105 transition-transform" />
                        </div>
                    </div>

                    {/* ONLINE INDICATOR */}
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-slate-950"></span>
                    </span>
                </div>

                {/* TEXT & COMPACT POINTS STATUS */}
                <div className="relative flex flex-col items-start leading-none gap-1">
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                            AI Assistant
                        </span>
                        <Sparkles className="w-2.5 h-2.5 text-amber-400 fill-amber-400/20" />
                    </div>

                    <div
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-bold tracking-tight ${aiPoints > 0
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            }`}
                    >
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        <span>{loading ? "..." : `${aiPoints}/10 Points`}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AiAssistantButton;