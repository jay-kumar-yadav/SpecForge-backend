const Groq = require("groq-sdk");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_TEMPERATURE = parseFloat(process.env.GROQ_TEMPERATURE) || 0.6;
const GROQ_MAX_TOKENS = parseInt(process.env.GROQ_MAX_TOKENS, 10) || 4096;
const GROQ_MAX_RETRIES = parseInt(process.env.GROQ_MAX_RETRIES, 10) || 2;

const TASK_GROUPS = ["frontend", "backend", "database", "testing", "devops"];

function buildPrompt(input) {
  const users = input.users?.length ? input.users.join(", ") : "user";
  const constraints = input.constraints || "None specified";

  return `You are a product spec writer. Generate a structured product specification in JSON format.

Input:
- Title: ${input.title}
- Goal: ${input.goal}
- Target Users: ${users}
- Template Type: ${input.templateType}
- Complexity: ${input.complexity}
- Constraints: ${constraints}

Return a valid JSON object with exactly this structure (no markdown, no code blocks):
{
  "title": "string",
  "goal": "string",
  "userStories": ["As a X, I want to Y so that Z", ...],
  "tasks": {
    "frontend": ["task 1", "task 2", ...],
    "backend": ["task 1", ...],
    "database": ["task 1", ...],
    "testing": ["task 1", ...],
    "devops": ["task 1", ...]
  },
  "risks": ["risk 1", "risk 2", "risk 3"]
}

Requirements:
- Generate 4-6 user stories in "As a X, I want to Y so that Z" format.
- Generate 3-8 concrete tasks per category (more for High complexity, fewer for Low).
- Generate 3-5 specific risks relevant to this product.
- All values must be strings. Tasks arrays can be empty for categories that don't apply (e.g. frontend for API Service).
- Return ONLY valid JSON.`;
}

function parseJsonFromResponse(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  let jsonStr = trimmed;
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
  try {
    return JSON.parse(jsonStr);
  } catch {
    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}") + 1;
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(jsonStr.slice(start, end));
      } catch {
        return null;
      }
    }
  }
  return null;
}

function normalizeLlmSpec(raw, input) {
  const tasks = {};
  for (const key of TASK_GROUPS) {
    const arr = raw.tasks?.[key];
    tasks[key] = Array.isArray(arr)
      ? arr.map((t) => ({ text: String(t?.text ?? t ?? "").trim() || "Task", completed: false }))
      : [];
  }

  const userStories = Array.isArray(raw.userStories)
    ? raw.userStories.map((s) => String(s ?? "").trim()).filter(Boolean)
    : [];

  const risks = Array.isArray(raw.risks)
    ? raw.risks.map((r) => String(r ?? "").trim()).filter(Boolean)
    : [];

  return {
    title: String(raw.title ?? input.title ?? "Untitled Spec").trim() || "Untitled Spec",
    goal: String(raw.goal ?? input.goal ?? "").trim() || input.goal || "",
    users: Array.isArray(input.users) ? input.users : input.users ? [String(input.users)] : [],
    constraints: input.constraints || "",
    templateType: input.templateType || "Web App",
    complexity: input.complexity || "Medium",
    userStories:
      userStories.length > 0
        ? userStories
        : [
            `As a ${input.users?.join(", ") || "user"}, I want to ${(input.goal || "").toLowerCase()} so that I can accomplish my goals efficiently.`,
          ],
    tasks,
    risks:
      risks.length > 0 ? risks : ["Scope creep – recommend phased delivery.", "Integration complexity – plan discovery sprints."],
  };
}

async function generateSpecWithLlm(input) {
  if (!GROQ_API_KEY) return null;

  const client = new Groq({ apiKey: GROQ_API_KEY });
  const prompt = buildPrompt(input);
  let lastErr;

  for (let attempt = 0; attempt <= GROQ_MAX_RETRIES; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: GROQ_MAX_TOKENS,
        temperature: GROQ_TEMPERATURE,
      });

      const content = response.choices?.[0]?.message?.content;
      const parsed = parseJsonFromResponse(content);
      if (!parsed) continue;
      return normalizeLlmSpec(parsed, input);
    } catch (err) {
      lastErr = err;
      console.error(`LLM attempt ${attempt + 1} failed:`, err.message);
      if (attempt < GROQ_MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  console.error("LLM generation failed after retries:", lastErr?.message);
  return null;
}

async function checkLlmConnection() {
  if (!GROQ_API_KEY) return { ok: false, message: "GROQ_API_KEY not configured" };
  try {
    const client = new Groq({ apiKey: GROQ_API_KEY });
    await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 1,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err.message || "Connection failed" };
  }
}

function isLlmConfigured() {
  return !!GROQ_API_KEY;
}

module.exports = {
  generateSpecWithLlm,
  checkLlmConnection,
  isLlmConfigured,
};
