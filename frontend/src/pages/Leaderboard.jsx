import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
    Trophy,
    Flame,
    Award,
    BookOpen,
    CheckCircle2,
    Zap,
    ChevronRight,
    Sparkles,
    Search,
    Star,
    Info,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const XP_RULES = [
    { action: "Lesson Completed", xp: "+10 XP", icon: BookOpen },
    { action: "Quiz Passed", xp: "+20 XP", icon: CheckCircle2 },
    { action: "Assignment Submitted", xp: "+15 XP", icon: Zap },
    { action: "Excellent Grade", xp: "+30 XP", icon: Star },
    { action: "Course Completed", xp: "+100 XP", icon: Trophy },
    { action: "Daily Learning Streak", xp: "+5 XP", icon: Flame },
];

const Leaderboard = () => {
    const [timeFilter, setTimeFilter] = useState("overall");
    const [leaderboard, setLeaderboard] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showXpModal, setShowXpModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); // 2. Hook initialize karein

    useEffect(() => {
        fetchLeaderboard();
    }, [timeFilter]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/leaderboard/list?timeFrame=${timeFilter}`);
            setLeaderboard(res.data.leaderboard);
            setUserStats(res.data.currentUserStats);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        } finally {
            setLoading(false);
        }
    };

    const top3 = leaderboard.slice(0, 3);
    const fullList = leaderboard.slice(3);


    return (
        <div className="min-h-screen pb-28 text-slate-200 max-w-6xl mx-auto p-4 md:p-6 space-y-8">
            {/* 1. TOP HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white">
                            Learning Leaderboard
                        </h1>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 italic">
                        “Learn more. Improve more. Inspire others.” — A friendly space to keep your learning consistent.
                    </p>
                </div>

                {/* Header Quick Stats */}
                {userStats && (
                    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <div>
                                <span className="text-[10px] text-slate-500 block leading-none">Rank</span>
                                <span className="font-bold text-amber-400">#{userStats.rank}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <div>
                                <span className="text-[10px] text-slate-500 block leading-none">XP Points</span>
                                <span className="font-bold text-white">{userStats.xp} XP</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <div>
                                <span className="text-[10px] text-slate-500 block leading-none">Streak</span>
                                <span className="font-bold text-orange-400">{userStats.streak} Days</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. FILTERS & XP RULES */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
                    {["overall", "this_week", "this_month"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setTimeFilter(tab)}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold capitalize transition ${timeFilter === tab
                                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            {tab.replace("_", " ")}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowXpModal(!showXpModal)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3.5 py-2 rounded-xl border border-amber-500/20 flex items-center gap-1.5 transition w-full sm:w-auto justify-center"
                >
                    <Sparkles className="w-4 h-4" /> How to earn XP?
                </button>
            </div>

            {/* XP RULES COLLAPSIBLE PANEL */}
            {showXpModal && (
                <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl backdrop-blur-md space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                            <Info className="w-4 h-4" /> Gamification & XP System Rules
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {XP_RULES.map((rule, idx) => {
                            const IconComp = rule.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1"
                                >
                                    <IconComp className="w-5 h-5 mx-auto text-amber-400" />
                                    <p className="text-[11px] font-semibold text-slate-300">{rule.action}</p>
                                    <span className="text-xs font-bold text-amber-400 block">{rule.xp}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
            ) : (
                <>
                    {/* 3. PODIUM (TOP 3 STUDENTS) */}
                    {top3.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
                            {/* RANK #2 */}
                            {top3[1] && (
                                <div className="order-2 md:order-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-slate-800 text-slate-300 font-extrabold text-xs px-3 py-1 rounded-bl-xl border-l border-b border-slate-700">
                                        🥈 #2
                                    </div>
                                    <h3 className="font-bold text-white text-base mt-6">{top3[1].student?.name}</h3>
                                    <div className="flex items-center justify-center gap-1 mt-1 text-amber-400 font-black text-lg">
                                        <Zap className="w-4 h-4 fill-amber-400" /> {top3[1].xp} <span className="text-xs text-slate-400">XP</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                                        <div><span className="block font-bold text-slate-200">{top3[1].coursesCompleted}</span> Courses</div>
                                        <div className="flex items-center justify-center gap-0.5 font-semibold text-orange-400">
                                            <Flame className="w-3.5 h-3.5" /> {top3[1].streak}d Streak
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RANK #1 */}
                            {top3[0] && (
                                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 text-center relative overflow-hidden shadow-xl transform md:-translate-y-3">
                                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1 rounded-bl-xl">
                                        🥇 #1 CHAMPION
                                    </div>
                                    <h3 className="font-extrabold text-white text-lg mt-6">{top3[0].student?.name}</h3>
                                    <div className="flex items-center justify-center gap-1 mt-1 text-amber-400 font-black text-2xl">
                                        <Zap className="w-5 h-5 fill-amber-400" /> {top3[0].xp} <span className="text-xs text-slate-400">XP</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                                        <div><span className="block font-bold text-slate-200">{top3[0].coursesCompleted}</span> Courses Done</div>
                                        <div className="flex items-center justify-center gap-0.5 font-semibold text-orange-400">
                                            <Flame className="w-3.5 h-3.5" /> {top3[0].streak}d Streak
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* RANK #3 */}
                            {top3[2] && (
                                <div className="order-3 bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-slate-800 text-amber-600 font-extrabold text-xs px-3 py-1 rounded-bl-xl border-l border-b border-slate-700">
                                        🥉 #3
                                    </div>
                                    <h3 className="font-bold text-white text-base mt-6">{top3[2].student?.name}</h3>
                                    <div className="flex items-center justify-center gap-1 mt-1 text-amber-400 font-black text-lg">
                                        <Zap className="w-4 h-4 fill-amber-400" /> {top3[2].xp} <span className="text-xs text-slate-400">XP</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                                        <div><span className="block font-bold text-slate-200">{top3[2].coursesCompleted}</span> Courses</div>
                                        <div className="flex items-center justify-center gap-0.5 font-semibold text-orange-400">
                                            <Flame className="w-3.5 h-3.5" /> {top3[2].streak}d Streak
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. RANKING TABLE */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-400" /> Complete Ranks
                            </h3>
                            <div className="relative w-full sm:w-64">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="p-4 w-16 text-center">Rank</th>
                                        <th className="p-4">Student</th>
                                        <th className="p-4 text-center">Streak</th>
                                        <th className="p-4 text-center">Courses</th>
                                        <th className="p-4 text-center">Quizzes</th>
                                        <th className="p-4 text-right">XP Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {fullList
                                        .filter((s) =>
                                            s.student?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((item, index) => (
                                            <tr key={item._id} className="hover:bg-slate-800/40 transition">
                                                <td className="p-4 text-center font-extrabold text-slate-400">
                                                    #{index + 4}
                                                </td>
                                                <td className="p-4 font-semibold text-slate-100">
                                                    {item.student?.name}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center gap-1 text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                                                        <Flame className="w-3 h-3" /> {item.streak}d
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center font-medium">{item.coursesCompleted}</td>
                                                <td className="p-4 text-center text-slate-400">{item.quizzesPassed}</td>
                                                <td className="p-4 text-right font-black text-amber-400">
                                                    {item.xp} <span className="text-[10px] text-slate-500">XP</span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* 5. STICKY BOTTOM BAR */}
            {userStats && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="bg-amber-500 text-slate-950 font-black text-sm px-3 py-2 rounded-xl flex flex-col items-center leading-none">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80">Rank</span>
                            #{userStats.rank}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-sm">Your Status</h4>
                                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                                    {userStats.xp} XP
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                                <span>📚 {userStats.courses} Courses</span>
                                <span className="text-orange-400 flex items-center gap-0.5">
                                    <Flame className="w-3 h-3" /> {userStats.streak} Day Streak
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                        
                        <button
                            onClick={() => navigate("/courses")}
                            className="px-3.5 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition flex items-center gap-1 shadow-lg shadow-amber-500/20 cursor-pointer"
                        >
                            Keep Learning <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;