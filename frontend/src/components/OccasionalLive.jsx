import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OccasionalLive = ({ liveSessions = [] }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    <section className="py-20 bg-emerald-50/30 border-t border-emerald-100 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN */}
          <div data-aos="fade-right" data-aos-duration="800">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
              Interactive Live Sessions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Learn Together, Ask Questions 🕌
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              While our main courses are pre-recorded for your convenience, we host periodic live sessions for Q&A, Tafseer discussions, and workshops.
            </p>

            {/* Feature Grid */}
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
                  className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
              <Link
                to="/live-sessions"
                className="inline-block px-6 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-semibold text-sm border border-emerald-200 transition-all duration-300 shadow-sm"
              >
                View Upcoming Live Schedule →
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4" data-aos="fade-left" data-aos-duration="800">
            {liveSessions.length > 0 ? (
              liveSessions.slice(0, 3).map((session, index) => (
                <div
                  key={session._id}
                  data-aos="zoom-in-up"
                  data-aos-delay={index * 150}
                  className="p-5 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 shadow-sm hover:shadow-md group"
                >
                  <div>
                    <span className="text-xs text-emerald-600 font-semibold">
                      {session.scholarName || "Scholar Session"}
                    </span>
                    <h4 className="text-slate-900 font-bold text-base mt-0.5 group-hover:text-emerald-600 transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {new Date(session.scheduledAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleJoinClick(e, session.meetingUrl)}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300 shrink-0 cursor-pointer shadow-sm"
                  >
                    Join Link
                  </button>
                </div>
              ))
            ) : (
              <div
                data-aos="fade-up"
                className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-sm shadow-sm"
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