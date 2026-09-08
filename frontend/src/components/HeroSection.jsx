import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Apne folder path ke mutabiq adjust karein

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Tajweed & Recitation',
    title: 'Master Quranic Pronunciation with Precision',
    description: 'Learn the exact points of articulation (Makharij) and characteristics of Arabic letters with verified scholars.',
    highlight: '80% Practical Exercises',
    ctaText: 'Start Tajweed Course',
    targetRoute: '/courses/tajweed',
  },
  {
    id: 2,
    tag: 'Tafseer & Understanding',
    title: 'Connect Deeply with the Wisdom of the Quran',
    description: 'Explore line-by-line verse explanations, context of revelation, and real-life spiritual applications.',
    highlight: 'Weekly Q&A Webinars',
    ctaText: 'Explore Tafseer Series',
    targetRoute: '/courses/tafseer',
  },
  {
    id: 3,
    tag: 'Memorization (Hifz)',
    title: 'Structured Hifz Track with Daily Revisions',
    description: 'A proven step-by-step memorization pathway designed for busy adults and young learners alike.',
    highlight: '1-on-1 Guidance Support',
    ctaText: 'Join Hifz Program',
    targetRoute: '/courses/hifz',
  },
];

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play Carousel (Har 6 seconds mein slide change hogi)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // CTA Click Handler with Auth Check
  const handleStartLearning = (targetRoute) => {
    if (isAuthenticated) {
      navigate('/classroom'); // Agar logged in hai toh student portal bhejain
    } else {
      navigate('/login', { state: { redirectTo: targetRoute } }); // Redirection context ke sath
    }
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative bg-slate-950 overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Interactive Carousel Text & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Interactive Islamic Academy Platform</span>
            </div>

            {/* Dynamic Slider Content */}
            <div className="min-h-[220px] transition-all duration-500">
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-widest block mb-2">
                {activeSlide.tag}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                {activeSlide.title}
              </h1>

              <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {activeSlide.description}
              </p>
            </div>

            {/* Slider Controls / Dots */}
            <div className="flex items-center justify-center lg:justify-start gap-2 my-6">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
              <button
                onClick={() => handleStartLearning(activeSlide.targetRoute)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isAuthenticated ? 'Go to Classroom' : activeSlide.ctaText}</span>
                <span>→</span>
              </button>

              <Link
                to="/courses"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm text-center transition-all"
              >
                Browse All Courses
              </Link>
            </div>

            {/* Highlights Bar */}
            <div className="mt-10 pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Self-Paced & Live Tracks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Certified Scholars</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Islamic Mehrab Arch Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Outer Glowing Mehrab Frame */}
              <div className="relative mx-auto bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/30 rounded-t-[180px] p-6 pt-12 shadow-2xl backdrop-blur-xl">
                
                {/* SVG Islamic Arch Decorative Outline */}
                <div className="absolute inset-2 border border-amber-500/20 rounded-t-[170px] pointer-events-none" />

                {/* Islamic Calligraphy Graphic / Emblem */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-950 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-2xl shadow-inner mb-3">
                    ﷽
                  </div>
                  <p className="text-xs text-amber-300 font-serif italic tracking-wide">
                    "Read in the name of your Lord"
                  </p>
                </div>

                {/* Mehrab Center Content Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center backdrop-blur-sm">
                  <div className="text-xs text-slate-400 font-medium mb-1">Current Feature Highlight</div>
                  <div className="text-amber-400 font-bold text-sm">{activeSlide.highlight}</div>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 text-left space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Student Progress Tracking</span>
                      <span className="text-emerald-400 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Scholar Support</span>
                      <span className="text-amber-400 font-bold">Live Q&A</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartLearning('/courses')}
                    className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    {isAuthenticated ? 'Open Dashboard ➔' : 'Enroll Now ➔'}
                  </button>
                </div>

              </div>

              {/* Decorative Corner Stars */}
              <span className="absolute top-2 left-2 text-amber-500/40 text-xl">✦</span>
              <span className="absolute top-2 right-2 text-amber-500/40 text-xl">✦</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;