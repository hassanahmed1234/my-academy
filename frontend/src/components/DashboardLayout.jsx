import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans overflow-hidden">

      {/* 1. DESKTOP SIDEBAR (Hidden on mobile, flex on large screens) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* 2. MOBILE SIDEBAR DRAWER (Conditional Rendering with Backdrop) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar Drawer Container */}
          <div className="relative z-10 w-64 h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Mobile Header with Hamburger Trigger */}
        <header className="lg:hidden h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 shadow-lg sticky top-0 z-30">
          <div className="flex items-center gap-3.5">
            {/* Menu Button with subtle border and focus effect */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-slate-600 transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo with Premium Styling */}
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight flex items-center">
                E-
                <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent font-black ml-0.5">
                  Islam
                </span>
              </span>
            </div>
          </div>

        
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto  bg-slate-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;