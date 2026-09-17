import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Lock,
  Shield,
  Save,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
  Camera,
  KeyRound,
} from "lucide-react";

const Profile = () => {
  const { profileData, fetchProfile, updateProfile, uploadAvatar, changePassword } = useAuth();

  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
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
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setFormData(data);
      } catch (err) {
        setStatusMessage({
          type: "error",
          text: err.message || "Failed to load profile.",
        });
      }
    };

    loadProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profileData.data) {
      setFormData(profileData.data);
    }
  }, [profileData.data]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ type: "error", text: "File size must be less than 5MB." });
      return;
    }

    setUploadingImg(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const newAvatarUrl = await uploadAvatar(file);
      if (newAvatarUrl) {
        setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
        setStatusMessage({ type: "success", text: "Profile picture updated!" });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: typeof error === "string" ? error : "Image upload failed. Please try again.",
      });
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatusMessage({ type: "", text: "" });

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        avatar: formData.avatar,
      });

      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: typeof error === "string" ? error : "Failed to update profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setStatusMessage({ type: "error", text: "All password fields are required!" });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setStatusMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    setPassUpdating(true);

    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setStatusMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: typeof error === "string" ? error : "Failed to update password.",
      });
    } finally {
      setPassUpdating(false);
    }
  };

  if (profileData.loading && !profileData.isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-amber-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold tracking-wider text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {statusMessage.text && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold border ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
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
        <div className="relative bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* AVATAR BOX WITH CAMERA OVERLAY */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 p-1 shadow-lg shadow-amber-500/10 overflow-hidden">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                ) : (
                  <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-5xl font-black text-amber-600 uppercase">
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
                className="absolute inset-0 bg-slate-900/60 rounded-3xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-white"
              >
                {uploadingImg ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 capitalize">
                    {formData.name || "User Name"}
                  </h1>
                  <p className="text-amber-600 font-semibold text-xs tracking-wider uppercase mt-0.5">
                    {formData.role}
                  </p>
                </div>

                {activeTab === "overview" && (
                  <button
                    onClick={() => {
                      setIsEditing(!isEditing);
                      setStatusMessage({ type: "", text: "" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                  </button>
                )}
              </div>

              <p className="text-slate-600 text-xs md:text-sm max-w-2xl leading-relaxed">
                {formData.bio || "No bio added yet."}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>{formData.email}</span>
                </div>
                {formData.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>{formData.location}</span>
                  </div>
                )}
                {formData.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <a
                      href={formData.website.startsWith("http") ? formData.website : `https://${formData.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-amber-600 transition"
                    >
                      {formData.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="border-b border-slate-200 flex gap-6 text-xs font-bold tracking-wide">
          <button
            onClick={() => {
              setActiveTab("overview");
              setStatusMessage({ type: "", text: "" });
            }}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "overview"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => {
              setActiveTab("security");
              setStatusMessage({ type: "", text: "" });
            }}
            className={`pb-3 transition relative cursor-pointer ${
              activeTab === "security"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* TAB 1: PERSONAL DETAILS */}
        {activeTab === "overview" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmitProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border text-xs text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-amber-400 focus:border-amber-500 focus:bg-white"
                          : "border-slate-200 opacity-70 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Email Address (Read-only)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-slate-100 border border-slate-200 opacity-80 text-xs text-slate-600 rounded-xl pl-10 pr-4 py-3 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="phone"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className={`w-full bg-slate-50 border text-xs text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-amber-400 focus:border-amber-500 focus:bg-white"
                          : "border-slate-200 opacity-70 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="location"
                      disabled={!isEditing}
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Karachi, Pakistan"
                      className={`w-full bg-slate-50 border text-xs text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none transition ${
                        isEditing
                          ? "border-amber-400 focus:border-amber-500 focus:bg-white"
                          : "border-slate-200 opacity-70 cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us something about yourself..."
                  className={`w-full bg-slate-50 border text-xs text-slate-800 rounded-xl p-4 outline-none transition ${
                    isEditing
                      ? "border-amber-400 focus:border-amber-500 focus:bg-white"
                      : "border-slate-200 opacity-70 cursor-not-allowed"
                  }`}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{updating ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 2: SECURITY & CHANGE PASSWORD */}
        {activeTab === "security" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
                <p className="text-xs text-slate-500">
                  Ensure your account is using a strong and secure password.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitPassword} className="space-y-5 max-w-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passUpdating}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {passUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>{passUpdating ? "Updating Password..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;