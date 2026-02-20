# AI Notes

## What AI Was Used For

- **Spec generation**: The core feature. User input (title, goal, template type, complexity) is sent to Groq Cloud's Llama model to produce user stories, tasks by category (frontend, backend, database, testing, devOps), and risks. The model returns structured JSON; we parse and normalize it, with a template-based fallback if the LLM fails or the API key is missing.
- **Code assistance**: Some boilerplate (validation helpers, health controller, status page layout) was written with AI assistance.
- **Documentation**: README and PROMPTS_USED.md structure were drafted with AI help.

## What Was Checked Manually

- API integration: Verified that `generateSpec`, `saveSpec`, and health endpoint work with the frontend.
- LLM response handling: Confirmed parsing of JSON from the model, including edge cases (extra text, markdown code blocks).
- Input validation: Manually tested empty title/goal, very long strings, invalid template/complexity values.
- Status page: Verified backend, database, and LLM status display and that the page works when the backend is down.
- Routing: Tested Home → App → Status navigation.

## Which LLM and Provider

**Provider**: Groq Cloud  
**Model**: `llama-3.3-70b-versatile` (configurable via `GROQ_MODEL` env var)

**Why Groq**:
- Free tier with fast inference.
- `response_format: { type: "json_object" }` for structured output.
- Low latency; good for product spec generation.
- API key from [console.groq.com](https://console.groq.com).

## Fallback Behavior

If `GROQ_API_KEY` is not set or the LLM call fails, the app uses pre-defined templates (Web App, Mobile App, Internal Tool, API Service) to generate specs. The Status page shows whether the LLM is configured and reachable.
