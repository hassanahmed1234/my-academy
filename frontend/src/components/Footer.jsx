import { Link } from "react-router-dom";
import { GraduationCap, Sparkles, Shield, Heart, ArrowRight, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-emerald-900/40 text-slate-300 overflow-hidden pt-16 pb-10">
      {/* Ambient Radial Lighting matching Hero/Navbar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/30">
          
          {/* Brand Info & Vision (4 cols) */}
          <div className="space-y-4 md:col-span-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/80 border border-amber-500/40 group-hover:border-amber-400 transition-colors shadow-inner">
                <GraduationCap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    E-Islam
                  </span>
                  <span className="text-amber-400 text-xs font-serif">◈</span>
                </div>
                <span className="text-[9px] font-bold text-amber-400/90 uppercase tracking-widest leading-none">
                  Islamic Academy
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering learners with authentic, structured Islamic knowledge through modern video courses, live sessions, and scholar guidance.
            </p>

            <div className="inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-800/50 px-3 py-1.5 rounded-full text-amber-400 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seeking Knowledge is an Obligation</span>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">Browse Courses</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Academy</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Knowledge Tracks (3 cols) */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Knowledge Tracks
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Seerah & Islamic History</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Tafseer-ul-Quran Track</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Tajweed & Recitation</span></li>
              <li><span className="hover:text-amber-400 transition-colors cursor-pointer">Islamic Jurisprudence (Fiqh)</span></li>
            </ul>
          </div>

          {/* Newsletter Box (3 cols) */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-amber-400">•</span> Stay Connected
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Subscribe for course releases, live Q&A sessions, and study updates.
            </p>
            <div className="flex items-center gap-2 bg-emerald-950/80 p-1.5 rounded-xl border border-emerald-800/50 focus-within:border-amber-400/80 transition-colors">
              <Mail className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
              />
              <Link to="/contact" className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-3 py-2 rounded-lg text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 shrink-0 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar matching Navbar Pill Aesthetics */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} E-Islam Academy. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Authentic Content
            </span>
            <span className="flex items-center gap-1.5">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the Ummah
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;