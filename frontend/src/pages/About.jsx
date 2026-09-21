import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  // Page load hone par screen ko top par scroll karne ke liye
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-slate-50 min-h-screen text-slate-800 overflow-hidden pt-12 pb-24 relative font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-800px h-350px bg-emerald-100/60 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-400px h-400px bg-emerald-50 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
          <span>🕌 About Our Islamic Academy</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight max-w-4xl mx-auto">
          Authentic Sacred Knowledge for the <span className="text-emerald-600">Modern World</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          We bridge traditional Quranic scholarship with intuitive modern learning tools, empowering students globally to recite, understand, and live the Quran.
        </p>
      </section>

      {/* 2. STATS OVERVIEW */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white/80 border border-slate-200 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-md shadow-slate-100">
          {[
            { metric: "10,000+", label: "Active Students" },
            { metric: "25+", label: "Certified Scholars" },
            { metric: "98%", label: "Satisfaction Rate" },
            { metric: "50+", label: "Global Countries" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-3">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-600">
                {stat.metric}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MISSION & ISLAMIC MEHRAB ARCH VISUAL */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7">
            <span className="text-emerald-700 font-bold text-sm uppercase tracking-widest block mb-2">
              Our Higher Purpose
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-snug">
              Preserving Authentic Heritage Through Modern Technology
            </h2>
            <p className="text-slate-600 text-base mt-4 leading-relaxed">
              Founded with the vision to make Quranic education structured, accessible, and deeply engaging, our platform offers a distraction-free space for spiritual and intellectual growth.
            </p>

            <div className="space-y-4 mt-8">
              {[
                { title: "Verifiable Sanad & Ijazah", desc: "Learn directly under qualified scholars with authentic chains of narration." },
                { title: "Structured Curriculum", desc: "Step-by-step pathways designed specifically for busy adults and young learners." },
                { title: "Interactive Learning Space", desc: "Real-time tracking, live Q&A sessions, and dedicated student support." }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-sm">{feature.title}</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-normal">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Islamic Mehrab Arch Visual Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="relative mx-auto bg-gradient-to-b from-emerald-100/60 via-slate-50 to-white border border-emerald-300/60 rounded-t-[180px] p-6 pt-12 shadow-xl backdrop-blur-xl">
                <div className="absolute inset-2 border border-emerald-200 rounded-t-[170px] pointer-events-none" />

                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-2xl shadow-sm mb-3">
                    ﷽
                  </div>
                  <p className="text-xs text-emerald-800 font-serif italic tracking-wide font-medium">
                    "Seeking knowledge is an obligation upon every Muslim"
                  </p>
                </div>

                <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 text-center backdrop-blur-sm shadow-sm">
                  <span className="text-xs text-slate-500 font-medium">Academy Vision</span>
                  <h3 className="text-slate-900 font-bold text-base mt-1">Excellence in Recitation & Tafseer</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Combining traditional discipline with interactive quizzes, audio breakdown, and personalized guidance.
                  </p>
                </div>
              </div>

              <span className="absolute top-2 left-2 text-emerald-500/50 text-xl">✦</span>
              <span className="absolute top-2 right-2 text-emerald-500/50 text-xl">✦</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-700 font-bold text-sm uppercase tracking-wider">Our Guiding Principles</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Driven by Authenticity & Sincerity</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📖",
              title: "Authentic Scholarship",
              desc: "Every course is vetted and taught by certified teachers adhering strictly to traditional methodology."
            },
            {
              icon: "💡",
              title: "Student-Centric Technology",
              desc: "Our platform is built to eliminate distractions, offering smooth playback and progress dashboards."
            },
            {
              icon: "🤝",
              title: "Global Muslim Community",
              desc: "Fostering an encouraging environment where students from around the world learn and grow together."
            }
          ].map((val, idx) => (
            <div key={idx} className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-300 transition-all shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl mb-4 shadow-inner">
                {val.icon}
              </div>
              <h3 className="text-slate-900 font-bold text-lg">{val.title}</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-emerald-100/80 via-white to-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Begin Your Spiritual Journey Today
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Enroll in our courses and experience an immersive, structured Islamic learning environment.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              Explore All Courses
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-sm transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;