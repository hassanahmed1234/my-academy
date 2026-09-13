import React, { useState, useEffect, useRef } from "react";
import API from "../api/axiosInstance";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  Clock,
  Edit3,
  CheckCircle2,
  Lock,
  Shield,
  Save,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
  Camera,
} from "lucide-react";

const Profile = () => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [passUpdating, setPassUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    avatar: "",
    role: "student",
    enrolledCourses: [],
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/users/profile");

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          website: data.website || "",
          avatar: data.avatar || "",
          role: data.role || "student",
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

  // Avatar Upload Handler (FormData)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append("avatar", file);

    setUploadingImg(true);
    setStatusMessage({ type: "", text: "" });

    try {
      // Backend avatar upload route call
      const { data } = await API.post("/users/upload-avatar", imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({ ...prev, avatar: data.avatar || data.url }));
      setStatusMessage({ type: "success", text: "Profile picture updated!" });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Image upload failed.",
      });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const { data } = await API.put("/users/profile", {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        avatar: formData.avatar,
      });

      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      localStorage.setItem("userName", data.name || formData.name);
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

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
            {/* AVATAR BOX WITH CAMERA OVERLAY */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-2xl shadow-amber-500/20 overflow-hidden">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-5xl font-black text-amber-400 uppercase">
                    {formData.name ? formData.name.charAt(0) : "U"}
                  </div>
                )}
              </div>

              {/* Upload Input Overlay */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImg}
                className="absolute inset-0 bg-slate-950/70 rounded-3xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-amber-400"
              >
                {uploadingImg ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white capitalize">
                    {formData.name || "User Name"}
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
                      href={formData.website.startsWith("http") ? formData.website : `https://${formData.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-amber-400 transition"
                    >
                      {formData.website.replace(/^https?:\/\//, "")}
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

        {/* TAB 1: FORM DETAILS */}
        {activeTab === "overview" && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmitProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
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

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Avatar Image URL (Optional)</label>
                  <div className="relative">
                    <Camera className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="avatar"
                      disabled={!isEditing}
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="https://res.cloudinary.com/..."
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
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{updating ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 2 & TAB 3 REMAINS THE SAME */}
      </div>
    </div>
  );
};

export default Profile;