import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import API from "../api/axiosInstance";
import {
  Trophy,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  Zap,
  Sparkles,
  Search,
  Star,
  Info,
  Loader2,
  Share2,
  Download,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";

const XP_RULES = [
  { action: "Lesson Completed", xp: "+10 XP", icon: BookOpen },
  { action: "Quiz Passed", xp: "+20 XP", icon: CheckCircle2 },
  { action: "Assignment Submitted", xp: "+15 XP", icon: Zap },
  { action: "Excellent Grade", xp: "+30 XP", icon: Star },
  { action: "Course Completed", xp: "+100 XP", icon: Trophy },
  { action: "Daily Learning Streak", xp: "+5 XP", icon: Flame },
];

const StudentAvatar = memo(({ student, size = "w-10 h-10", textSize = "text-sm" }) => {
  const avatarUrl = student?.avatar || student?.profilePic;
  const studentName = student?.name || "Student";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={studentName}
        className={`${size} rounded-full object-cover border-2 border-amber-400/60 shadow-sm shrink-0`}
        loading="lazy"
        crossOrigin="anonymous"
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-700 ${textSize} uppercase shrink-0 shadow-sm`}
    >
      {studentName.charAt(0)}
    </div>
  );
});

StudentAvatar.displayName = "StudentAvatar";

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState("overall");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXpModal, setShowXpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Share Modal & Image Generation States
  const [shareData, setShareData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null);

  const fetchLeaderboard = useCallback(async (signal) => {
    try {
      setLoading(true);
      const res = await API.get(`/leaderboard/list?timeFrame=${timeFilter}`, { signal });
      setLeaderboardData(res.data?.leaderboard || []);
      setUserStats(res.data?.currentUserStats || null);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Error fetching leaderboard:", err);
        setLeaderboardData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => {
    const controller = new AbortController();
    fetchLeaderboard(controller.signal);
    return () => controller.abort();
  }, [fetchLeaderboard]);

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboardData].sort((a, b) => {
      if ((b.xp || 0) !== (a.xp || 0)) return (b.xp || 0) - (a.xp || 0);
      if ((b.coursesCompleted || 0) !== (a.coursesCompleted || 0)) return (b.coursesCompleted || 0) - (a.coursesCompleted || 0);
      if ((b.quizzesPassed || 0) !== (a.quizzesPassed || 0)) return (b.quizzesPassed || 0) - (a.quizzesPassed || 0);
      return (b.streak || 0) - (a.streak || 0);
    });
  }, [leaderboardData]);

  const query = searchTerm.trim().toLowerCase();
  const top3 = query ? [] : sortedLeaderboard.slice(0, 3);
  const filteredList = query
    ? sortedLeaderboard.filter((s) => s.student?.name?.toLowerCase().includes(query))
    : sortedLeaderboard.slice(3);

  // Download Story Image Handler
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `${shareData?.student?.name || "rank"}-achievement.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Image generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Web Share API Handler (Mobile Devices ke liye)
  const handleNativeShare = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "achievement.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Learning Achievement",
          text: `I'm #${shareData.rank} on the Islamic Learning Leaderboard! 🌟`,
        });
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 text-slate-800 bg-slate-50/50 max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-amber-100 border border-amber-200 rounded-2xl text-amber-600 shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Learning Leaderboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">
            “Learn more. Improve more. Inspire others.” — A friendly space to keep your learning consistent.
          </p>
        </div>

        {userStats && (
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <Trophy className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Rank</span>
                <span className="font-bold text-slate-900">#{userStats.rank || "-"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <Zap className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">XP Points</span>
                <span className="font-bold text-slate-900">{userStats.xp || 0} XP</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <Flame className="w-4 h-4 text-orange-500" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Streak</span>
                <span className="font-bold text-orange-600">{userStats.streak || 0} Days</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FILTERS & XP RULES */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-200 text-xs w-full sm:w-auto">
          {["overall", "this_week", "this_month"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeFilter(tab)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold capitalize transition ${timeFilter === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowXpModal((prev) => !prev)}
          className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-3.5 py-2 rounded-xl border border-amber-200 flex items-center gap-1.5 transition w-full sm:w-auto justify-center shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> How to earn XP?
        </button>
      </div>

      {/* XP RULES COLLAPSIBLE PANEL */}
      {showXpModal && (
        <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500" /> Gamification & XP System Rules
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {XP_RULES.map((rule, idx) => {
              const IconComp = rule.icon;
              return (
                <div key={idx} className="bg-amber-50/40 p-3 rounded-xl border border-amber-100 text-center space-y-1">
                  <IconComp className="w-5 h-5 mx-auto text-amber-600" />
                  <p className="text-[11px] font-semibold text-slate-700">{rule.action}</p>
                  <span className="text-xs font-extrabold text-amber-600 block">{rule.xp}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="min-h-300px flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* PODIUM (TOP 3) */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
              {/* RANK #2 */}
              {top3[1] && (
                <div className="order-2 md:order-1 bg-white border border-slate-200 rounded-3xl p-5 text-center relative overflow-hidden flex flex-col items-center shadow-sm hover:shadow-md transition">
                  <div className="absolute top-0 right-0 bg-slate-100 text-slate-700 font-extrabold text-xs px-3 py-1 rounded-bl-xl border-l border-b border-slate-200">
                    🥈 #2
                  </div>
                  <div className="mt-4">
                    <StudentAvatar student={top3[1].student} size="w-16 h-16" textSize="text-xl" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-3">{top3[1].student?.name || "Student"}</h3>

                  {/* XP BADGE */}
                  <div className="flex items-center justify-center gap-1 mt-1 text-slate-900 font-black text-lg">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> {top3[1].xp || 0} <span className="text-xs text-slate-400">XP</span>
                  </div>

                  {/* COURSES & QUIZZES STATS */}
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600 w-full">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      📚 {top3[1].coursesCompleted || 0} Courses
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      🎯 {top3[1].quizzesPassed || 0} Quizzes
                    </span>
                  </div>

                  <button
                    onClick={() => setShareData({ ...top3[1], rank: 2 })}
                    className="mt-3 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Rank
                  </button>
                </div>
              )}

              {/* RANK #1 */}
              {top3[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-white to-white border-2 border-amber-400 rounded-3xl p-6 text-center relative overflow-hidden shadow-lg transform md:-translate-y-3 flex flex-col items-center">
                  <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-bl-xl shadow-sm">
                    🥇 #1 CHAMPION
                  </div>
                  <div className="mt-4">
                    <StudentAvatar student={top3[0].student} size="w-20 h-20" textSize="text-2xl" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-3">{top3[0].student?.name || "Student"}</h3>

                  {/* XP BADGE */}
                  <div className="flex items-center justify-center gap-1 mt-1 text-slate-900 font-black text-2xl">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" /> {top3[0].xp || 0} <span className="text-xs text-slate-400">XP</span>
                  </div>

                  {/* COURSES & QUIZZES STATS */}
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-amber-100 text-[11px] font-semibold text-slate-600 w-full">
                    <span className="flex items-center gap-1 bg-amber-50/80 px-2.5 py-0.5 rounded-lg border border-amber-200/60 text-amber-900">
                      📚 {top3[0].coursesCompleted || 0} Courses
                    </span>
                    <span className="flex items-center gap-1 bg-amber-50/80 px-2.5 py-0.5 rounded-lg border border-amber-200/60 text-amber-900">
                      🎯 {top3[0].quizzesPassed || 0} Quizzes
                    </span>
                  </div>

                  <button
                    onClick={() => setShareData({ ...top3[0], rank: 1 })}
                    className="mt-3 text-[11px] font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 px-4 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Rank
                  </button>
                </div>
              )}

              {/* RANK #3 */}
              {top3[2] && (
                <div className="order-3 bg-white border border-slate-200 rounded-3xl p-5 text-center relative overflow-hidden flex flex-col items-center shadow-sm hover:shadow-md transition">
                  <div className="absolute top-0 right-0 bg-amber-50 text-amber-700 font-extrabold text-xs px-3 py-1 rounded-bl-xl border-l border-b border-amber-200">
                    🥉 #3
                  </div>
                  <div className="mt-4">
                    <StudentAvatar student={top3[2].student} size="w-16 h-16" textSize="text-xl" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-3">{top3[2].student?.name || "Student"}</h3>

                  {/* XP BADGE */}
                  <div className="flex items-center justify-center gap-1 mt-1 text-slate-900 font-black text-lg">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> {top3[2].xp || 0} <span className="text-xs text-slate-400">XP</span>
                  </div>

                  {/* COURSES & QUIZZES STATS */}
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600 w-full">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      📚 {top3[2].coursesCompleted || 0} Courses
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      🎯 {top3[2].quizzesPassed || 0} Quizzes
                    </span>
                  </div>

                  <button
                    onClick={() => setShareData({ ...top3[2], rank: 3 })}
                    className="mt-3 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Rank
                  </button>
                </div>
              )}
            </div>
          )}

          {/* RANKING TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Complete Ranks
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-amber-400 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4 w-16 text-center">Rank</th>
                    <th className="p-4">Student</th>
                    <th className="p-4 text-center">Streak</th>
                    <th className="p-4 text-center">Courses</th>
                    <th className="p-4 text-center">Quizzes</th>
                    <th className="p-4 text-right">XP Points</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length > 0 ? (
                    filteredList.map((item, index) => {
                      const actualRank = item.rank || (query ? sortedLeaderboard.findIndex((l) => l._id === item._id) + 1 : index + 4);
                      return (
                        <tr key={item._id || index} className="hover:bg-amber-50/30 transition">
                          <td className="p-4 text-center font-extrabold text-slate-400">
                            #{actualRank}
                          </td>
                          <td className="p-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-3">
                              <StudentAvatar student={item.student} size="w-8 h-8" textSize="text-xs" />
                              <span>{item.student?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-1 text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                              <Flame className="w-3 h-3 text-orange-500" /> {item.streak || 0}d
                            </span>
                          </td>
                          <td className="p-4 text-center font-medium text-slate-700">{item.coursesCompleted || 0}</td>
                          <td className="p-4 text-center text-slate-500">{item.quizzesPassed || 0}</td>
                          <td className="p-4 text-right font-black text-slate-900">
                            {item.xp || 0} <span className="text-[10px] font-normal text-slate-400">XP</span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setShareData({ ...item, rank: actualRank })}
                              className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 rounded-lg transition"
                              title="Share Rank"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-slate-400">
                        No leaderboard records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* STICKY BOTTOM BAR */}
      {userStats && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl bg-white/95 border border-amber-300 rounded-2xl p-4 shadow-xl backdrop-blur-md z-40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black text-sm px-3 py-2 rounded-xl flex flex-col items-center leading-none shadow-sm">
              <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80">Rank</span>
              #{userStats.rank || "-"}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Your Current Standing</p>
              <p className="text-xs text-slate-500">Keep completing courses and quizzes to boost your rank!</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <button
              onClick={() => setShareData(userStats)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Share2 className="w-4 h-4" /> Share My Rank
            </button>
          </div>
        </div>
      )}

      {/* SHARE ACHIEVEMENT MODAL */}
      {shareData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShareData(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 text-center">Share Achievement</h3>

            {/* INSTAGRAM STORY CARD DESIGN TO BE CAPTURED */}
            <div
              ref={cardRef}
              className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl flex flex-col items-center text-center space-y-4 border border-amber-500/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs tracking-widest uppercase">
                <Trophy className="w-4 h-4" /> E-Islam
              </div>

              <div className="py-2">
                <StudentAvatar student={shareData.student} size="w-20 h-20" textSize="text-2xl" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-amber-100">{shareData.student?.name || "Student"}</h4>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  I'm #{shareData.rank || "1"} on the Leaderboard!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-amber-500/20 text-center">
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <BookOpen className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                  <span className="text-xs font-bold block">{shareData.coursesCompleted || 0}</span>
                  <span className="text-[9px] text-slate-400">Lessons</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <Star className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                  <span className="text-xs font-bold block">{shareData.xp || 0}</span>
                  <span className="text-[9px] text-slate-400">XP</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <Flame className="w-4 h-4 mx-auto text-orange-400 mb-1" />
                  <span className="text-xs font-bold block">{shareData.streak || 0} Days</span>
                  <span className="text-[9px] text-slate-400">Streak</span>
                </div>
              </div>

              <p className="text-[11px] text-amber-200/70 italic pt-1">
                "Learning Deen, One Day at a Time."
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download Image
              </button>
              <button
                onClick={handleNativeShare}
                disabled={isDownloading}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                Share Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;