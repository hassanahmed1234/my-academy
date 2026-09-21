import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/axiosInstance";
import { motion } from 'framer-motion';
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

    const constraintsRef = useRef(null);

    return (
        <>
            {/* Constraints boundary layer (Poori screen ko cover karega) */}
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                <motion.div
                    drag
                    dragConstraints={constraintsRef} // Screen constraints pass kiye hain
                    dragElastic={0.05} // Boundaries ke bahar stretch hone se rokega
                    dragMomentum={false} // Boundary ke bahar drag ko drop kar dega
                    whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                    className="fixed bottom-5 right-5 pointer-events-auto cursor-grab touch-none"
                >
                    <Link to="/ai-assistant" className="block group select-none">
                        {/* Outer Gradient Border Container */}
                        <div className="p-[2px] rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-yellow-400 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">

                            {/* Inner Content pill container */}
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full">

                                {/* Sparkles Icon */}
                                <div className="flex items-center justify-center text-slate-800">
                                    <Sparkles className="w-5 h-5 fill-slate-800" />
                                </div>

                                {/* AI Text */}
                                <span className="text-base font-bold text-slate-800 tracking-tight">
                                    AI Study Assistant
                                </span>

                               

                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </>
    );
};

export default AiAssistantButton;