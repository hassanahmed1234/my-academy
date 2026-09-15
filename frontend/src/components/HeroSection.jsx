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
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    currentSlide === idx ? 'w-10 bg-emerald-600 shadow-md shadow-emerald-500/30' : 'w-2 bg-slate-200 hover:bg-slate-300'
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

          {/* RIGHT COLUMN: Mehrab Arch Visual */}
          <div className="lg:col-span-5 flex justify-center" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="200">
            <div className="relative w-full max-w-sm sm:max-w-md animate-[bounce_6s_ease-in-out_infinite]">
              
              {/* Outer Glowing Mehrab Frame */}
              <div className="relative mx-auto bg-gradient-to-b from-emerald-100/60 via-white to-emerald-50 border border-emerald-300 rounded-t-[180px] p-6 pt-12 shadow-xl backdrop-blur-xl">
                
                {/* SVG Outline */}
                <div className="absolute inset-2 border border-emerald-200/80 rounded-t-[170px] pointer-events-none" />

                {/* Calligraphy Emblem */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-2xl shadow-sm mb-3 hover:scale-105 transition-transform duration-300">
                    ﷽
                  </div>
                  <p className="text-xs text-emerald-800 font-serif italic tracking-wide">
                    "Read in the name of your Lord"
                  </p>
                </div>

                {/* Mehrab Center Content Card */}
                <div className="bg-white border border-emerald-100 rounded-2xl p-5 text-center shadow-md">
                  <div className="text-xs text-slate-500 font-medium mb-1">Current Feature Highlight</div>
                  <div className={`text-emerald-700 font-bold text-sm transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    {activeSlide.highlight}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Student Progress Tracking</span>
                      <span className="text-emerald-600 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Scholar Support</span>
                      <span className="text-emerald-600 font-bold">Live Q&A</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartLearning('/courses')}
                    className="mt-5 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 font-bold text-xs transition-all cursor-pointer"
                  >
                    {isAuthenticated ? 'Open Dashboard ➔' : 'Enroll Now ➔'}
                  </button>
                </div>

              </div>

              {/* Corner Stars */}
              <span className="absolute top-2 left-2 text-emerald-400 text-xl animate-spin duration-3000">✦</span>
              <span className="absolute top-2 right-2 text-emerald-400 text-xl animate-spin duration-3000">✦</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;