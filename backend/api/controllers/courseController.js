import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    // .lean() adds performance & returns plain JS object without Mongoose metadata
    const course = await Course.findById(req.params.id).lean();

    if (course) {
      return res.status(200).json({data:course});
    } else {
      return res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: error.message || "Failed to fetch course details" 
    });
  }
};

export const createCourse = async (req, res) => {
  const { title, arabicTitle, category, description, instructor, isFree, price, image, modules } = req.body;

  try {
    const course = new Course({
      title,
      arabicTitle,
      category,
      description,
      instructor,
      isFree,
      price,
      image,
      modules,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};