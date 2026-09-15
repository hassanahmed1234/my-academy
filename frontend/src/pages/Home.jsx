import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import API from "../api/axiosInstance";
import DashboardSection from "../components/DashboardSection";
import OccasionalLive from "../components/OccasionalLive";
import HeroSection from "../components/HeroSection";
import tajweedImg from "../assets/tajweed.jpg";
import seerahImg from "../assets/seerah.jpg";
import fiqhImg from "../assets/fiqh.jpg";
import arabicImg from "../assets/arabic.jpg";
import AIStudyAssistantSection from "../components/AIStudyAssistantSection";

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

    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const [coursesRes, liveRes] = await Promise.allSettled([
        API.get("/courses"),
        API.get("/live-sessions"),
      ]);

      if (coursesRes.status === "fulfilled") {
        const all = coursesRes.value.data || [];
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
    <div className="bg-slate-50 text-slate-800 min-h-screen selection:bg-emerald-500 selection:text-white font-sans overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. TRUST / QUICK STATS */}
      <section className="py-12 bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "1,000+", label: "Active Students" },
              { num: "20+", label: "Structured Courses" },
              { num: "500+", label: "Video Lessons" },
              { num: "100%", label: "Online & Flexible" },
            ].map((stat, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 shadow-sm"
              >
                <div className="text-3xl lg:text-4xl font-extrabold text-emerald-600">
                  {stat.num}
                </div>
                <div className="text-sm font-medium text-slate-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY LEARN WITH US - UPDATED WITH DASHBOARD & SIDEBAR FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Learn With E-Islam?</h2>
          <p className="text-slate-600 mt-3">An all-in-one Islamic learning ecosystem packed with modern tools and traditional scholarship.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: "📚", title: "Structured Courses", desc: "Step-by-step Islamic learning tailored from beginner to advanced levels." },
            { icon: "🎥", title: "Learn at Your Own Pace", desc: "Recorded high-quality video lessons accessible anytime, anywhere." },
            { icon: "📝", title: "Quizzes & Assignments", desc: "Evaluate your progress through interactive quizzes and hands-on assignment submissions." },
            { icon: "📊", title: "Task & Progress Tracking", desc: "Keep track of active, completed, and pending tasks in your student dashboard." },
            { icon: "🏆", title: "Student Leaderboard", desc: "Stay motivated, compete with peers, and track your ranking across courses." },
            { icon: "📢", title: "Academy Announcements", desc: "Never miss crucial updates, exam alerts, and new course module additions." },
            { icon: "🤖", title: "AI Study Assistant", desc: "Smart AI-powered study assistance to help answer queries and clarify concepts faster." },
            { icon: "🕌", title: "Occasional Live Sessions", desc: "Join interactive live classes, Q&A sessions, and special spiritual workshops." },
            { icon: "📜", title: "Certificates", desc: "Complete courses successfully and earn verified downloadable certificates." },
          ].map((feature, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 100}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED COURSES ⭐ */}
      <section className="py-20 bg-emerald-50/40 border-y border-emerald-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12" data-aos="fade-right">
            <div>
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Top Rated Programs</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">Featured Courses ⭐</h2>
            </div>
            <Link to="/courses" className="mt-4 md:mt-0 text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2 group">
              View All Courses <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayCourses.map((course, idx) => (
                <div
                  key={course._id}
                  data-aos="zoom-in-up"
                  data-aos-delay={idx * 100}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-emerald-300 transition-all"
                >
                  <div>
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                      <img
                        src={course.image || "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-emerald-700 font-semibold shadow-sm">
                        {course.level || "All Levels"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                      <p className="text-slate-600 text-xs mt-2 line-clamp-2">{course.description || "Learn essential Islamic knowledge with structured guidance."}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="font-bold text-emerald-600">{course.isFree ? "Free" : `$${course.price || "Paid"}`}</span>
                    <Link
                      to={`/courses`}
                      className="px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white text-xs font-bold transition-all"
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

      {/* AI STUDY ASSISTANT SECTION */}
      <div data-aos="fade-up">
        <AIStudyAssistantSection />
      </div>

      {/* 5. HOW IT WORKS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How It Works</h2>
          <p className="text-slate-600 mt-2">Start your learning journey in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { num: "01", title: "Create Account", desc: "Sign up for free in seconds and customize your profile." },
            { num: "02", title: "Browse & Enroll", desc: "Explore our catalogue of structured courses and select your program." },
            { num: "03", title: "Learn & Submit Tasks", desc: "Watch videos, complete quizzes, and submit assignments on time." },
            { num: "04", title: "Climb Leaderboard", desc: "Track progress, check announcements, and earn completion certificates." },
          ].map((step, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 150}
              className="bg-white border border-slate-200 p-8 rounded-2xl relative shadow-sm"
            >
              <span className="text-5xl font-black text-emerald-600 mb-4 block">{step.num}</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LEARNING EXPERIENCE PREVIEW */}
      <div data-aos="fade-up">
        <DashboardSection liveSessions={upcomingLive} />
      </div>

      {/* 7. OCCASIONAL LIVE CLASSES */}
      <div data-aos="fade-up">
        <OccasionalLive liveSessions={upcomingLive} />
      </div>

      {/* 8. ABOUT THE ACADEMY */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200" data-aos="zoom-in">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-emerald-600 font-semibold text-sm uppercase">Our Mission</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Authentic Knowledge for Everyone</h2>
          <p className="text-slate-600 mt-6 text-lg leading-relaxed font-normal">
            Our mission is to make authentic Islamic knowledge accessible through structured, engaging, and flexible online learning. We combine traditional scholarship with modern learning tools to help you connect deeper with Islam.
          </p>
          <div className="mt-8">
            <Link to="/about" className="inline-block px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 mt-2">Everything you need to know about our learning platform.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "Are the courses free?", a: "We offer both free introductory modules and comprehensive paid courses. You can start learning for free anytime." },
            { q: "How do quizzes and assignments work?", a: "Each module includes interactive quizzes and written/recitation assignments that you can submit directly from your student dashboard." },
            { q: "What is the Leaderboard feature?", a: "The leaderboard tracks your course completion, quiz scores, and assignment submissions to highlight top active learners." },
            { q: "What is the AI Study Assistant?", a: "An upcoming AI assistant designed to help answer course questions, clarify Arabic/Tajweed concepts, and guide your studies." },
            { q: "Will I receive a certificate?", a: "Upon completing all lessons and passing the final assessments of a course, a verified certificate is generated." },
            { q: "Can I access courses on mobile?", a: "Absolutely. Our platform is fully responsive and works smoothly across mobile phones, tablets, and desktops." },
          ].map((faq, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 50}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-6 text-left flex justify-between items-center text-slate-900 font-semibold text-base focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-emerald-600 text-xl font-bold">{faqOpen === idx ? "−" : "+"}</span>
              </button>
              {faqOpen === idx && (
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-24 bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/50 border-t border-emerald-100 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10" data-aos="zoom-in-up">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Start Your Islamic Learning Journey Today
          </h2>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
            Learn at your own pace. Build authentic knowledge. Strengthen your connection with Islam.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20 transition-all"
            >
              Explore Courses
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-lg transition-all"
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