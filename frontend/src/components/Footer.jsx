import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800  relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-600px h-200px bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-lg font-extrabold text-slate-100">AcademyPro</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering learners with authentic, structured Islamic knowledge through modern video courses and live sessions.
            </p>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seeking Knowledge is an Obligation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition">Browse Courses</Link></li>
              <li><Link to="/login" className="hover:text-amber-400 transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-amber-400 transition">Register Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Knowledge Tracks</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-amber-400 transition cursor-pointer">Seerah & History</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Tafseer-ul-Quran</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Tajweed & Recitation</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Islamic Jurisprudence (Fiqh)</span></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Stay Connected</h4>
            <p className="text-slate-400 text-xs">Get notified about new courses and live Q&A sessions.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 w-full"
              />
              <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AcademyPro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition cursor-pointer">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Authentic Content
            </span>
            <span className="flex items-center gap-1.5">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Ummah
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;