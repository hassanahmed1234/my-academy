import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import AssignmentAdminGrading from "./AssignmentAdminGrading";
import {
  ClipboardList,
  Plus,
  FileSpreadsheet,
  Loader2,
  X,
  Calendar,
  BookOpen,
} from "lucide-react";

const AssignmentAdminView = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    dueDate: "",
    totalMarks: 100,
    passingMarks: 40,
    type: "both",
    isPublished: false,
  });

  useEffect(() => {
    fetchAdminAssignments();
    fetchCourses();
  }, []);

  const fetchAdminAssignments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/assignment/admin/all");
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await API.patch(`/assignment/admin/publish/${id}`);
      setAssignments((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isPublished: res.data.isPublished } : item
        )
      );
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.course || !formData.dueDate) {
      return alert("Please fill all required fields!");
    }

    try {
      setCreating(true);
      await API.post("/assignment/admin/create", formData);
      alert("Assignment created successfully!");
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        course: "",
        dueDate: "",
        totalMarks: 100,
        passingMarks: 40,
        type: "both",
        isPublished: false,
      });
      fetchAdminAssignments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create assignment");
    } finally {
      setCreating(false);
    }
  };

  const handleOpenGrading = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setActiveTab("grading");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 bg-slate-50 min-h-screen text-slate-800">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-slate-900 tracking-tight">
            <ClipboardList className="text-amber-500 w-7 h-7" /> Assignment Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, publish assignments and evaluate student submissions effortlessly.
          </p>
        </div>

        <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 text-xs">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-150 ${
              activeTab === "assignments"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/40"
            }`}
          >
            All Assignments
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-150 ${
              activeTab === "grading"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/40"
            }`}
          >
            Grading & Submissions
          </button>
        </div>
      </div>

      {/* Tab 1: All Assignments */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 active:scale-[0.98] transition flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Create New Assignment
            </button>
          </div>

          {loading ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 flex justify-center">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Marks</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                        No assignments found. Click above to create one.
                      </td>
                    </tr>
                  ) : (
                    assignments.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-semibold text-slate-900">{item.title}</td>
                        <td className="p-4 text-slate-500">{item.course?.title || "N/A"}</td>
                        <td className="p-4 text-slate-600 font-medium">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-semibold text-amber-600">{item.totalMarks}</td>
                        <td className="p-4 capitalize text-slate-500">{item.type}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublish(item._id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                              item.isPublished
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/60"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenGrading(item._id)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 text-amber-600 font-semibold rounded-xl transition flex items-center gap-1.5 ml-auto shadow-xs"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" /> Grade
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Grading Component */}
      {activeTab === "grading" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <label className="text-xs text-slate-600 font-semibold">Select Assignment to Grade:</label>
            <select
              value={selectedAssignmentId || ""}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition shadow-xs"
            >
              <option value="" disabled>-- Select Assignment --</option>
              {assignments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title} ({a.course?.title || "General"})
                </option>
              ))}
            </select>
          </div>

          {selectedAssignmentId ? (
            <AssignmentAdminGrading assignmentId={selectedAssignmentId} />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400 font-medium shadow-xs">
              Please select an assignment from the dropdown above to view student submissions.
            </div>
          )}
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-amber-500 w-5 h-5" /> Create Assignment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              {/* Select Course */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Select Course *</label>
                <select
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Hooks Project"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>

              {/* Description / Questions */}
              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold">Instructions & Questions *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear instructions and questions for students..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>

              {/* Due Date & Submission Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Due Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Submission Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                  >
                    <option value="both">Text + File URL</option>
                    <option value="written">Text Response Only</option>
                    <option value="file">File Upload Only</option>
                  </select>
                </div>
              </div>

              {/* Total & Passing Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 font-semibold">Passing Marks</label>
                  <input
                    type="number"
                    value={formData.passingMarks}
                    onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Publish Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded border-slate-300"
                />
                <span className="text-slate-700 font-medium">Publish Immediately to Students</span>
              </label>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {creating ? "Creating..." : "Save Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentAdminView;