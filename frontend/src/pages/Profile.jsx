import React, { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  Clock,
  Edit3,
  CheckCircle2,
  Lock,
  Camera,
  Shield,
  Save,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passUpdating, setPassUpdating] = useState(false);

  // Status message state
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Profile data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    role: "",
    enrolledCourses: [],
  });

  // Password fields
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 1. FETCH PROFILE DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/users/profile");

        setFormData({
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          website: data.website || "",
          role: data.role || "Student",
          enrolledCourses: data.enrolledCourses || [],
        });
      } catch (error) {
        setStatusMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to load profile.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // 2. UPDATE PROFILE
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const { data } = await API.put("/users/profile", {
        fullName: formData.fullName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
      });

      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);

      if (data.user?.fullName) {
        localStorage.setItem("userName", data.user.fullName);
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  // 3. CHANGE PASSWORD
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    setPassUpdating(true);

    try {
      await API.put("/users/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setStatusMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setPassUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold tracking-wider text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* NOTIFICATION FEEDBACK BANNER */}
        {statusMessage.text && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold border ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
        
        {/* HEADER SECTION */}
        <div className="relative bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-2xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-6xl font-black text-amber-400 uppercase">
                  {formData.fullName ? formData.fullName.charAt(0) : "U"}
                </div>
              </div>
             
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    {formData.fullName || "User Name"}
                  </h1>
                  <p className="text-amber-400 font-medium text-xs tracking-wider uppercase mt-0.5">
                    {formData.role}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setStatusMessage({ type: "", text: "" });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                </button>
              </div>

              <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
                {formData.bio || "No bio added yet."}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-400/80" />
                  <span>{formData.email}</span>
                </div>
                {formData.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400/80" />
                    <span>{formData.location}</span>
                  </div>
                )}
                {formData.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-400/80" />
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-amber-400 transition"
                    >
                      {formData.website.replace("https://", "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{formData.enrolledCourses.length}</p>
              <p className="text-xs text-slate-400 font-medium">Enrolled Courses</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">0</p>
              <p className="text-xs text-slate-400 font-medium">Completed Lessons</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">0</p>
              <p className="text-xs text-slate-400 font-medium">Hours Spent</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">0</p>
              <p className="text-xs text-slate-400 font-medium">Certificates</p>
            </div>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="border-b border-slate-800 flex gap-6 text-xs font-bold tracking-wide">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "overview"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "courses"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            My Courses ({formData.enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "security"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* TAB 1: EDIT FORM */}
        {activeTab === "overview" && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmitProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="fullName"
                      disabled={!isEditing}
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full bg-slate-950 border text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-amber-500/50 focus:border-amber-500"
                          : "border-slate-800 opacity-70 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Email Address (Read-only)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-slate-950 border border-slate-800 opacity-60 text-xs text-white rounded-xl pl-10 pr-4 py-3 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="phone"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className={`w-full bg-slate-950 border text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-amber-500/50 focus:border-amber-500"
                          : "border-slate-800 opacity-70 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="location"
                      disabled={!isEditing}
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Karachi, Pakistan"
                      className={`w-full bg-slate-950 border text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-amber-500/50 focus:border-amber-500"
                          : "border-slate-800 opacity-70 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us something about yourself..."
                  className={`w-full bg-slate-950 border text-xs text-white rounded-xl p-4 outline-none transition ${
                    isEditing
                      ? "border-amber-500/50 focus:border-amber-500"
                      : "border-slate-800 opacity-70 cursor-not-allowed"
                  }`}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{updating ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 2: ENROLLED COURSES */}
        {activeTab === "courses" && (
          <div>
            {formData.enrolledCourses.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-amber-400/60" />
                <p className="text-sm font-semibold text-white">No Enrolled Courses Found</p>
                <p className="text-xs text-slate-500">
                  Explore available courses from the Browse section to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.enrolledCourses.map((course) => (
                  <div
                    key={course._id || course.id}
                    className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                        📚
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-snug">
                          {course.title || "Course Title"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Instructor: <span className="text-slate-300">{course.instructor || "Instructor"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PASSWORD CHANGE */}
        {activeTab === "security" && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 max-w-2xl">
            <div className="mb-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Change Password</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Keep your account secure by setting a strong password.
              </p>
            </div>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passUpdating}
                className="mt-4 flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {passUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{passUpdating ? "Updating..." : "Update Password"}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;