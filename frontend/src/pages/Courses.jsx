import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance";
import { BookOpen, Search, Filter, ArrowRight, Loader2 } from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourses = async () => {
      try {
        const { data } = await API.get("/courses");
        setCourses(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = ["All", "Seerah", "Tafseer", "Tajweed", "Fiqh", "Arabic"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.arabicTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-wider">LOADING CATALOG...</p>
      </div>
    );
  }

  return (
    <main className="bg-slate-950 min-h-screen text-slate-200 overflow-hidden pt-12 pb-24 relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-2 space-y-3">
          <span className="font-serif text-3xl sm:text-4xl text-amber-400 font-bold block">
            المناهج الدراسية
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Course Catalog</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover verified Islamic curricula, structured modules, and self-paced learning pathways.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or Arabic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block mr-1" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === category
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-2xl text-center">
            {error}
          </div>
        )}

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800/80 rounded-3xl text-slate-400 space-y-3">
            <BookOpen className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
            <p className="text-sm font-semibold">No courses found matching your criteria.</p>
            <p className="text-xs text-slate-500">Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-amber-500/5"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={
                        course.image ||
                        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.category}
                    </span>

                    {/* Price Badge */}
                    {course.isFree ? (
                      <span className="absolute top-3 right-3 bg-emerald-500/90 border border-emerald-400/30 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                        FREE
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                        PKR {course.price}
                      </span>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-6 space-y-3">
                    {course.arabicTitle && (
                      <p className="font-serif text-xl text-amber-400 font-bold leading-tight">
                        {course.arabicTitle}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Instructor: <span className="text-slate-200 font-medium">{course.instructor || "Scholar"}</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2 bg-slate-950/40">
                  <span>{course.modules?.length || 0} Modules</span>
                  <Link
                    to={`/course/${course._id}`}
                    className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 transition-all"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Courses;