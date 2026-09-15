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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-slate-500 text-xs font-semibold tracking-wider">LOADING CATALOG...</p>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen text-slate-800 overflow-hidden pt-12 pb-24 relative font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-100/60 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-2 space-y-3">
          <span className="font-serif text-3xl sm:text-4xl text-emerald-700 font-bold block">
            المناهج الدراسية
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Explore <span className="text-emerald-600">Course Catalog</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Discover verified Islamic curricula, structured modules, and self-paced learning pathways.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-md shadow-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or Arabic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-3 pl-11 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block mr-1" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl text-slate-500 space-y-3 shadow-sm">
            <BookOpen className="w-12 h-12 mx-auto stroke-1 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">No courses found matching your criteria.</p>
            <p className="text-xs text-slate-500">Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={
                        course.image ||
                        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-slate-200 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {course.category}
                    </span>

                    {/* Price Badge */}
                    {course.isFree ? (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        FREE
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                        PKR {course.price}
                      </span>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-6 space-y-2">
                    {course.arabicTitle && (
                      <p className="font-serif text-xl text-emerald-700 font-bold leading-tight">
                        {course.arabicTitle}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Instructor: <span className="text-slate-700 font-medium">{course.instructor || "Scholar"}</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2 bg-slate-50/50">
                  <span>{course.modules?.length || 0} Modules</span>
                  <Link
                    to={`/course/${course._id}`}
                    className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1 transition-all"
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