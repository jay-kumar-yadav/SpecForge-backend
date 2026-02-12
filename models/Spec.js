const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const tasksGroupSchema = new mongoose.Schema(
  {
    frontend: { type: [taskSchema], default: [] },
    backend: { type: [taskSchema], default: [] },
    database: { type: [taskSchema], default: [] },
    testing: { type: [taskSchema], default: [] },
    devops: { type: [taskSchema], default: [] },
  },
  { _id: false }
);

const specSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    goal: { type: String, required: [true, "Goal is required"] },
    users: { type: [String], default: [] },
    constraints: { type: String, default: "" },
    templateType: {
      type: String,
      enum: ["Web App", "Mobile App", "Internal Tool", "API Service"],
      default: "Web App",
    },
    complexity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    userStories: { type: [String], default: [] },
    tasks: {
      type: tasksGroupSchema,
      default: () => ({}),
    },
    risks: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false, versionKey: false },
    toObject: { virtuals: false, versionKey: false },
  }
);

specSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Spec", specSchema);
