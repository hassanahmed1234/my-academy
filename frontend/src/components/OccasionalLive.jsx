import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OccasionalLive = ({ liveSessions = [] }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Join Link Click Handler
  const handleJoinClick = (e, meetingUrl) => {
    e.preventDefault();

    if (isAuthenticated) {
      if (meetingUrl) {
        window.open(meetingUrl, "_blank", "noopener,noreferrer");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN: Section Details */}
          <div data-aos="fade-right" data-aos-duration="800">
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
              Interactive Live Sessions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Learn Together, Ask Questions 🕌
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              While our main courses are pre-recorded for your convenience, we host periodic live sessions for Q&A, Tafseer discussions, and workshops.
            </p>

            {/* Feature Grid with Staggered AOS */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                "📖 Tajweed Workshops",
                "🕌 Tafseer Q&A Sessions",
                "🌙 Ramadan Specials",
                "💬 Open Student Support",
              ].map((item, idx) => (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="flex items-center gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm font-medium hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
              <Link
                to="/live-sessions"
                className="inline-block px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-sm border border-slate-700 hover:border-amber-500/50 transition-all duration-300 shadow-lg shadow-amber-500/5"
              >
                View Upcoming Live Schedule →
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Session Cards */}
          <div className="space-y-4" data-aos="fade-left" data-aos-duration="800">
            {liveSessions.length > 0 ? (
              liveSessions.slice(0, 3).map((session, index) => (
                <div
                  key={session._id}
                  data-aos="zoom-in-up"
                  data-aos-delay={index * 150}
                  className="p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 group"
                >
                  <div>
                    <span className="text-xs text-amber-400 font-semibold">
                      {session.scholarName || "Scholar Session"}
                    </span>
                    <h4 className="text-white font-bold text-base mt-0.5 group-hover:text-amber-300 transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {new Date(session.scheduledAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Auth Protected Join Button */}
                  <button
                    onClick={(e) => handleJoinClick(e, session.meetingUrl)}
                    className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all duration-300 shrink-0 cursor-pointer shadow-sm hover:shadow-emerald-500/20"
                  >
                    Join Link
                  </button>
                </div>
              ))
            ) : (
              <div
                data-aos="fade-up"
                className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-400 text-sm backdrop-blur-sm"
              >
                No live sessions currently scheduled. Check back soon!
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default OccasionalLive;