import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
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
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
    });
    AOS.refresh();
  }, []);

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
    {
      title: "Account",
      items: [{ label: "Profile Settings", path: "/profile", icon: User }],
    },
  ];

  // Track global index across sections for staggered animation delay
  let globalItemIndex = 0;

  return (
    <aside 
      data-aos="fade-right" 
      data-aos-duration="600" 
      className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen select-none"
    >
      {/* 1. BRAND HEADER */}
      <NavLink
        to="/"
        data-aos="fade-down"
        data-aos-delay="100"
        className="p-5 border-b border-slate-800/80 flex items-center gap-3.5 hover:bg-slate-900/60 transition duration-200"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-lg shrink-0">
          🕌
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-extrabold text-slate-100 tracking-wide truncate">
            E-Islam
          </h1>
          <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase truncate">
            Learning Hub
          </p>
        </div>
      </NavLink>

      {/* 2. NAVIGATION SECTIONS */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section, idx) => (
          <div 
            key={idx} 
            className="space-y-1"
            data-aos="fade-up"
            data-aos-delay={150 + idx * 100}
          >
            <p className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {section.title}
            </p>

            <div className="space-y-1 pt-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                globalItemIndex += 1;
                const itemDelay = 200 + globalItemIndex * 50;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold border transition-all duration-300 ease-out ${
                        isActive
                          ? item.isAi
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-950/50 font-bold"
                            : "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold border-emerald-400 shadow-md shadow-emerald-500/20"
                          : item.isAi
                          ? "bg-slate-900/80 text-emerald-400 border-emerald-500/20 hover:bg-emerald-950/40 hover:border-emerald-500/40 hover:text-emerald-300"
                          : "text-slate-400 border-transparent hover:bg-slate-900 hover:text-emerald-300 hover:border-slate-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <IconComponent
                            className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                              isActive && !item.isAi
                                ? "text-slate-950"
                                : isActive && item.isAi
                                ? "text-emerald-400"
                                : item.iconColor
                                ? item.iconColor
                                : "text-slate-400 group-hover:text-emerald-400"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 transition shadow-sm ${
                              isActive
                                ? "bg-emerald-900/60 text-emerald-200 border border-emerald-500/30"
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

      {/* 3. FOOTER LOGOUT */}
      <div 
        className="p-3.5 border-t border-slate-800/80 bg-slate-950"
        data-aos="fade-up"
        data-aos-delay="650"
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400/90 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-400 group-hover:text-rose-300" />
          <span>Logout Account</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;