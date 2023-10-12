import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
});

const Student = mongoose.model("Student", StudentSchema);

export default Student;
