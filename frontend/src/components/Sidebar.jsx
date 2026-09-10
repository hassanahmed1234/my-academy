import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Search,
  FileText,
  ClipboardList,
  Calendar,
  Award,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();


  const handleLogout = async () => {
    await logout()
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen select-none">
      {/* 1. LOGO HEADER */}
      <NavLink
        to="/"
        className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
          🕌
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">AcademyPro</h1>
          <p className="text-[10px] text-amber-400 font-medium tracking-widest uppercase">Learning Hub</p>
        </div>
      </NavLink>

      {/* 2. NAVIGATION LINKS SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-none">

        {/* MAIN SECTION */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Main</p>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/my-courses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>My Courses</span>
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Browse Courses</span>
          </NavLink>
        </div>

        {/* LEARNING SECTION (DISABLED / COMING SOON) */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Learning</p>

          {/* Quizzes */}
          <NavLink
            to="/quizzes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Quizzes</span>
          </NavLink>


          {/* Assignments */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>Assignments</span>
            </div>
            <span className="bg-slate-800 text-amber-400/80 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Soon
            </span>
          </div>

          {/* Live Classes */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Live Classes</span>
            </div>
            <span className="bg-slate-800 text-amber-400/80 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Soon
            </span>
          </div>

          {/* Certificates */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 shrink-0" />
              <span>Certificates</span>
            </div>
            <span className="bg-slate-800 text-amber-400/80 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Soon
            </span>
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Account</p>



          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${isActive
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </NavLink>


        </div>

      </div>

      {/* 3. LOGOUT FOOTER BUTTON */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;