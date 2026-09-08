import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Menu, X, Sparkles, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const { user,logout} = useAuth();

  const handleLogout = () => {
    logout()
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black tracking-tight text-slate-100 group-hover:text-amber-400 transition">
                AcademyPro
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="block text-[10px] text-slate-400 tracking-widest uppercase font-medium">
              Islamic Learning
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-xs font-semibold tracking-wide transition ${
              isActive("/") ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Home
          </Link>
          <Link
            to="/courses"
            className={`text-xs font-semibold tracking-wide transition ${
              isActive("/courses") ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Courses
          </Link>
          <Link
            to="/about"
            className={`text-xs font-semibold tracking-wide transition ${
              isActive("/about") ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-xs font-semibold tracking-wide transition ${
              isActive("/contact") ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Contact
          </Link>

          {token ? (
            <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                className="bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-400 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-200 hover:text-amber-400 transition px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/10"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-slate-200 p-2"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-amber-400"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-amber-400"
          >
            Courses
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-amber-400"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-200 hover:text-amber-400"
          >
            Contact
          </Link>

          {token ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-amber-400"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm font-semibold text-red-400 pt-2 border-t border-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-xs font-semibold text-slate-200 bg-slate-950 rounded-xl border border-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-xs font-bold text-slate-950 bg-amber-500 rounded-xl"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;