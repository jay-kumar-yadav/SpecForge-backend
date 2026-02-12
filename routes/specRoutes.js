const express = require("express");
const {
  generateSpec,
  createSpec,
  listSpecs,
  getSpec,
  deleteSpec,
} = require("../controllers/specController");

const router = express.Router();

router.post("/generate", generateSpec);
router.post("/spec", createSpec);
router.get("/specs", listSpecs);
router.get("/spec/:id", getSpec);
router.delete("/spec/:id", deleteSpec);

module.exports = router;
