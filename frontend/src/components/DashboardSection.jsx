import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardSection = ({liveSessions = []  }) => {
  const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
  

  const handleJoinClass = () => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Logged in target path
    } else {
      navigate('/login'); // Redirect to login page
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Interactive Student Dashboard</h2>
        <p className="text-slate-400 mt-2">A clean, focused space designed to eliminate distractions and keep you motivated.</p>
      </div>

      {/* Dashboard Frame Mockup */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950">
              H
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Welcome back, Hassan 👋</h3>
              <span className="text-slate-500 text-xs">Student Portal</span>
            </div>
          </div>
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium">
            Active Enrolled
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">Continue Learning</span>
            <h4 className="text-white font-bold text-lg mt-1">Tajweed Essentials Course</h4>
            
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Course Completion</span>
                <span className="text-amber-400 font-bold">80%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[80%]" />
              </div>
            </div>

            {/* Attached Login Check to Button */}
            <button 
              onClick={handleJoinClass}
              className="mt-6 w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              ▶ Resume Lesson 12: Makharij Al-Huruf
            </button>
          </div>

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
                    onClick={(e) => handleJoinClass(e, session.meetingUrl)}
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
    </section>
  );
};

export default DashboardSection;