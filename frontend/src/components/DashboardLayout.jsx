import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR (Hidden on mobile, flex on large screens) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* 2. MOBILE SIDEBAR DRAWER (Conditional Rendering with Backdrop) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar Drawer Container */}
          <div className="relative z-10 w-64 h-full bg-slate-950 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
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
        <header className="lg:hidden h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-white text-sm">AcademyPro</span>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;