const { body, validationResult } = require("express-validator");
const Spec = require("../models/Spec");
const { generateSpecData } = require("../utils/generateSpecData");

const VALID_TEMPLATES = ["Web App", "Mobile App", "Internal Tool", "API Service"];
const VALID_COMPLEXITY = ["Low", "Medium", "High"];

function sanitize(str, maxLen = 500) {
  if (str == null) return "";
  const s = String(str).trim().slice(0, maxLen);
  return s;
}

function sanitizeArray(arr, maxItems = 50, maxItemLen = 200) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, maxItems).map((x) => sanitize(x, maxItemLen)).filter(Boolean);
}

async function generateSpec(req, res, next) {
  try {
    const { title, goal, users, constraints, templateType, complexity } = req.body;

    const t = sanitize(title, 200);
    const g = sanitize(goal, 2000);

    if (!t) {
      return res.status(400).json({
        success: false,
        message: "Title is required and cannot be empty.",
      });
    }
    if (!g) {
      return res.status(400).json({
        success: false,
        message: "Goal is required and cannot be empty.",
      });
    }

    const usersArr = Array.isArray(users) ? users : users ? [String(users).trim()] : [];
    const template = VALID_TEMPLATES.includes(templateType) ? templateType : "Web App";
    const compl = VALID_COMPLEXITY.includes(complexity) ? complexity : "Medium";

    const input = {
      title: t,
      goal: g,
      users: usersArr.filter(Boolean),
      constraints: sanitize(constraints, 2000),
      templateType: template,
      complexity: compl,
    };

    const spec = await generateSpecData(input);
    res.status(200).json({ success: true, data: spec });
  } catch (err) {
    next(err);
  }
}

const createSpecValidation = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 200 }),
  body("goal").trim().notEmpty().withMessage("Goal is required").isLength({ max: 2000 }),
  body("constraints").optional().trim().isLength({ max: 2000 }),
  body("templateType").optional().isIn(VALID_TEMPLATES),
  body("complexity").optional().isIn(VALID_COMPLEXITY),
];

async function createSpec(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(" "),
      });
    }

    const { title, goal, users, constraints, templateType, complexity, userStories, tasks, risks } = req.body;

    const payload = {
      createdBy: req.userId,
      title: sanitize(title, 200),
      goal: sanitize(goal, 2000),
      users: sanitizeArray(users, 20),
      constraints: sanitize(constraints, 2000),
      templateType: VALID_TEMPLATES.includes(templateType) ? templateType : "Web App",
      complexity: VALID_COMPLEXITY.includes(complexity) ? complexity : "Medium",
      userStories: sanitizeArray(userStories, 20, 500),
      risks: sanitizeArray(risks, 20, 500),
    };

    if (tasks && typeof tasks === "object") {
      const taskGroups = ["frontend", "backend", "database", "testing", "devops"];
      payload.tasks = {};
      for (const key of taskGroups) {
        const arr = tasks[key];
        if (Array.isArray(arr)) {
          payload.tasks[key] = arr.slice(0, 50).map((t) => ({
            text: sanitize(t?.text ?? t, 500),
            completed: Boolean(t?.completed),
          }));
        } else {
          payload.tasks[key] = [];
        }
      }
    }

    const spec = await Spec.create(payload);
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
    const specs = await Spec.find({ createdBy: req.userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: specs });
  } catch (err) {
    next(err);
  }
}

async function getSpec(req, res, next) {
  try {
    const spec = await Spec.findOne({ _id: req.params.id, createdBy: req.userId }).lean();

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
    const spec = await Spec.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });

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
  createSpecValidation,
  listSpecs,
  getSpec,
  deleteSpec,
};
