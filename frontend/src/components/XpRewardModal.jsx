import { useEffect, useState } from "react";
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  Award,
  Calendar,
  Zap,
  Flame,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axiosInstance";

const XpRewardModal = ({
  isOpen,
  onClose,
  xpAmount: propXpAmount,
  reason: propReason = "lesson_completed",
  totalXp: propTotalXp,
  heading: propHeading = "MashaAllah! 🎉",
  courseId,
}) => {
  const { dashboardData, fetchDashboardData } = useAuth();
  const [liveXpData, setLiveXpData] = useState(null);
  const [fetching, setFetching] = useState(false);

  // Backend Real Data Sync Logic
  useEffect(() => {
    if (!isOpen) return;

    const syncLiveProgress = async () => {
      setFetching(true);
      try {
        // Option 1: Direct Progress API Endpoint Trigger
        const res = await API.get("/my-progress/all");
        const progressList = res.data?.data || res.data || [];
        
        let targetProgress = null;
        if (courseId && Array.isArray(progressList)) {
          targetProgress = progressList.find(
            (p) => String(p.courseId?._id || p.courseId || p.course?._id || p.course) === String(courseId)
          );
        }

        // Fallback to primary active item in array response
        const activeRecord = targetProgress || progressList[0] || {};
        const courseData = activeRecord.course || activeRecord;

        setLiveXpData({
          totalXp: courseData.xp ?? 400,
          streak: courseData.streak ?? 1,
        });

        // Trigger context refresh simultaneously
        fetchDashboardData(true);
      } catch (error) {
        console.error("Failed to fetch reward progress:", error);
      } finally {
        setFetching(false);
      }
    };

    syncLiveProgress();
  }, [isOpen, courseId, fetchDashboardData]);

  if (!isOpen) return null;

  // Real backend calculations with fallback to context/props
  const primaryDashboardRecord = dashboardData?.completedCourses?.[0] || {};
  const currentTotalXp =
    propTotalXp ??
    liveXpData?.totalXp ??
    primaryDashboardRecord?.course?.xp ??
    primaryDashboardRecord?.xp ??
    400;

  const currentXpEarned = propXpAmount ?? 50;
  const currentStreak = liveXpData?.streak ?? primaryDashboardRecord?.course?.streak ?? 1;

  // Dynamic Reason Configuration Mapping
  const getReasonConfig = (reasonKey) => {
    switch (reasonKey) {
      case "quiz_completed":
        return {
          label: "Quiz Completed",
          icon: HelpCircle,
          color: "text-amber-600 bg-amber-50 border-amber-200",
        };
      case "assignment_submitted":
        return {
          label: "Assignment Submitted",
          icon: FileText,
          color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        };
      case "course_completed":
        return {
          label: "Course Completed",
          icon: Award,
          color: "text-purple-600 bg-purple-50 border-purple-200",
        };
      case "daily_learning":
        return {
          label: "Daily Learning Streak",
          icon: Calendar,
          color: "text-blue-600 bg-blue-50 border-blue-200",
        };
      case "perfect_quiz":
        return {
          label: "Perfect Quiz Score",
          icon: Zap,
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        };
      case "streak_bonus":
        return {
          label: `Streak Bonus (${currentStreak} Days)`,
          icon: Flame,
          color: "text-rose-600 bg-rose-50 border-rose-200",
        };
      case "lesson_completed":
      default:
        return {
          label: "Lesson Completed",
          icon: BookOpen,
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        };
    }
  };

  const reasonConfig = getReasonConfig(propReason);
  const ReasonIcon = reasonConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 overflow-hidden">
        
        {/* Glowing Background Radial Overlay */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. TOP ANIMATED ICON & SPARKLES */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 animate-pulse opacity-20" />
          
          <div className="relative bg-gradient-to-tr from-amber-500 to-amber-300 text-white rounded-2xl p-4 shadow-lg shadow-amber-500/30 transform -rotate-3 hover:rotate-0 transition">
            <Sparkles className="w-9 h-9 animate-bounce" />
          </div>

          <span className="absolute -top-1 -right-1 text-base animate-ping">✨</span>
          <span className="absolute -bottom-1 -left-1 text-base">⭐</span>
        </div>

        {/* 2. DYNAMIC HEADING & SUBTITLE */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {propHeading}
          </h3>
          <p className="text-xs text-slate-500 font-medium">Keep up the great work!</p>
        </div>

        {/* 3. XP REWARD DISPLAY */}
        <div className="py-2">
          <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 tracking-tight drop-shadow-sm">
            +{currentXpEarned} XP
          </span>
        </div>

        {/* 4. REASON BADGE */}
        <div className="flex justify-center">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${reasonConfig.color}`}
          >
            <ReasonIcon className="w-4 h-4 shrink-0" />
            <span>{reasonConfig.label}</span>
          </div>
        </div>

        {/* 5. LIVE TOTAL XP BALANCE FROM BACKEND */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Total Balance
          </span>
          <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-1.5">
            {fetching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
            ) : (
              `${currentTotalXp.toLocaleString()} XP`
            )}
          </span>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs tracking-wider uppercase transition shadow-md active:scale-[0.98] cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default XpRewardModal;