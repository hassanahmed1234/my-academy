import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance"; // adjust import path as needed
import DashboardSection from "../components/DashboardSection";
import OccasionalLive from "../components/OccasionalLive";
import HeroSection from "../components/HeroSection";
import tajweedImg from "../assets/tajweed.jpg";
import seerahImg from "../assets/seerah.jpg";
import fiqhImg from "../assets/fiqh.jpg";
import arabicImg from "../assets/arabic.jpg";

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [upcomingLive, setUpcomingLive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);
 const dummyCourses = [
  {
    _id: "dummy-1",
    title: "Quranic Tajweed Essentials",
    description: "Master the rules of Tajweed and correct pronunciation with practical exercises.",
    level: "Beginner",
    isFree: true,
    price: 0,
    image: tajweedImg,
  },
  {
    _id: "dummy-2",
    title: "Seerah of Prophet Muhammad (PBUH)",
    description: "In-depth study of the life, lessons, and leadership from authentic sources.",
    level: "Intermediate",
    isFree: true,
    price: 0,
    image: seerahImg,
  },
  {
    _id: "dummy-3",
    title: "Fundamentals of Fiqh",
    description: "Comprehensive guide to daily worship rules and Islamic jurisprudence.",
    level: "All Levels",
    isFree: true,
    price: 0,
    image: fiqhImg,
  },
  {
    _id: "dummy-4",
    title: "Arabic Grammar & Vocabulary",
    description: "Learn foundational Classical Arabic to understand the Quran directly.",
    level: "Beginner",
    isFree: true,
    price: 0,
    image: arabicImg,
  },
];

  const displayCourses = featuredCourses.length > 0 ? featuredCourses : dummyCourses;
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Parallel Real API calls toBackend
      const [coursesRes, liveRes] = await Promise.allSettled([
        API.get("/courses"),
        API.get("/live-sessions"),
      ]);

      if (coursesRes.status === "fulfilled") {
        const all = coursesRes.value.data || [];
        // Real Filter: Featured and Free Courses
        setFeaturedCourses(all.filter((c) => c.isFeatured || c.rating >= 4.5).slice(0, 4));
        setFreeCourses(all.filter((c) => c.isFree || c.price === 0).slice(0, 4));
      }

      if (liveRes.status === "fulfilled") {
        setUpcomingLive(liveRes.value.data || []);
      }
    } catch (err) {
      console.error("Home data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-screen selection:bg-amber-500 selection:text-slate-950 font-sans">

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 3. TRUST / QUICK STATS */}
      <section className="py-12 bg-slate-900/50 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "1,000+", label: "Active Students" },
              { num: "20+", label: "Structured Courses" },
              { num: "500+", label: "Video Lessons" },
              { num: "100%", label: "Online & Flexible" },
            ].map((stat, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/60 backdrop-blur-sm">
                <div className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.num}
                </div>
                <div className="text-sm font-medium text-slate-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY LEARN WITH US */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why Learn With Us?</h2>
          <p className="text-slate-400 mt-3">Designed specifically for modern students seeking structured and traditional Islamic education.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: "📚", title: "Structured Courses", desc: "Step-by-step Islamic learning tailored from beginner to advanced levels." },
            { icon: "🎥", title: "Learn at Your Own Pace", desc: "Recorded high-quality video lessons accessible anytime, anywhere." },
            { icon: "📝", title: "Quizzes & Assessments", desc: "Test your understanding after modules to lock in your knowledge." },
            { icon: "📊", title: "Track Your Progress", desc: "Intuitive dashboard to monitor how much you have learned in real-time." },
            { icon: "🏆", title: "Certificates", desc: "Complete courses successfully and earn downloadable certificates." },
            { icon: "🕌", title: "Occasional Live Sessions", desc: "Join interactive live classes, Q&A sessions, and special spiritual workshops." },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED COURSES ⭐ (REAL DATA) */}
      <section className="py-20 bg-slate-950/80 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Top Rated Programs</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">Featured Courses ⭐</h2>
            </div>
            <Link to="/courses" className="mt-4 md:mt-0 text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-2 group">
              View All Courses <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayCourses.map((course) => (
                <div key={course._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="h-44 bg-slate-800 relative overflow-hidden">
                      <img
                        src={course.image || "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-400 font-medium">
                        {course.level || "All Levels"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{course.title}</h3>
                      <p className="text-slate-400 text-xs mt-2 line-clamp-2">{course.description || "Learn essential Islamic knowledge with structured guidance."}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                    <span className="font-bold text-amber-400">{course.isFree ? "Free" : `$${course.price || "Paid"}`}</span>
                    <Link
                      to={`/courses`}
                      className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-bold transition-all"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
          <p className="text-slate-400 mt-2">Start your learning journey in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { num: "01", title: "Create Account", desc: "Sign up for free in seconds and customize your dashboard." },
            { num: "02", title: "Choose a Course", desc: "Browse through our catalogue of free and premium courses." },
            { num: "03", title: "Start Learning", desc: "Watch videos, read supplementary notes, and solve quizzes." },
            { num: "04", title: "Complete & Grow", desc: "Track knowledge growth and earn verified completion certificates." },
          ].map((step, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl relative">
              <span className="text-5xl font-black text-amber-50 mb-4 block">{step.num}</span>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* 8. LEARNING EXPERIENCE PREVIEW (MOCKUP) */}
      <DashboardSection liveSessions={upcomingLive} />

      {/* 9. OCCASIONAL LIVE CLASSES */}
      <OccasionalLive liveSessions={upcomingLive} />

      {/* 10. ABOUT THE ACADEMY */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-amber-400 font-semibold text-sm uppercase">Our Mission</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Authentic Knowledge for Everyone</h2>
          <p className="text-slate-300 mt-6 text-lg leading-relaxed font-light">
            Our mission is to make authentic Islamic knowledge accessible through structured, engaging, and flexible online learning. We combine traditional scholarship with modern learning tools to help you connect deeper with Islam.
          </p>
          <div className="mt-8">
            <Link to="/about" className="inline-block px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-semibold text-sm transition-all">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* 13. FAQ SECTION */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 mt-2">Everything you need to know about our learning platform.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "Are the courses free?", a: "We offer both free introductory modules and comprehensive paid courses. You can start learning for free anytime." },
            { q: "Can I learn at my own pace?", a: "Yes! All main course modules are pre-recorded so you can study according to your daily routine." },
            { q: "Are live classes available?", a: "Yes, we organize periodic live Q&A sessions, Tajweed workshops, and special event classes." },
            { q: "Will I receive a certificate?", a: "Upon completing all lessons and passing the final assessments of a course, a verified certificate is generated." },
            { q: "Can I access courses on mobile?", a: "Absolutely. Our platform is fully responsive and works smoothly across mobile phones, tablets, and desktops." },
            { q: "How do I enroll in a paid course?", a: "Simply select the course, click Enroll, and follow the simple checkout process to instantly unlock full course access." },
          ].map((faq, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex justify-between items-center text-white font-semibold text-base focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-amber-400 text-xl font-bold">{faqOpen === idx ? "−" : "+"}</span>
              </button>
              {faqOpen === idx && (
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/40 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Start Your Islamic Learning Journey Today
          </h2>
          <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
            Learn at your own pace. Build authentic knowledge. Strengthen your connection with Islam.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/20"
            >
              Explore Courses
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-semibold text-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;