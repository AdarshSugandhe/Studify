import express from "express";
import Student from "../models/Student.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();


// GET own profile
router.get("/me", auth, role(["student"]), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE own profile
router.put("/me", auth, role(["student"]), async (req, res) => {
  try {
    // only allow safe fields
    const { name, email, course } = req.body;

    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      { $set: { name, email, course } },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list students
router.get("/", auth, role(["admin"]), async (req, res) => {
  const students = await Student.find().sort({ enrolledAt: -1 });
  res.json(students);
});

// Admin: add student
router.post("/", auth, role(["admin"]), async (req, res) => {
  const { name, email, course } = req.body;
  const user = await User.create({ email, passwordHash: await bcrypt.hash("changeme", 10), role: "student", isVerified: true });
  const student = await Student.create({ name, email, course, user: user._id });
  res.json(student);
});

// Admin: update student
router.put("/:id", auth, role(["admin"]), async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
});

// Admin: delete student
router.delete("/:id", auth, role(["admin"]), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  await User.findByIdAndDelete(req.params.id)
  res.json({ success: true });
});


export default router;
