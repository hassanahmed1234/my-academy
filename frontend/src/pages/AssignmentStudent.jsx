import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  Save,
  Send,
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

  // 1. Fetch Student Assignments List
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/assignment/student/list");
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Single Assignment Detail with Draft/Submission
  const handleOpenAssignment = async (id) => {
    try {
      setLoading(true);
      const res = await API.get(`/assignment/student/detail/${id}`);
      setSelectedAssignment(res.data.assignment);
      setSubmission(res.data.submission);
      setTextResponse(res.data.submission?.textResponse || "");
      setFileUrl(res.data.submission?.fileUrl || "");
      setView("detail");
    } catch (err) {
      console.error("Error fetching assignment details:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Save Draft or Final Submit
  const handleSaveOrSubmit = async (isFinalSubmit = false) => {
    if (
      isFinalSubmit &&
      !window.confirm(
        "Submit assignment? Once submitted, editing is locked unless resubmission is allowed."
      )
    )
      return;

    try {
      setSaving(true);
      const res = await API.post(
        `/assignment/student/submit/${selectedAssignment._id}`,
        {
          textResponse,
          fileUrl,
          isFinalSubmit,
        }
      );

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
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-slate-200">
      {view === "list" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-amber-400" /> Course Assignments
              </h1>
              <p className="text-xs text-slate-400">View instructions, write answers, and submit your tasks.</p>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {["all", "pending", "submitted", "graded"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                    filter === tab ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/40 transition shadow-sm space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="text-amber-400 font-semibold">{item.course?.title || "General"}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    <span>Marks: {item.totalMarks}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAssignment(item._id)}
                  className="w-full py-2 bg-slate-950 border border-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition"
                >
                  View Details & Submit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "detail" && selectedAssignment && (
        <div className="space-y-6">
          <button
            onClick={() => setView("list")}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1"
          >
            ← Back to Assignments
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold">{selectedAssignment.course?.title}</span>
                <h1 className="text-xl font-bold mt-1">{selectedAssignment.title}</h1>
              </div>
              <div>{getStatusBadge(submission?.status || "pending")}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <p className="text-slate-400">Due Date</p>
                <p className="font-bold text-amber-400">{new Date(selectedAssignment.dueDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400">Total Marks</p>
                <p className="font-bold">{selectedAssignment.totalMarks}</p>
              </div>
              <div>
                <p className="text-slate-400">Passing Marks</p>
                <p className="font-bold">{selectedAssignment.passingMarks}</p>
              </div>
            </div>

            {submission && (submission.status === "graded" || submission.status === "resubmit_required") && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${submission.isPassed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-purple-500/10 border-purple-500/20 text-purple-300"}`}>
                <div className="flex justify-between items-center font-bold">
                  <span>Score: {submission.marksObtained} / {selectedAssignment.totalMarks} ({submission.percentage}%)</span>
                  <span>{submission.isPassed ? "PASS" : "RESUBMISSION REQUIRED"}</span>
                </div>
                <p className="italic">"{submission.feedback || "No specific feedback provided."}"</p>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-amber-400">Instructions & Questions:</h4>
              <p className="text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedAssignment.description}
              </p>
            </div>

            {submission?.status === "graded" ? (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                This assignment has been evaluated and graded by the instructor.
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="font-bold text-sm">Your Response</h3>

                {(selectedAssignment.type === "written" || selectedAssignment.type === "both") && (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Write Answer Online:</label>
                    <textarea
                      rows={6}
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      placeholder="Write your comprehensive answers here..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}

                {(selectedAssignment.type === "file" || selectedAssignment.type === "both") && (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Attach File / Document URL (PDF/DOCX):</label>
                    <input
                      type="text"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="Paste PDF link / Drive URL"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    disabled={saving}
                    onClick={() => handleSaveOrSubmit(false)}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4 text-amber-400" /> {saving ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    disabled={saving}
                    onClick={() => handleSaveOrSubmit(true)}
                    className="px-5 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition flex items-center gap-1.5"
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