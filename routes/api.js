import express from "express";
const router = express.Router();
import Mentor from "../models/mentor.js";
import Student from "../models/student.js";

// 1. Creating a Mentor
router.post("/mentors", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.json(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 2. Creating a Student
router.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 3. Assign a Student to a Mentor
router.post("/assign-student/:mentorId", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const student = await Student.findById(req.body.studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).send("Student or Mentor not found");
    }

    student.mentor = mentorId;
    mentor.students.push(student._id);
    await student.save();
    await mentor.save();
    res.json(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 3. Creating a route to assign one or more students to a mentor
router.post("/assign-students-to-mentor/:mentorId", async (req, res) => {
  const { mentorId } = req.params;
  const { studentIds } = req.body;

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).send("Mentor not found");
    }

    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);
      if (!student) {
        continue;
      }

      student.mentor = mentorId;
      mentor.students.push(studentId);

      await student.save();
    }

    await mentor.save();

    res.json(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 4. Creating a route to assign or change a mentor for a student
router.put("/assign-mentor-to-student/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const { mentorId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    if (mentorId) {
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
        return res.status(404).send("Mentor not found");
      }

      student.mentor = mentorId;
      await student.save();
    } else {
      student.mentor = null;
      await student.save();
    }

    res.json(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 5. Creating a route to get all students assigned to a mentor
router.get("/students-for-mentor/:mentorId", async (req, res) => {
  const { mentorId } = req.params;

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).send("Mentor not found");
    }

    const students = await Student.find({ mentor: mentorId });
    res.json(students);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 6. Creating a route to get the previously assigned mentor for a student
router.get("/previous-mentor-for-student/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    const mentorId = student.mentor;
    if (!mentorId) {
      return res.send("No previous mentor assigned");
    }

    const mentor = await Mentor.findById(mentorId);
    res.json(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
