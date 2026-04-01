import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration: Number,
    targetField: { type: String, default: "Software" },
    sections: [
      {
        name: String,
        category: String,
        questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
