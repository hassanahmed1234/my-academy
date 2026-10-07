import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/axiosInstance";
import { motion } from 'framer-motion';
import { Sparkles } from "lucide-react";

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
            {/* Constraints boundary layer */}
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                <motion.div
                    drag
                    dragConstraints={constraintsRef}
                    dragElastic={0.05}
                    dragMomentum={false}
                    whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                    className="fixed bottom-8 right-5 pointer-events-auto cursor-grab touch-none"
                >
                    <Link to="/ai-assistant" className="block group select-none">
                        {/* Outer Gradient Border Container */}
                        <div className="p-[2px] rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-yellow-400 shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">

                            {/* Inner Content container with Framer Motion hover effect */}
                            <motion.div 
                                initial="collapsed"
                                whileHover="expanded"
                                className="flex items-center bg-white py-3 px-3 rounded-full overflow-hidden whitespace-nowrap"
                            >
                                {/* Sparkles Icon (Always Visible) */}
                                <div className="flex items-center justify-center text-slate-800 shrink-0">
                                    <Sparkles className="w-5 h-5 fill-slate-800" />
                                </div>

                                {/* Expanding AI Text */}
                                <motion.span
                                    variants={{
                                        collapsed: { width: 0, opacity: 0, marginLeft: 0 },
                                        expanded: { width: "auto", opacity: 1, marginLeft: 8 }
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="text-sm font-bold text-slate-800 tracking-tight overflow-hidden inline-block"
                                >
                                    AI Study Assistant
                                </motion.span>
                            </motion.div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </>
    );
};

export default AiAssistantButton;