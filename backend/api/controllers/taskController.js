import Task from "../models/Task.js";

// @desc    Get all pending/upcoming tasks
// @route   GET /api/tasks
// @access  Private (Student & Admin)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ dueDate: { $gte: new Date() } })
      .populate("course", "title")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, description, type, dueDate, course } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: "Title and due date are required" });
    }

    const task = await Task.create({
      title,
      description,
      type,
      dueDate,
      course: course || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};