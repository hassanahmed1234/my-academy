import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { FileText, Loader2 } from "lucide-react";

const AssignmentAdminGrading = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [marks, setMarks] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [resubmit, setResubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  // 1. Fetch Submissions List for Admin Grading
  const fetchSubmissions = async () => {
    try {
      setFetching(true);
      const res = await API.get(`/assignment/admin/submissions/${assignmentId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setFetching(false);
    }
  };

  // 2. Submit Grade & Feedback
  const handleGrade = async () => {
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
      alert(err.response?.data?.message || "Failed to save grade");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-200">
      <h2 className="text-lg font-bold">Submissions & Grading</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Submissions List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[500px] overflow-y-auto">
          {submissions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No submissions yet.</p>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub._id}
                onClick={() => {
                  setSelectedSub(sub);
                  setMarks(sub.marksObtained || 0);
                  setFeedback(sub.feedback || "");
                }}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition flex justify-between items-center ${
                  selectedSub?._id === sub._id
                    ? "border-amber-500 bg-slate-950"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <div>
                  <p className="font-bold text-slate-200">{sub.student?.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "Draft"}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    sub.status === "graded"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Right Grading Panel */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {selectedSub ? (
            <>
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-100">{selectedSub.student?.name}</h3>
                <p className="text-xs text-slate-400">{selectedSub.student?.email}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-amber-400">Written Response:</h4>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mt-1 leading-relaxed text-slate-300">
                    {selectedSub.textResponse || "No written response provided."}
                  </div>
                </div>

                {selectedSub.fileUrl && (
                  <div>
                    <h4 className="font-bold text-amber-400">Attached File:</h4>
                    <a
                      href={selectedSub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl text-blue-400 underline mt-1"
                    >
                      <FileText className="w-4 h-4" /> View Submitted Document
                    </a>
                  </div>
                )}

                {/* Evaluation Form */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="font-bold text-slate-300">Marks Obtained:</label>
                    <input
                      type="number"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300">Instructor Feedback:</label>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add guidance or review points..."
                      className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={resubmit}
                      onChange={(e) => setResubmit(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>Require Resubmission from Student</span>
                  </label>

                  <button
                    disabled={loading}
                    onClick={handleGrade}
                    className="w-full py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition"
                  >
                    {loading ? "Submitting Grade..." : "Submit Grade & Feedback"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 text-center py-12">
              Select a student submission from the list to evaluate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentAdminGrading;