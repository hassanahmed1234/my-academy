import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Search,
  FileText,
  ClipboardList,
  Compass,
  Video,
  Trophy,
  Bot,
  Sparkles,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Structured Navigation Config
  const navSections = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Browse Courses", path: "/courses", icon: Search },
      ],
    },
    {
      title: "Learning Hub",
      items: [
        { label: "My Courses", path: "/my-courses", icon: BookOpen },
        { label: "Quizzes", path: "/quizzes", icon: FileText },
        { label: "Assignments", path: "/assignments", icon: ClipboardList },
        { label: "Live Sessions", path: "/live-session", icon: Video },
        { label: "Manasik Academy", path: "/manasik", icon: Compass },
      ],
    },
    {
      title: "Community & AI",
      items: [
        { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
        {
          label: "AI Study Assistant",
          path: "/ai-assistant",
          icon: Bot,
          badge: "Live",
          isAi: true,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen select-none font-sans">
      
      {/* 1. BRAND HEADER (TOP) */}
      <NavLink
        to="/"
        className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between hover:bg-slate-900/40 transition duration-200 shrink-0"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-slate-950 font-black text-lg shrink-0">
            🕌
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black text-slate-100 tracking-wide leading-none truncate">
              E-Islam
            </h1>
            <p className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase mt-1 truncate">
              Learning Hub
            </p>
          </div>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </NavLink>

      {/* 2. LARGE CLICKABLE PROFILE CARD (BRAND LOGO KE BELOW) */}
      <div className="p-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 shrink-0">
        <NavLink
          to="/profile"
          className="group relative flex flex-col items-center p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300 text-center shadow-lg hover:shadow-emerald-950/20"
        >
          {/* Profile Picture with Glow Effect */}
          <div className="relative mb-3">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 group-hover:opacity-100 blur-sm transition duration-300"></div>
            <img
              src={
                user?.avatar ||
                user?.profilePicture ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              }
              alt="Profile"
              className="relative w-20 h-20 rounded-full object-cover border-2 border-emerald-400/80 shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-slate-950 rounded-full"></span>
            </div>
          </div>

          {/* User Details */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-1 text-slate-100 font-bold text-sm group-hover:text-emerald-300 transition-colors">
              <span className="truncate">{user?.name || "User Profile"}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5 px-2">
              {user?.email || "Click to manage account"}
            </p>
          </div>
        </NavLink>
      </div>

      {/* 3. NAVIGATION SECTIONS */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-none">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <p className="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                        isActive
                          ? item.isAi
                            ? "bg-emerald-950/80 text-emerald-200 border-emerald-500/50 shadow-md shadow-emerald-950/40 font-bold"
                            : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-extrabold border-emerald-400 shadow-md shadow-emerald-500/20"
                          : item.isAi
                          ? "bg-slate-900/60 text-emerald-400 border-emerald-500/20 hover:bg-emerald-950/40 hover:border-emerald-500/40 hover:text-emerald-300"
                          : "text-slate-400 border-transparent hover:bg-slate-900/80 hover:text-slate-200 hover:border-slate-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <IconComponent
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive && !item.isAi
                                ? "text-slate-950"
                                : isActive && item.isAi
                                ? "text-emerald-400"
                                : "text-slate-400 group-hover:text-emerald-400"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-sm ${
                              isActive
                                ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500/40"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20"
                            }`}
                          >
                            <Sparkles className="w-2.5 h-2.5" /> {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 4. FOOTER LOGOUT */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout Account</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;