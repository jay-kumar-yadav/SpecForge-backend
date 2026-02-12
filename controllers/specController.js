const Spec = require("../models/Spec");
const { generateSpecData } = require("../utils/generateSpecData");

async function generateSpec(req, res, next) {
  try {
    const { title, goal, users, constraints, templateType, complexity } = req.body;

    if (!title?.trim() || !goal?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and goal are required.",
      });
    }

    const input = {
      title: title.trim(),
      goal: goal.trim(),
      users: Array.isArray(users) ? users : users ? [String(users).trim()] : [],
      constraints: constraints?.trim() ?? "",
      templateType: templateType || "Web App",
      complexity: complexity || "Medium",
    };

    const spec = generateSpecData(input);
    res.status(200).json({ success: true, data: spec });
  } catch (err) {
    next(err);
  }
}

async function createSpec(req, res, next) {
  try {
    const { title, goal } = req.body;

    if (!title?.trim() || !goal?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and goal are required.",
      });
    }

    const spec = await Spec.create(req.body);
    res.status(201).json({ success: true, data: spec });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }
    next(err);
  }
}

async function listSpecs(req, res, next) {
  try {
    const specs = await Spec.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: specs });
  } catch (err) {
    next(err);
  }
}

async function getSpec(req, res, next) {
  try {
    const spec = await Spec.findById(req.params.id).lean();

    if (!spec) {
      return res.status(404).json({
        success: false,
        message: "Spec not found.",
      });
    }

    res.status(200).json({ success: true, data: spec });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid spec ID." });
    }
    next(err);
  }
}

async function deleteSpec(req, res, next) {
  try {
    const spec = await Spec.findByIdAndDelete(req.params.id);

    if (!spec) {
      return res.status(404).json({
        success: false,
        message: "Spec not found.",
      });
    }

    res.status(200).json({ success: true, message: "Spec deleted." });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid spec ID." });
    }
    next(err);
  }
}

module.exports = {
  generateSpec,
  createSpec,
  listSpecs,
  getSpec,
  deleteSpec,
};
