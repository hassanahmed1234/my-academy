import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Menu, X, Sparkles, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user, logout } = useAuth();

  // Scroll Detection Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`sticky z-50 transition-all duration-500 ${
        scrolled ? "top-2 px-3 sm:px-6" : "top-0 px-0"
      }`}
    >
      <nav
        className={`max-w-7xl mx-auto transition-all duration-500 ${
          scrolled
            ? "rounded-2xl bg-slate-950/80 backdrop-blur-2xl shadow-lg shadow-green/90 border border-slate-800/80 py-2.5 px-6"
            : "rounded-none md:rounded-2xl bg-slate-950/40 backdrop-blur-md border-b md:border border-slate-800/40 py-4 px-6 sm:px-8"
        }`}
      >
        <div className="flex justify-between items-center">

          {/* Brand Logo with Glow Animation */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 opacity-20 group-hover:opacity-75 blur transition duration-300"></div>
              <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:text-amber-400 transition">
                  E-Islam
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </div>
              <span className="block text-[9px] text-amber-500/80 tracking-widest uppercase font-bold">
                Islamic Learning platform
              </span>
            </div>
          </Link>

          {/* Floating Pill Desktop Navigation */}
          <div className="hidden md:flex items-center bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    active ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-lg shadow-amber-500/25 -z-10 transition-all duration-300"></span>
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <div className="flex items-center gap-3 pl-2">
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-950" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 rounded-xl transition-all duration-200 active:scale-95"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-amber-400 transition px-3 py-2 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-slate-100 p-2 bg-slate-900/60 rounded-xl border border-slate-800/80 transition active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Animated Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link.path)
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {token ? (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/10"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-semibold transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 rounded-xl border border-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-slate-950 bg-amber-500 rounded-xl shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;