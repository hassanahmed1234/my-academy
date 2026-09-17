import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  Save,
  Send,
  Loader2,
  UploadCloud,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Award,
} from "lucide-react";

const AssignmentStudent = () => {
  const {
    assignmentData,
    fetchAssignments,
    fetchAssignmentDetail,
    submitAssignment,triggerXpReward
  } = useAuth();
  
  const { assignments, loading: contextLoading, error: assignmentError } = assignmentData;

  const [view, setView] = useState("list"); // 'list' | 'detail'
  const [filter, setFilter] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  // Form & Upload States
  const [textResponse, setTextResponse] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Fetch Single Assignment Detail with Draft/Submission via Context
  const handleOpenAssignment = async (id) => {
    try {
      setLoadingDetail(true);
      const data = await fetchAssignmentDetail(id);
      setSelectedAssignment(data.assignment);
      setSubmission(data.submission);
      setTextResponse(data.submission?.textResponse || "");
      setFileUrl(data.submission?.fileUrl || "");
      setView("detail");
    } catch (err) {
      alert(typeof err === "string" ? err : "Error fetching assignment details");
    } finally{
      setLoadingDetail(false);
    }
  };

  // Direct File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileUrl(res.data.fileUrl || res.data.url);
    } catch (err) {
      alert(err.response?.data?.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Save Draft or Submit via Context
  const handleSaveOrSubmit = async (isFinalSubmit = false) => {
    if (isFinalSubmit && !confirmModal) {
      setConfirmModal(true);
      return;
    }

    try {
      setSaving(true);
      const data = await submitAssignment(selectedAssignment._id, {
        textResponse,
        fileUrl,
        isFinalSubmit,
      });

      setSubmission(data.submission);
      setConfirmModal(false);

      triggerXpReward({
      xpAmount: 100,
      reason: "assignment_submitted",
      heading: "Excellent Score! 🌟",
    });
    } catch (err) {
      alert(typeof err === "string" ? err : "Error saving submission");
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
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">Draft</span>;
      case "submitted":
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">Submitted</span>;
      case "graded":
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">Graded</span>;
      case "resubmit_required":
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-200">Resubmit Required</span>;
      case "overdue":
        return <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-200 font-mono">Overdue</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">Pending</span>;
    }
  };

  const isFormLocked = submission?.status === "submitted" || submission?.status === "graded";

  if (contextLoading && view === "list") {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-slate-800 font-sans">
      {view === "list" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                <FileText className="text-amber-500 w-6 h-6" /> Course Assignments
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">View instructions, write answers, and submit your tasks.</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {["all", "pending", "submitted", "graded"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg capitalize font-medium transition ${
                    filter === tab
                      ? "bg-amber-500 text-white font-bold shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {assignmentError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {assignmentError}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No assignments found</p>
              <p className="text-xs text-slate-500">There are no assignments available under this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400 transition shadow-sm space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span className="text-amber-600 font-bold">{item.course?.title || "General"}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Due: {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                      <span>Marks: <strong className="text-slate-800">{item.totalMarks}</strong></span>
                    </div>
                  </div>

                  <button
                    disabled={loadingDetail}
                    onClick={() => handleOpenAssignment(item._id)}
                    className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 text-xs font-bold text-slate-700 rounded-xl flex items-center justify-center gap-1 transition disabled:opacity-50"
                  >
                    {loadingDetail ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    ) : (
                      <>
                        View Details & Submit <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === "detail" && selectedAssignment && (
        <div className="space-y-6">
          <button
            onClick={() => setView("list")}
            className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1 transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assignments
          </button>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                  {selectedAssignment.course?.title}
                </span>
                <h1 className="text-xl font-bold mt-1 text-slate-900">{selectedAssignment.title}</h1>
              </div>
              <div>{getStatusBadge(submission?.status || "pending")}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500">Due Date</p>
                <p className="font-bold text-amber-600 mt-0.5">{new Date(selectedAssignment.dueDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Total Marks</p>
                <p className="font-bold text-slate-800 mt-0.5">{selectedAssignment.totalMarks}</p>
              </div>
              <div>
                <p className="text-slate-500">Passing Marks</p>
                <p className="font-bold text-slate-800 mt-0.5">{selectedAssignment.passingMarks}</p>
              </div>
            </div>

            {/* Score Banner */}
            {submission && (submission.status === "graded" || submission.status === "resubmit_required") && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  submission.isPassed
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-purple-50 border-purple-200 text-purple-800"
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Award className="w-4 h-4" /> Marks: {submission.marksObtained} / {selectedAssignment.totalMarks} ({submission.percentage}%)
                  </span>
                  <span className="px-2 py-0.5 bg-white/60 rounded-md uppercase text-[10px]">
                    {submission.isPassed ? "PASS" : "RESUBMISSION REQUIRED"}
                  </span>
                </div>
                {submission.feedback && (
                  <p className="italic pt-1 text-slate-700 border-t border-black/5">
                    "{submission.feedback}"
                  </p>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-amber-600">Instructions & Questions:</h4>
              <div className="text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedAssignment.description}
              </div>
            </div>

            {/* Response Section */}
            {submission?.status === "graded" ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-center text-emerald-700">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                This assignment has been evaluated and graded by the instructor.
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Your Response</h3>

                {(selectedAssignment.type === "written" || selectedAssignment.type === "both") && (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Write Answer Online:</label>
                    <textarea
                      rows={6}
                      disabled={isFormLocked}
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      placeholder="Write your comprehensive answers here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:border-amber-500 focus:outline-none disabled:opacity-50 text-slate-800"
                    />
                  </div>
                )}

                {(selectedAssignment.type === "file" || selectedAssignment.type === "both") && (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">Upload Attachment or Link:</label>

                    {!isFormLocked && (
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs cursor-pointer transition">
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> : <UploadCloud className="w-4 h-4 text-amber-600" />}
                          <span>{uploading ? "Uploading..." : "Upload File"}</span>
                          <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                        </label>
                        <span className="text-slate-400 text-xs">or paste URL below</span>
                      </div>
                    )}

                    <input
                      type="text"
                      disabled={isFormLocked}
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="Paste PDF link / Drive URL / Upload File"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:border-amber-500 focus:outline-none disabled:opacity-50 mt-1 text-slate-800"
                    />

                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-semibold hover:underline pt-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> View Uploaded Attachment
                      </a>
                    )}
                  </div>
                )}

                {!isFormLocked && (
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      disabled={saving || uploading}
                      onClick={() => handleSaveOrSubmit(false)}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-amber-600" /> {saving ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                      disabled={saving || uploading}
                      onClick={() => handleSaveOrSubmit(true)}
                      className="px-5 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                    >
                      <Send className="w-4 h-4" /> Submit Final
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Submit Assignment?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once submitted, editing is locked unless resubmission is requested by your instructor.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={() => handleSaveOrSubmit(true)}
                className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition"
              >
                {saving ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentStudent;