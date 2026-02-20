const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  generateSpec,
  createSpec,
  createSpecValidation,
  listSpecs,
  getSpec,
  deleteSpec,
} = require("../controllers/specController");
const { health } = require("../controllers/healthController");

const router = express.Router();

router.get("/health", health);

router.use(authMiddleware);

router.post("/generate", generateSpec);
router.post("/spec", createSpecValidation, createSpec);
router.get("/specs", listSpecs);
router.get("/spec/:id", getSpec);
router.delete("/spec/:id", deleteSpec);

module.exports = router;
