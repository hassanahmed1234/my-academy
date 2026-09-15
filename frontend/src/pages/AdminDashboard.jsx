import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
  Plus,
  BookOpen,
  Video,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  ExternalLink,
  Trash2,
  CheckSquare,
  Megaphone,
  Edit,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Clock,
  Award,
  RotateCcw,
  Eye,
  Loader2,
  X,
  Check,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "react-router-dom";


const AdminQuizBuilder = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuizForBank, setSelectedQuizForBank] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Quiz Form State
  const [quizForm, setQuizForm] = useState({
    title: "",
    course: "",
    module: "Module 1",
    type: "practice",
    questionCount: 10,
    timeLimit: 10,
    passingScore: 70,
    attemptsAllowed: 2,
  });

  // Question Form State
  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
  });

  const fetchQuizzesAndCourses = async () => {
    try {
      setLoading(true);
      const [resQuizzes, resCourses] = await Promise.all([
        API.get("/quizzes"),
        API.get("/courses"),
      ]);
      setQuizzes(resQuizzes.data);
      setCourses(resCourses.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzesAndCourses();
  }, []);

  // Handle Quiz Creation
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/quizzes", quizForm);
      setShowQuizModal(false);
      setQuizForm({
        title: "",
        course: "",
        module: "Module 1",
        type: "practice",
        questionCount: 10,
        timeLimit: 10,
        passingScore: 70,
        attemptsAllowed: 2,
      });
      fetchQuizzesAndCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating quiz.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (quiz) => {
    try {
      await API.put(`/quizzes/${quiz._id}`, {
        isPublished: !quiz.isPublished,
      });
      fetchQuizzesAndCourses();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure? This will delete the quiz and all associated questions.")) return;
    try {
      await API.delete(`/admin/quizzes/${quizId}`);
      fetchQuizzesAndCourses();
    } catch (err) {
      console.error(err);
    }
  };

  // Load Questions for Question Bank
  const handleOpenQuestionBank = async (quiz) => {
    setSelectedQuizForBank(quiz);
    try {
      setLoading(true);
      const res = await API.get(`/quizzes/${quiz._id}/questions`);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Option Change inside Question Form
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionForm.options];
    updatedOptions[index] = value;
    setQuestionForm({ ...questionForm, options: updatedOptions });
  };

  // Save Question to Bank
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.correctAnswer) {
      alert("Please select the correct option!");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/quizzes/questions", {
        ...questionForm,
        quizId: selectedQuizForBank._id,
      });
      setQuestions([...questions, res.data]);
      setQuestionForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
      });
    } catch (err) {
      alert("Failed to add question.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Question from Bank
  const handleDeleteQuestion = async (questionId) => {
    try {
      await API.delete(`/questions/${questionId}`);
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-slate-50 text-slate-800 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="font-arabic text-xl text-amber-600 font-semibold">إدارة الاختبارات</span>
          <h1 className="text-2xl font-black text-slate-900">Quiz & Question Bank Builder</h1>
          <p className="text-xs text-slate-500">Create assessment exams and manage randomized question banks.</p>
        </div>
        <button
          onClick={() => setShowQuizModal(true)}
          className="px-4 py-2 bg-[#006644] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#004d33] transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create New Quiz
        </button>
      </div>

      {/* QUIZ LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                <span>{quiz.type} Exam</span>
                <span className={`px-2 py-0.5 rounded font-semibold ${quiz.isPublished ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  {quiz.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{quiz.title}</h3>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Pull: {quiz.questionCount} Qs</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {quiz.timeLimit} Mins</span>
                <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-slate-400" /> Pass: {quiz.passingScore}%</span>
                <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Limits: {quiz.attemptsAllowed}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenQuestionBank(quiz)}
                className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-500 hover:text-white transition flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" /> Question Bank
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePublish(quiz)}
                  title="Toggle Publish"
                  className="p-2 text-slate-400 hover:text-slate-700 transition"
                >
                  {quiz.isPublished ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-amber-500" />}
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  className="p-2 text-rose-500 hover:text-rose-700 transition"
                  title="Delete Quiz"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE QUIZ MODAL */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Configure New Assessment</h3>
              <button onClick={() => setShowQuizModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Quiz Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Tajweed Rules - Module 1 Quiz"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-slate-700">Select Course</label>
                  <select
                    required
                    value={quizForm.course}
                    onChange={(e) => setQuizForm({ ...quizForm, course: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Choose Course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-slate-700">Exam Type</label>
                  <select
                    value={quizForm.type}
                    onChange={(e) => setQuizForm({ ...quizForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="practice">Practice Quiz</option>
                    <option value="final">Final Exam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-slate-700">Questions to Serve</label>
                  <input
                    type="number"
                    value={quizForm.questionCount}
                    onChange={(e) => setQuizForm({ ...quizForm, questionCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-slate-700">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    value={quizForm.timeLimit}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimit: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-slate-700">Passing Score (%)</label>
                  <input
                    type="number"
                    value={quizForm.passingScore}
                    onChange={(e) => setQuizForm({ ...quizForm, passingScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-slate-700">Attempts Limit</label>
                  <input
                    type="number"
                    value={quizForm.attemptsAllowed}
                    onChange={(e) => setQuizForm({ ...quizForm, attemptsAllowed: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#006644] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#004d33] transition"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUESTION BANK DRAWER / MODAL */}
      {selectedQuizForBank && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end z-50">
          <div className="bg-white border-l border-slate-200 w-full max-w-2xl h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedQuizForBank.title}</h2>
                <p className="text-xs text-slate-500">Manage Question Bank ({questions.length} Total Questions)</p>
              </div>
              <button onClick={() => setSelectedQuizForBank(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {/* ADD QUESTION FORM */}
            <form onSubmit={handleAddQuestion} className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-4 text-xs">
              <h3 className="font-bold text-sm text-amber-600">Add Question to Bank</h3>

              <div>
                <label className="block mb-1 font-semibold text-slate-700">Question Text</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter the question..."
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Options (Select radio for correct option)</label>
                {questionForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={questionForm.correctAnswer === opt && opt !== ""}
                      onChange={() => setQuestionForm({ ...questionForm, correctAnswer: opt })}
                      className="accent-[#006644] h-4 w-4"
                    />
                    <input
                      required
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-700">Explanation (Optional)</label>
                <input
                  type="text"
                  placeholder="Explanation shown during review..."
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />} Add Question to Bank
              </button>
            </form>

            {/* EXISTING QUESTIONS LIST */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Configured Questions ({questions.length})</h3>
              {questions.map((q, idx) => (
                <div key={q._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-bold text-slate-800">Q{idx + 1}: {q.question}</p>
                    <button onClick={() => handleDeleteQuestion(q._id)} className="text-rose-500 hover:text-rose-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-slate-600">
                    {q.options.map((opt, oIdx) => (
                      <span
                        key={oIdx}
                        className={`p-1.5 rounded border ${opt === q.correctAnswer
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                            : "bg-white border-slate-200"
                          }`}
                      >
                        {opt} {opt === q.correctAnswer && "✓"}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Real Database States
  const [stats, setStats] = useState({
    students: 0,
    coursesCount: 0,
    revenue: "Rs. 0",
  });

  // Modals Visibility
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Forms State
  const [courseForm, setCourseForm] = useState({
    title: "",
    arabicTitle: "",
    category: "Seerah",
    instructor: "",
    description: "",
    image: "",
    price: 0,
  });

  const [liveForm, setLiveForm] = useState({
    title: "",
    course: "",
    scholarName: "",
    meetingUrl: "",
    scheduledAt: "",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "Normal",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load Real Data from Backend APIs
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes, sessionsRes, tasksRes, announcementsRes] = await Promise.all([
        API.get("/admin/stats").catch(() => ({ data: null })),
        API.get("/courses").catch(() => ({ data: [] })),
        API.get("/live-sessions").catch(() => ({ data: [] })),
        API.get("/tasks").catch(() => ({ data: [] })),
        API.get("/announcements").catch(() => ({ data: [] })),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data.stats || {});
      }

      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data?.courses || []);
      setLiveSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : sessionsRes.data?.sessions || []);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : tasksRes.data?.tasks || []);
      setAnnouncements(Array.isArray(announcementsRes.data) ? announcementsRes.data : announcementsRes.data?.announcements || []);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  // Handlers
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/courses", courseForm);
      setMessage({ type: "success", text: "Course published successfully!" });
      setShowCourseModal(false);
      setCourseForm({ title: "", arabicTitle: "", category: "Seerah", instructor: "", description: "", image: "", price: 0 });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to publish course." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLiveSession = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/live-sessions", liveForm);
      setMessage({ type: "success", text: "Live session scheduled successfully!" });
      setShowLiveModal(false);
      setLiveForm({ title: "", course: "", scholarName: "", meetingUrl: "", scheduledAt: "" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to schedule live session." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/tasks", taskForm);
      setMessage({ type: "success", text: "Task created successfully!" });
      setShowTaskModal(false);
      setTaskForm({ title: "", description: "", dueDate: "", assignedTo: "" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create task." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/announcements", announcementForm);
      setMessage({ type: "success", text: "Announcement posted successfully!" });
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: "", content: "", priority: "Normal" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to post announcement." });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Actions
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${id}`);
      setMessage({ type: "success", text: "Course deleted successfully!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete course." });
    }
  };

  const handleDeleteLiveSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await API.delete(`/live-sessions/${id}`);
      setMessage({ type: "success", text: "Live session deleted successfully!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete live session." });
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setMessage({ type: "success", text: "Task removed!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete task." });
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await API.delete(`/announcements/${id}`);
      setMessage({ type: "success", text: "Announcement removed!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete announcement." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-slate-50 min-h-screen text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="font-arabic text-2xl text-amber-600 font-bold">
            لوحة التحكم
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Admin Management Portal
          </h1>
          <p className="text-xs text-slate-500">
            Live stats & management controls synced with database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCourseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>
          <button
            onClick={() => setShowLiveModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Video className="w-4 h-4" /> Live Class
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <CheckSquare className="w-4 h-4" /> New Task
          </button>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Megaphone className="w-4 h-4" /> Announcement
          </button>
          <NavLink
            to="/admin/assignment"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm"
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span>Assignments</span>
          </NavLink>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 text-xs rounded-xl font-semibold border ${message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Students</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {stats.students || 0}
            </h2>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Active Courses</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {courses.length}
            </h2>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Tasks</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {stats.tasks || 0}
            </h2>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Live Sessions */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Live Broadcasts</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {stats.liveSessions || 0}
            </h2>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <Video className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === "overview"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          <TrendingUp className="w-4 h-4" /> Overview & Operations
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === "courses"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          <BookOpen className="w-4 h-4" /> Courses Catalog ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("live")}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === "live"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          <Video className="w-4 h-4" /> Live Broadcasts ({liveSessions.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Management Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-sm text-slate-900">Administrative Tasks</h3>
                </div>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No pending tasks found.</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{task.title}</p>
                        <p className="text-slate-500 text-[11px]">{task.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-emerald-600" /> Assigned: {task.assignedTo || "Unassigned"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-rose-500 hover:text-rose-700 p-1 transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Announcements Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900">Portal Announcements</h3>
                </div>
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Post Announcement
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {announcements.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No announcements posted.</p>
                ) : (
                  announcements.map((ann) => (
                    <div
                      key={ann._id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-start text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${ann.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {ann.priority || "Normal"}
                          </span>
                          <p className="font-bold text-slate-800">{ann.title}</p>
                        </div>
                        <p className="text-slate-500 text-[11px]">{ann.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann._id)}
                        className="text-rose-500 hover:text-rose-700 p-1 transition"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Integrated Quiz Builder Sub-Section */}
          <div className="border-t border-slate-200 pt-6">
            <AdminQuizBuilder />
          </div>
        </div>
      )}

      {/* COURSES CATALOG TAB */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div key={course._id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                {course.image && (
                  <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-xl border border-slate-100" />
                )}
                <div className="flex justify-between items-center text-[10px] font-bold text-amber-600 uppercase">
                  <span>{course.category}</span>
                  <span className="font-arabic text-xs">{course.arabicTitle}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">
                  {course.price ? `Rs. ${course.price}` : "Free"}
                </span>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 transition"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIVE BROADCASTS TAB */}
      {activeTab === "live" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {liveSessions.map((session) => (
            <div key={session._id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                  <Video className="w-4 h-4 animate-pulse" /> Live Stream
                </div>
                <h3 className="font-bold text-base text-slate-900">{session.title}</h3>
                <p className="text-xs text-slate-500">Scholar: {session.scholarName}</p>
                <p className="text-[11px] text-amber-600 font-medium">
                  Scheduled: {session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : "TBD"}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={session.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-rose-600 hover:text-white transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Join Session
                </a>
                <button
                  onClick={() => handleDeleteLiveSession(session._id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 transition"
                  title="Delete Live Session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Add New Course</h3>
              <button onClick={() => setShowCourseModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <input required type="text" placeholder="Course Title" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              <input type="text" placeholder="Arabic Title" value={courseForm.arabicTitle} onChange={(e) => setCourseForm({ ...courseForm, arabicTitle: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-arabic text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              <textarea required placeholder="Course Description" rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE LIVE CLASS MODAL */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Schedule Live Class</h3>
              <button onClick={() => setShowLiveModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleCreateLiveSession} className="space-y-3 text-xs">
              <input required type="text" placeholder="Session Title" value={liveForm.title} onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              <input required type="text" placeholder="Scholar/Instructor Name" value={liveForm.scholarName} onChange={(e) => setLiveForm({ ...liveForm, scholarName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              <input required type="url" placeholder="Meeting URL (Zoom / Google Meet)" value={liveForm.meetingUrl} onChange={(e) => setLiveForm({ ...liveForm, meetingUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              <input required type="datetime-local" value={liveForm.scheduledAt} onChange={(e) => setLiveForm({ ...liveForm, scheduledAt: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowLiveModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Schedule Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Add Task</h3>
              <button onClick={() => setShowTaskModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <input required type="text" placeholder="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
              <textarea placeholder="Description" rows={2} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
              <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Post Announcement</h3>
              <button onClick={() => setShowAnnouncementModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <input required type="text" placeholder="Title" value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
              <textarea required placeholder="Content" rows={3} value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
              <select value={announcementForm.priority} onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                <option value="Normal">Normal Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;