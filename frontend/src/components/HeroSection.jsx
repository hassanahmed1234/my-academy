import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Tajweed & Recitation',
    title: 'Master Quranic Pronunciation with Precision',
    description: 'Learn the exact points of articulation (Makharij) and characteristics of Arabic letters with verified scholars.',
    highlight: '80% Practical Exercises',
    ctaText: 'Start Tajweed Course',
    targetRoute: '/courses',
  },
  {
    id: 2,
    tag: 'Tafseer & Understanding',
    title: 'Connect Deeply with the Wisdom of the Quran',
    description: 'Explore line-by-line verse explanations, context of revelation, and real-life spiritual applications.',
    highlight: 'Weekly Q&A Webinars',
    ctaText: 'Explore Tafseer Series',
    targetRoute: '/courses',
  },
  {
    id: 3,
    tag: 'Memorization (Hifz)',
    title: 'Structured Hifz Track with Daily Revisions',
    description: 'A proven step-by-step memorization pathway designed for busy adults and young learners alike.',
    highlight: '1-on-1 Guidance Support',
    ctaText: 'Join Hifz Program',
    targetRoute: '/courses',
  },
];

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setIsFading(false);
      }, 300);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (idx) => {
    if (idx === currentSlide) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsFading(false);
    }, 300);
  };

  const handleStartLearning = (targetRoute) => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { redirectTo: targetRoute } });
    }
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-300/20 blur-[130px] rounded-full pointer-events-none animate-pulse duration-1000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 text-center lg:text-left" data-aos="fade-right" data-aos-duration="1000">

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Interactive Islamic Academy Platform</span>
            </div>

            {/* Dynamic Slider Content */}
            <div className={`min-h-[220px] transition-all duration-300 transform ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest block mb-2">
                {activeSlide.tag}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {activeSlide.title}
              </h1>

              <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {activeSlide.description}
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-center lg:justify-start gap-2 my-6">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleSlideChange(idx)}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${currentSlide === idx ? 'w-10 bg-emerald-600 shadow-md shadow-emerald-500/30' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
              <button
                onClick={() => handleStartLearning(activeSlide.targetRoute)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isAuthenticated ? 'Go to Classroom' : activeSlide.ctaText}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <Link
                to="/courses"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm text-center transition-all shadow-sm"
              >
                Browse All Courses
              </Link>
            </div>

            {/* Highlights Bar */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Self-Paced & Live Tracks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Certified Scholars</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Animated Islamic Illustration Frame */}
          <div className="lg:col-span-5 flex justify-center items-center" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200">
            <div className="relative w-full max-w-sm sm:max-w-md">

              {/* Ambient Glow behind image */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-emerald-500/20 rounded-t-[190px] rounded-b-3xl blur-xl opacity-75 animate-pulse" />

              {/* Outer Arch Frame */}
              <div className="relative bg-slate-950/80 border border-emerald-800/50 rounded-t-[180px] rounded-b-3xl p-3 sm:p-4 backdrop-blur-xl shadow-2xl shadow-emerald-950/80">

                {/* SVG Decorative Border Outline */}
                <div className="absolute inset-2 border border-amber-500/30 rounded-t-[172px] rounded-b-2xl pointer-events-none z-20" />

                {/* Main Image Container with Soft Floating Animation */}
                <div className="relative overflow-hidden rounded-t-[168px] rounded-b-2xl h-[380px] sm:h-[420px] group">

                  {/* Animated Islamic Picture (HQ Unsplash Mosque/Quran Art) */}
                  <img
                    src="https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Islamic Architecture & Quran Learning"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90 contrast-105"
                  />

                  {/* Gradient Overlay for Text Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Bismillah Floating Emblem at Top */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-950/80 border border-amber-500/50 backdrop-blur-md flex items-center justify-center text-amber-400 font-bold text-xl shadow-lg shadow-amber-500/10 hover:scale-110 transition-transform">
                      ﷽
                    </div>
                    <p className="text-[10px] text-amber-300 font-serif italic tracking-widest mt-1 bg-slate-950/60 px-2 py-0.5 rounded-full border border-emerald-800/30">
                      "Read in the name of your Lord"
                    </p>
                  </div>

                  {/* Dynamic Glassmorphic Card Overlay at Bottom */}
                  <div className="absolute bottom-4 inset-x-4 z-10 bg-slate-950/85 border border-emerald-800/60 rounded-2xl p-4 backdrop-blur-md shadow-xl">
                    <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1">
                      Current Track Highlight
                    </div>

                    <div className={`text-white font-semibold text-xs sm:text-sm transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                      {activeSlide.highlight}
                    </div>

                    <div className="mt-3 pt-3 border-t border-emerald-900/50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Student Progress</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Enabled
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Scholar Support</span>
                        <span className="text-amber-400 font-bold">Live Q&A</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartLearning('/courses')}
                      className="mt-3.5 w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                    >
                      {isAuthenticated ? 'Open Dashboard ➔' : 'Enroll Now ➔'}
                    </button>
                  </div>

                </div>

                {/* Floating Sparkle Elements */}
                <span className="absolute -top-3 -left-3 text-amber-400 text-2xl animate-spin duration-[4000ms]">✦</span>
                <span className="absolute -top-3 -right-3 text-amber-400 text-2xl animate-spin duration-[4000ms]">✦</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;