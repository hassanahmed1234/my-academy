import Assignment from "../models/Assignment.js";
import AssignmentSubmission from "../models/AssignmentSubmission.js";

// ================= ADMIN CONTROLLERS =================

// Create Assignment
export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment", error: error.message });
  }
};

// Get All Assignments (Admin)
export const getAllAdminAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("course", "title")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
};

// Toggle Publish Status
export const togglePublishAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.isPublished = !assignment.isPublished;
    await assignment.save();
    res.json({ success: true, isPublished: assignment.isPublished });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

// Get Submissions List for Grading
export const getSubmissionsForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
      .populate("student", "name email avatar")
      .sort({ updatedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
};

// Grade Submission
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback, requiresResubmission } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId).populate("assignment");
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    const total = submission.assignment.totalMarks;
    const passing = submission.assignment.passingMarks;

    submission.marksObtained = marksObtained;
    submission.percentage = Math.round((marksObtained / total) * 100);
    submission.isPassed = marksObtained >= passing;
    submission.feedback = feedback;
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    if (requiresResubmission) {
      submission.status = "resubmit_required";
    } else {
      submission.status = "graded";
    }

    await submission.save();
    res.json({ success: true, message: "Graded successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Error grading submission", error: error.message });
  }
};


// ================= STUDENT CONTROLLERS =================

// Get Available Assignments for Student
export const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ isPublished: true })
      .populate("course", "title")
      .sort({ dueDate: 1 });

    const studentSubmissions = await AssignmentSubmission.find({
      student: req.user._id,
    });

    const mappedAssignments = assignments.map((assign) => {
      const sub = studentSubmissions.find(
        (s) => s.assignment.toString() === assign._id.toString()
      );
      
      let computedStatus = "pending";
      if (sub) {
        computedStatus = sub.status;
      } else if (new Date() > new Date(assign.dueDate)) {
        computedStatus = "overdue";
      }

      return {
        ...assign.toObject(),
        submission: sub || null,
        status: computedStatus,
      };
    });

    res.json(mappedAssignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student assignments", error: error.message });
  }
};

// Get Single Assignment Detail with Draft/Submission Status
export const getStudentAssignmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).populate("course", "title");
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submission = await AssignmentSubmission.findOne({
      assignment: id,
      student: req.user._id,
    });

    res.json({ assignment, submission });
  } catch (error) {
    res.status(500).json({ message: "Error fetching details", error: error.message });
  }
};

// Save Draft or Final Submit
export const saveOrSubmitAssignment = async (req, res) => {
  try {
    const { id } = req.params; // assignmentId
    const { writtenAnswers, textResponse, fileUrl, fileName, isFinalSubmit } = req.body;
    const userId = req.user._id;

    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    let submission = await AssignmentSubmission.findOne({
      assignment: id,
      student: userId,
    });

    const isLate = new Date() > new Date(assignment.dueDate);

    if (isLate && !assignment.allowLateSubmission && isFinalSubmit) {
      return res.status(400).json({ message: "Submissions closed. Late submission not allowed." });
    }

    if (!submission) {
      submission = new AssignmentSubmission({
        assignment: id,
        student: userId,
        attemptNumber: 1,
      });
    }

    // If Resubmit requested previously and submitting again
    if (isFinalSubmit && submission.status === "resubmit_required") {
      // Archive current to history
      submission.history.push({
        attemptNumber: submission.attemptNumber,
        writtenAnswers: submission.writtenAnswers,
        textResponse: submission.textResponse,
        fileUrl: submission.fileUrl,
        submittedAt: submission.submittedAt,
        marksObtained: submission.marksObtained,
        feedback: submission.feedback,
      });
      submission.attemptNumber += 1;
    }

    // Update Fields
    if (writtenAnswers) submission.writtenAnswers = writtenAnswers;
    if (textResponse !== undefined) submission.textResponse = textResponse;
    if (fileUrl !== undefined) submission.fileUrl = fileUrl;
    if (fileName !== undefined) submission.fileName = fileName;

    if (isFinalSubmit) {
      submission.status = isLate ? "late" : "submitted";
      submission.submittedAt = new Date();
      submission.isLate = isLate;
    } else {
      submission.status = "draft";
    }

    await submission.save();

    res.json({
      success: true,
      message: isFinalSubmit ? "Assignment submitted successfully!" : "Draft saved successfully!",
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to process submission", error: error.message });
  }
};