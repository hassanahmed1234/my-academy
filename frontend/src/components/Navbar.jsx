import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Menu, X, Sparkles, LayoutDashboard, User, Compass } from "lucide-react";
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
    { name: "About Us", path: "/about" },
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
            ? "rounded-2xl bg-emerald-950/85 backdrop-blur-2xl shadow-xl shadow-emerald-950/40 border border-emerald-800/50 py-2.5 px-5 sm:px-6"
            : "rounded-none md:rounded-2xl bg-slate-950/80 backdrop-blur-md border-b md:border border-emerald-900/40 py-3.5 px-5 sm:px-8"
        }`}
      >
        <div className="flex justify-between items-center">

          {/* Islamic Brand Logo & Crest */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Subtle Gold Aura Glow */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-500 opacity-20 group-hover:opacity-60 blur transition duration-300"></div>
              
              <div className="relative w-10 h-10 rounded-xl bg-emerald-950 border border-amber-500/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                <GraduationCap className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition">
                  E-Islam
                </span>
                <span className="text-amber-400 text-xs tracking-wider font-serif">◈</span>
              </div>
              <span className="block text-[9px] text-amber-400/90 tracking-widest uppercase font-semibold">
                Islamic Academy
              </span>
            </div>
          </Link>

          {/* Center Navigation - Deep Islamic Pill Styling */}
          <div className="hidden md:flex items-center bg-emerald-950/60 p-1.5 rounded-full border border-emerald-800/40 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    active ? "text-slate-950 font-extrabold" : "text-emerald-100/70 hover:text-amber-300"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg shadow-amber-500/20 -z-10 transition-all duration-300"></span>
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3 pl-2">
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-950" />
                  <span>Student Portal</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 text-emerald-200/60 hover:text-red-400 hover:bg-red-500/10 border border-emerald-900/60 hover:border-red-500/30 rounded-xl transition-all duration-200 active:scale-95"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-medium text-emerald-100/80 hover:text-amber-300 transition px-3 py-2 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" /> Sign In
                </Link>
                
                {/* Updated CTA Button */}
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Enroll Now</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-emerald-200 p-2 bg-emerald-950/80 rounded-xl border border-emerald-800/60 transition active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-emerald-800/50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive(link.path)
                    ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                    : "text-emerald-100/80 hover:bg-emerald-900/40"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {token ? (
              <div className="pt-3 border-t border-emerald-800/50 space-y-2">
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-md shadow-amber-400/20"
                >
                  <LayoutDashboard className="w-4 h-4" /> Student Portal
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
              <div className="pt-3 border-t border-emerald-800/50 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-medium text-emerald-100 bg-emerald-950 rounded-xl border border-emerald-800/60"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-extrabold text-slate-950 bg-amber-400 rounded-xl shadow-md"
                >
                  Enroll Now
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