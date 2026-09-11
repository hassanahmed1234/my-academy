import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Save,
  Send,
  ChevronRight,
  RotateCcw,
  FileCheck,
  Loader2,
} from "lucide-react";

const AssignmentStudent = () => {
  const [view, setView] = useState("list"); // 'list' | 'detail'
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  // Form State
  const [textResponse, setTextResponse] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/assignments/student/list");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignment = async (id) => {
    try {
      setLoading(true);
      const res = await API.get(`/assignments/student/detail/${id}`);
      setSelectedAssignment(res.data.assignment);
      setSubmission(res.data.submission);
      setTextResponse(res.data.submission?.textResponse || "");
      setFileUrl(res.data.submission?.fileUrl || "");
      setView("detail");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrSubmit = async (isFinalSubmit = false) => {
    if (isFinalSubmit && !window.confirm("Submit assignment? Once submitted, editing is locked unless resubmission is allowed.")) return;

    try {
      setSaving(true);
      const res = await API.post(`/assignments/student/submit/${selectedAssignment._id}`, {
        textResponse,
        fileUrl,
        isFinalSubmit,
      });

      setSubmission(res.data.submission);
      alert(res.data.message);
      if (isFinalSubmit) fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving submission");
    } finally {
      setSaving(false);
    }
  };

  const filtered = assignments.filter((a) => {
    if (filter === "all") return true;
    if (filter === "pending") return a.status === "pending" || a.status === "draft";
    if (filter === "submitted") return a.status === "submitted" || a.status === "late";
    if (filter === "graded") return a.status === "graded";
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/20">In Progress (Draft)</span>;
      case "submitted":
        return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20">Submitted</span>;
      case "graded":
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20">Graded</span>;
      case "resubmit_required":
        return <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/20">Resubmit Required</span>;
      case "overdue":
        return <span className="px-2.5 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold border border-red-500/20">Overdue</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-500/10 text-slate-400 rounded-lg text-xs font-bold border border-slate-500/20">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-islamic-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-islamic-text">
      {view === "list" && (
        <>
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-islamic-border pb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-islamic-gold" /> Course Assignments
              </h1>
              <p className="text-xs text-islamic-muted">View instructions, write answers, and submit your tasks.</p>
            </div>

            <div className="flex bg-islamic-card p-1 rounded-xl border border-islamic-border text-xs">
              {["all", "pending", "submitted", "graded"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                    filter === tab ? "bg-islamic-primary text-white font-bold" : "text-islamic-muted hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Assignment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="bg-islamic-card border border-islamic-border rounded-2xl p-5 flex flex-col justify-between hover:border-islamic-gold/40 transition shadow-sm space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-islamic-muted">
                    <span className="text-islamic-gold font-semibold">{item.course?.title || "General"}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-islamic-muted pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    <span>Marks: {item.totalMarks}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAssignment(item._id)}
                  className="w-full py-2 bg-islamic-bg border border-islamic-border hover:bg-islamic-primary hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition"
                >
                  View Details & Submit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* DETAIL & SUBMISSION VIEW */}
      {view === "detail" && selectedAssignment && (
        <div className="space-y-6">
          <button
            onClick={() => setView("list")}
            className="text-xs text-islamic-muted hover:text-islamic-gold flex items-center gap-1"
          >
            ← Back to Assignments
          </button>

          <div className="bg-islamic-card border border-islamic-border rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-islamic-border pb-4">
              <div>
                <span className="text-xs text-islamic-gold font-bold">{selectedAssignment.course?.title}</span>
                <h1 className="text-xl font-bold mt-1">{selectedAssignment.title}</h1>
              </div>
              <div>{getStatusBadge(submission?.status || "pending")}</div>
            </div>

            {/* Guidelines & Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-islamic-bg p-4 rounded-xl border border-islamic-border text-xs">
              <div>
                <p className="text-islamic-muted">Due Date</p>
                <p className="font-bold text-amber-400">{new Date(selectedAssignment.dueDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-islamic-muted">Total Marks</p>
                <p className="font-bold">{selectedAssignment.totalMarks}</p>
              </div>
              <div>
                <p className="text-islamic-muted">Passing Marks</p>
                <p className="font-bold">{selectedAssignment.passingMarks}</p>
              </div>
            </div>

            {/* Teacher Feedback Banner if Graded */}
            {submission && (submission.status === "graded" || submission.status === "resubmit_required") && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${submission.isPassed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-purple-500/10 border-purple-500/20 text-purple-300"}`}>
                <div className="flex justify-between items-center font-bold">
                  <span>Score: {submission.marksObtained} / {selectedAssignment.totalMarks} ({submission.percentage}%)</span>
                  <span>{submission.isPassed ? "PASS" : "RESUBMISSION REQUIRED"}</span>
                </div>
                <p className="text-islamic-text italic">"{submission.feedback || "No specific feedback provided."}"</p>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-islamic-gold">Instructions & Questions:</h4>
              <p className="text-islamic-muted whitespace-pre-line leading-relaxed bg-islamic-bg p-4 rounded-xl border border-islamic-border">
                {selectedAssignment.description}
              </p>
            </div>

            {/* Submission Section */}
            {submission?.status === "graded" ? (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                This assignment has been evaluated and graded by the instructor.
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-islamic-border">
                <h3 className="font-bold text-sm">Your Response</h3>

                {(selectedAssignment.type === "written" || selectedAssignment.type === "both") && (
                  <div className="space-y-1">
                    <label className="text-xs text-islamic-muted">Write Answer Online:</label>
                    <textarea
                      rows={6}
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      placeholder="Write your comprehensive answers here..."
                      className="w-full bg-islamic-bg border border-islamic-border rounded-xl p-3 text-xs focus:border-islamic-gold focus:outline-none"
                    />
                  </div>
                )}

                {(selectedAssignment.type === "file" || selectedAssignment.type === "both") && (
                  <div className="space-y-1">
                    <label className="text-xs text-islamic-muted">Attach File / Document URL (PDF/DOCX):</label>
                    <input
                      type="text"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="Paste PDF link / Drive URL"
                      className="w-full bg-islamic-bg border border-islamic-border rounded-xl p-3 text-xs focus:border-islamic-gold focus:outline-none"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    disabled={saving}
                    onClick={() => handleSaveOrSubmit(false)}
                    className="px-4 py-2 bg-islamic-bg border border-islamic-border hover:bg-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4 text-islamic-gold" /> {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    disabled={saving}
                    onClick={() => handleSaveOrSubmit(true)}
                    className="px-5 py-2.5 bg-islamic-primary text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Submit Final
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentStudent;