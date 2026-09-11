import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { Check, X, Eye, FileText, Send, User } from "lucide-react";

const AssignmentAdminGrading = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [marks, setMarks] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [resubmit, setResubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const res = await API.get(`/assignments/admin/submissions/${assignmentId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrade = async () => {
    try {
      setLoading(true);
      await API.post(`/assignments/admin/grade/${selectedSub._id}`, {
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
    <div className="space-y-6 text-islamic-text">
      <h2 className="text-lg font-bold">Submissions & Grading</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Submissions List */}
        <div className="bg-islamic-card border border-islamic-border rounded-2xl p-4 space-y-2">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              onClick={() => {
                setSelectedSub(sub);
                setMarks(sub.marksObtained || 0);
                setFeedback(sub.feedback || "");
              }}
              className={`p-3 rounded-xl border cursor-pointer text-xs transition flex justify-between items-center ${
                selectedSub?._id === sub._id ? "border-islamic-gold bg-islamic-bg" : "border-islamic-border"
              }`}
            >
              <div>
                <p className="font-bold">{sub.student?.name}</p>
                <p className="text-[10px] text-islamic-muted">{new Date(sub.submittedAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sub.status === "graded" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                {sub.status}
              </span>
            </div>
          ))}
        </div>

        {/* Right Grading Panel */}
        <div className="md:col-span-2 bg-islamic-card border border-islamic-border rounded-2xl p-6 space-y-6">
          {selectedSub ? (
            <>
              <div className="border-b border-islamic-border pb-3">
                <h3 className="font-bold">{selectedSub.student?.name}</h3>
                <p className="text-xs text-islamic-muted">{selectedSub.student?.email}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-islamic-gold">Written Response:</h4>
                  <div className="p-4 bg-islamic-bg border border-islamic-border rounded-xl mt-1 leading-relaxed">
                    {selectedSub.textResponse || "No written response provided."}
                  </div>
                </div>

                {selectedSub.fileUrl && (
                  <div>
                    <h4 className="font-bold text-islamic-gold">Attached File:</h4>
                    <a
                      href={selectedSub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 p-2 bg-islamic-bg border border-islamic-border rounded-xl text-blue-400 underline mt-1"
                    >
                      <FileText className="w-4 h-4" /> View Submitted Document
                    </a>
                  </div>
                )}

                {/* Evaluation Form */}
                <div className="pt-4 border-t border-islamic-border space-y-3">
                  <div>
                    <label className="font-bold">Marks Obtained:</label>
                    <input
                      type="number"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-full mt-1 p-2 bg-islamic-bg border border-islamic-border rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold">Instructor Feedback:</label>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add guidance or review points..."
                      className="w-full mt-1 p-2 bg-islamic-bg border border-islamic-border rounded-xl text-xs"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resubmit}
                      onChange={(e) => setResubmit(e.target.checked)}
                    />
                    <span>Require Resubmission from Student</span>
                  </label>

                  <button
                    disabled={loading}
                    onClick={handleGrade}
                    className="w-full py-2.5 bg-islamic-primary text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
                  >
                    Submit Grade & Feedback
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-islamic-muted text-center py-12">Select a student submission to evaluate.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentAdminGrading;