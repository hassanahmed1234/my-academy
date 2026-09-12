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
  const [activeTab, setActiveTab] = useState("assignments"); // 'assignments' | 'grading'
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
    type: "both", // 'written' | 'file' | 'both'
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
      // Apne course fetch endpoint ke mutabiq adjust kar lein (e.g. /course/all ya /courses)
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Toggle Publish Status
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

  // Submit New Assignment Form
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.course || !formData.dueDate) {
      return alert("Please fill all required fields!");
    }

    try {
      setCreating(true);
      const res = await API.post("/assignment/admin/create", formData);
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
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-slate-200">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="text-amber-400" /> Assignment Management
          </h1>
          <p className="text-xs text-slate-400">
            Create, publish assignments and evaluate student submissions.
          </p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === "assignments"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Assignments
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === "grading"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
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
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition flex items-center gap-1.5 shadow-md shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Create New Assignment
            </button>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
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
                <tbody className="divide-y divide-slate-800">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No assignments found. Click above to create one.
                      </td>
                    </tr>
                  ) : (
                    assignments.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-bold text-slate-100">{item.title}</td>
                        <td className="p-4 text-slate-400">{item.course?.title || "N/A"}</td>
                        <td className="p-4">{new Date(item.dueDate).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-amber-400">{item.totalMarks}</td>
                        <td className="p-4 capitalize text-slate-400">{item.type}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublish(item._id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                              item.isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleOpenGrading(item._id)}
                            className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500 text-amber-400 font-bold rounded-xl transition flex items-center gap-1 ml-auto"
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
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400">Select Assignment to Grade:</label>
            <select
              value={selectedAssignmentId || ""}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="" disabled>-- Select Assignment --</option>
              {assignments.map((a) => (
                // <option key={a._id} value={a._id}>
                //   {a.title} ({a.course?.title || "General"})
                // </option>
              ))}
            </select>
          </div>

          {selectedAssignmentId ? (
            <AssignmentAdminGrading assignmentId={selectedAssignmentId} />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500">
              Please select an assignment from the dropdown above to view student submissions.
            </div>
          )}
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="text-amber-400 w-5 h-5" /> Create Assignment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              {/* Select Course */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Select Course *</label>
                <select
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-400 focus:outline-none"
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
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React Hooks Project"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Description / Questions */}
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Instructions & Questions *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear instructions and questions for students..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Due Date & Submission Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Due Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Submission Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="both">Text + File URL</option>
                    <option value="written">Text Response Only</option>
                    <option value="file">File Upload Only</option>
                  </select>
                </div>
              </div>

              {/* Total & Passing Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Passing Marks</label>
                  <input
                    type="number"
                    value={formData.passingMarks}
                    onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Publish Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded"
                />
                <span className="text-slate-300">Publish Immediately to Students</span>
              </label>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition flex items-center gap-2"
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