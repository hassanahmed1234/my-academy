import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CoursePlayer from "./pages/CoursePlayer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; // Import Public Route
import About from "./pages/About";
import Contact from "./pages/Contact";
import DashboardLayout from "./components/DashboardLayout";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/Profile";
import QuizApp from "./pages/QuizApp";
import AssignmentStudent from "./pages/AssignmentStudent";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-islamic-bg text-islamic-text flex flex-col justify-between">
        <Routes>
          {/* Dashboard Pages with Nested Layout */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/quizzes" element={<QuizApp />} />
              <Route path="/assignments" element={<AssignmentStudent />} />
            </Route>
          </Route>

          {/* Admin Protected Route */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route
              path="/admin/dashboard"
              element={
                <div className="flex flex-col min-h-screen justify-between">
                  <Navbar />
                  <main className="flex-1">
                    <AdminDashboard />
                  </main>
                  <Footer />
                </div>
              }
            />
          </Route>

          {/* Student Protected Route - Course Player */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/course/:id/player" element={<CoursePlayer />} />
          </Route>

          {/* Regular Pages */}
          <Route
            path="*"
            element={
              <div className="flex flex-col min-h-screen justify-between">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/course/:id" element={<CourseDetail />} />

                  {/* PUBLIC ROUTES (Logged in user yahan access nahi kar sakta) */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>




                </Routes>
                <Footer />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;