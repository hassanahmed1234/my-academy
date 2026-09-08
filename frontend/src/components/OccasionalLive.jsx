import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Context Path Adjust Karein

const OccasionalLive = ({ liveSessions = [] }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Join Link Click Handler
  const handleJoinClick = (e, meetingUrl) => {
    e.preventDefault(); // Default anchor click behavior stop karne ke liye

    if (isAuthenticated) {
      // Logged In: Meeting link new tab mein kholein
      if (meetingUrl) {
        window.open(meetingUrl, "_blank", "noopener,noreferrer");
      }
    } else {
      // Logged Out: Login page par redirect karein
      navigate("/login");
    }
  };

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
              Interactive Live Sessions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Learn Together, Ask Questions 🕌
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              While our main courses are pre-recorded for your convenience, we host periodic live sessions for Q&A, Tafseer discussions, and workshops.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                "📖 Tajweed Workshops",
                "🕌 Tafseer Q&A Sessions",
                "🌙 Ramadan Specials",
                "💬 Open Student Support",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/live-sessions"
                className="inline-block px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-sm border border-slate-700 transition-colors"
              >
                View Upcoming Live Schedule →
              </Link>
            </div>
          </div>

          {/* Live Session List Cards (Backend Connected + Auth Guarded) */}
          <div className="space-y-4">
            {liveSessions.length > 0 ? (
              liveSessions.slice(0, 3).map((session) => (
                <div
                  key={session._id}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs text-amber-400 font-semibold">
                      {session.scholarName || "Scholar Session"}
                    </span>
                    <h4 className="text-white font-bold text-base mt-0.5">
                      {session.title}
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">
                      {new Date(session.scheduledAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Auth protected join button */}
                  <button
                    onClick={(e) => handleJoinClick(e, session.meetingUrl)}
                    className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all shrink-0 cursor-pointer"
                  >
                    Join Link
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400 text-sm">
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