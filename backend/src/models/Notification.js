import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    type: {
      type: String,
      enum: ["system", "practice", "test", "interview", "achievement"],
      default: "system"
    },
    read: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      default: "/dashboard"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
