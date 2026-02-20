const mongoose = require("mongoose");
const { checkLlmConnection, isLlmConfigured } = require("../utils/llmService");

async function health(req, res) {
  const backend = { ok: true, message: "API is running" };

  let database = { ok: false, message: "Unknown" };
  try {
    const state = mongoose.connection.readyState;
    database = state === 1
      ? { ok: true, message: "Connected" }
      : { ok: false, message: state === 0 ? "Disconnected" : state === 2 ? "Connecting" : "Disconnecting" };
  } catch (err) {
    database = { ok: false, message: err.message || "Error" };
  }

  let llm = { ok: false, configured: isLlmConfigured(), message: "" };
  if (isLlmConfigured()) {
    const result = await checkLlmConnection();
    llm = { ...result, configured: true };
  } else {
    llm.message = "GROQ_API_KEY not set – using template fallback";
  }

  const overall = backend.ok && database.ok && (llm.ok || !llm.configured);

  res.status(overall ? 200 : 503).json({
    success: true,
    data: {
      overall: overall ? "healthy" : "degraded",
      backend,
      database,
      llm,
      version: "1.0.0",
    },
  });
}

module.exports = { health };
