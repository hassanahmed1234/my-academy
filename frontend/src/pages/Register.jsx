import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import { UserPlus, User, Mail, Lock, AlertCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/register", formData);

      if (response?.data?.status === 201 || response?.status === 201 || response?.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-slate-950">
      <div className="w-full max-w-md bg-islamic-card border border-islamic-border rounded-2xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="font-arabic text-3xl text-islamic-gold font-bold">أهلاً وسهلاً</h2>
          <h1 className="text-2xl font-extrabold text-islamic-text">Create Account</h1>
          <p className="text-xs text-islamic-muted">Join AcademyPro as a student or instructor.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-islamic-text mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-islamic-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Muhammad Ali"
                className="w-full bg-islamic-bg border border-islamic-border focus:border-islamic-primary rounded-xl py-2.5 pl-10 pr-4 text-xs text-islamic-text focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-islamic-text mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-islamic-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@example.com"
                className="w-full bg-islamic-bg border border-islamic-border focus:border-islamic-primary rounded-xl py-2.5 pl-10 pr-4 text-xs text-islamic-text focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-islamic-text mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-islamic-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-islamic-bg border border-islamic-border focus:border-islamic-primary rounded-xl py-2.5 pl-10 pr-4 text-xs text-islamic-text focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-islamic-gold hover:bg-amber-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? "Registering..." : <><UserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </form>

        <p className="text-center text-xs text-islamic-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-islamic-primary font-bold hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;