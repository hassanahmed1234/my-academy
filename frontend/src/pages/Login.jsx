import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", formData);

      // Extract User Profile and Token safely
      const userData = data.user || data;
      const token = data.token;

      // React Context state global level par update karein
      login(userData, token);

     

      // Role ke mutabiq redirection
      if (userData.role === "admin") {
         console.log(userData)
        navigate("/admin/dashboard");
         console.log(userData)
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-slate-950">
      <div className="w-full max-w-md bg-islamic-card border border-islamic-border rounded-2xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="font-arabic text-3xl text-islamic-gold font-bold">مرحباً بك</h2>
          <h1 className="text-2xl font-extrabold text-islamic-text">Welcome Back</h1>
          <p className="text-xs text-islamic-muted">Enter your credentials to access your portal.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full py-3 rounded-xl bg-islamic-primary hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10"
          >
            {loading ? "Logging in..." : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>
        </form>

        <p className="text-center text-xs text-islamic-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-islamic-primary font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;