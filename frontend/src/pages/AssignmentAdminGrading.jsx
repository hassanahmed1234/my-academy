import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
  FileText,
  User,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const AssignmentAdminGrading = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [marks, setMarks] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [resubmit, setResubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setFetching(true);
      const res = await API.get(`/assignment/admin/submissions/${assignmentId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally{
      setFetching(false);
    }
  };

  const handleGrade = async () => {
    if (!selectedSub) return;
    try {
      setLoading(true);
      await API.post(`/assignment/admin/grade/${selectedSub._id}`, {
        marksObtained: Number(marks),
        feedback,
        requiresResubmission: resubmit,
      });
      alert("Submission graded successfully!");
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err) {
      alert("Failed to save grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-slate-800">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Submissions & Grading
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200/80">
          Total: {submissions.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Submissions List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-2 shadow-xs max-h-[600px] overflow-y-auto">
          {fetching ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">No submissions yet.</p>
            </div>
          ) : (
            submissions.map((sub) => {
              const isSelected = selectedSub?._id === sub._id;
              const isGraded = sub.status === "graded";

              return (
                <div
                  key={sub._id}
                  onClick={() => {
                    setSelectedSub(sub);
                    setMarks(sub.marksObtained || 0);
                    setFeedback(sub.feedback || "");
                    setResubmit(sub.requiresResubmission || false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer text-xs transition-all duration-150 flex justify-between items-center ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-500/20"
                      : "border-slate-200/80 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {sub.student?.name || "Student"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      isGraded
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                        : "bg-amber-50 text-amber-700 border-amber-200/80"
                    }`}
                  >
                    {isGraded ? "Graded" : "Pending"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Right Grading Panel */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
          {selectedSub ? (
            <>
              {/* Student Details Header */}
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedSub.student?.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedSub.student?.email}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  Submitted: {new Date(selectedSub.submittedAt).toLocaleString()}
                </span>
              </div>

              {/* Student Work Content */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-1.5">
                    Written Response
                  </h4>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                    {selectedSub.textResponse || (
                      <span className="text-slate-400 italic">No written response provided.</span>
                    )}
                  </div>
                </div>

                {selectedSub.fileUrl && (
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1.5">
                      Attached Resource
                    </h4>
                    <a
                      href={selectedSub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium transition shadow-xs group"
                    >
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span>View Submitted File</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
                    </a>
                  </div>
                )}

                {/* Evaluation Form */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">
                        Marks Obtained
                      </label>
                      <input
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">
                      Instructor Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write constructive guidance or review points..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={resubmit}
                      onChange={(e) => setResubmit(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-slate-700 font-medium">
                      Require Resubmission from Student
                    </span>
                  </label>

                  <button
                    disabled={loading}
                    onClick={handleGrade}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    {loading ? "Saving Grade..." : "Submit Grade & Feedback"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                Select a student submission from the left panel to evaluate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentAdminGrading;