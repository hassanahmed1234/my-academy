import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Menu, X, LayoutDashboard, User, Compass, Settings } from "lucide-react";
import AOS from "aos";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  // Auth Context se user aur isAuthenticated fetch kar rahe hain (localStorage ki jagah)
  const { user, isAuthenticated, logout } = useAuth();

  // Handle Scroll & AOS Refresh
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Refresh AOS on Route Change to prevent layout flickering
  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
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
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        scrolled ? "pt-2 px-3 sm:px-6" : "pt-0 px-0"
      }`}
    >
      <nav
        className={`max-w-7xl mx-auto transition-all duration-500 ease-in-out ${
          scrolled
            ? "rounded-2xl bg-emerald-950/90 backdrop-blur-xl shadow-2xl shadow-emerald-950/60 border border-emerald-800/60 py-2.5 px-5 sm:px-6"
            : "rounded-none md:rounded-2xl bg-slate-950/80 backdrop-blur-md border-b md:border border-emerald-900/40 py-3.5 px-5 sm:px-8"
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Islamic Brand Logo & Crest */}
          <Link
            to="/"
            data-aos="fade-right"
            data-aos-duration="600"
            data-aos-once="true"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              {/* Gold Aura Glow */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-500 opacity-30 group-hover:opacity-80 blur transition duration-500 group-hover:scale-110"></div>

              <div className="relative w-10 h-10 rounded-xl bg-emerald-950 border border-amber-500/40 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-400/80 transition-all duration-300 shadow-md">
                <GraduationCap className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300">
                  E-Islam
                </span>
                <span className="text-amber-400 text-xs tracking-wider font-serif group-hover:rotate-45 transition-transform duration-500 inline-block">
                  ◈
                </span>
              </div>
              <span className="block text-[9px] text-amber-400/90 tracking-widest uppercase font-semibold">
                Islamic Academy
              </span>
            </div>
          </Link>

          {/* Center Navigation - Staggered Pill Links */}
          <div
            data-aos="fade-down"
            data-aos-duration="600"
            data-aos-once="true"
            className="hidden md:flex items-center bg-emerald-950/60 p-1.5 rounded-full border border-emerald-800/40 backdrop-blur-md shadow-inner"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    active
                      ? "text-slate-950 font-extrabold shadow-sm"
                      : "text-emerald-100/70 hover:text-amber-300 hover:scale-105 active:scale-95"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-lg shadow-amber-500/25 -z-10 transition-all duration-300"></span>
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Actions / Profile Dropdown */}
          <div
            data-aos="fade-left"
            data-aos-duration="600"
            data-aos-once="true"
            className="hidden md:flex items-center gap-3"
          >
            {isAuthenticated ? (
              <div className="relative flex items-center gap-3 pl-2">
                {/* Profile Avatar Button */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-amber-500/50 transition-all duration-300 focus:outline-none"
                  >
                    {user?.profileImage || user?.avatar ? (
                      <img
                        src={user.profileImage || user.avatar}
                        alt={user?.name || "Profile"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/40 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm border border-amber-400">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn divide-y divide-slate-100">
                      {/* User Info Header */}
                      <div className="px-4 py-3">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "User Account"}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || "user@example.com"}</p>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-1">
                        <Link
                          to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-500" />
                          {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition"
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                          Profile Settings
                        </Link>
                      </div>

                      {/* Logout Action */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-medium text-emerald-100/80 hover:text-amber-300 transition-all duration-300 px-3 py-2 flex items-center gap-1.5 hover:scale-105"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" /> Sign In
                </Link>

                <Link
                  to="/register"
                  className="group relative overflow-hidden bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 shadow-md shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-400/30 active:scale-95 flex items-center gap-1.5"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 ease-out" />
                  <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                  <span>Enroll Now</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-emerald-200 p-2 bg-emerald-950/80 rounded-xl border border-emerald-800/60 transition-transform duration-200 active:scale-90 hover:border-amber-400/50"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-amber-400 rotate-90 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[420px] opacity-100 mt-4 pt-4 border-t border-emerald-800/50" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-inner"
                    : "text-emerald-100/80 hover:bg-emerald-900/40 hover:pl-6"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="pt-3 border-t border-emerald-800/50 space-y-2">
                <div className="px-4 py-2 bg-emerald-900/30 rounded-xl border border-emerald-800/40 flex items-center gap-3">
                  {user?.profileImage || user?.avatar ? (
                    <img
                      src={user.profileImage || user.avatar}
                      alt={user?.name || "Profile"}
                      className="w-8 h-8 rounded-full object-cover border border-amber-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user?.name || "User Account"}</p>
                    <p className="text-[10px] text-emerald-300/80 truncate">{user?.email || ""}</p>
                  </div>
                </div>

                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full py-2.5 px-4 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-100 rounded-xl text-xs font-semibold transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full py-2.5 px-4 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-100 rounded-xl text-xs font-semibold transition"
                >
                  <Settings className="w-4 h-4 text-slate-300" />
                  Profile Settings
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-emerald-800/50 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-medium text-emerald-100 bg-emerald-950 rounded-xl border border-emerald-800/60 active:scale-95 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-extrabold text-slate-950 bg-amber-400 rounded-xl shadow-md active:scale-95 transition-all duration-200"
                >
                  Enroll Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;