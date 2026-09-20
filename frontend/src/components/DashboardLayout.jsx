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
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-emerald-600 hover:bg-slate-100 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">
              Academy<span className="text-emerald-600">Pro</span>
            </span>
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