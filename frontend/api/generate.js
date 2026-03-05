export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { tool, input } = req.body || {};
    if (!tool || !input) {
      return res.status(400).json({ error: "Missing tool or input" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "The server is out of tokens. Please try again later." });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = buildPrompt(tool, input);

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return res.status(200).json({ text });
    } catch (apiError) {
      if (apiError.message.includes("quota exceeded")) {
        return res.status(500).json({ error: "The server is out of tokens. Please try again later." });
      }
      throw apiError;
    }
  } catch (err) {
    console.error("API ERROR:", err);

    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
}

function buildPrompt(tool, input) {
  const base =
    `You are a senior product manager helping analyze product problems and propose structured solutions. ` +
    `Always respond with clearly structured sections, concise bullet points, and practical product thinking. ` +
    `Include: Assumptions, Risks, Success Metrics, Next Steps.\n\n`;

  switch (tool) {
    case "prd":
      return (
        base +
        `TASK: Generate a PRD.\n` +
        `OUTPUT SECTIONS:\n` +
        `1) Problem\n2) Context\n3) Goals\n4) Non-goals\n5) Personas/JTBD\n` +
        `6) User Stories\n7) Requirements\n8) Acceptance Criteria\n` +
        `9) Metrics\n10) Risks & Mitigations\n11) Rollout Plan\n\n` +
        `INPUT:\n${input}`
      );

    case "hypothesis":
      return (
        base +
        `TASK: Validate a product hypothesis.\n` +
        `OUTPUT SECTIONS:\n` +
        `1) Hypothesis Restatement\n2) Key Assumptions\n3) Validation Plan\n` +
        `4) Experiments (MVP + A/B)\n5) Metrics & Thresholds\n` +
        `6) Instrumentation Events\n7) Risks/Confounders\n8) Next Steps\n\n` +
        `INPUT:\n${input}`
      );

    case "kpi":
      return (
        base +
        `TASK: Write an exec-ready KPI narrative.\n` +
        `OUTPUT SECTIONS:\n` +
        `1) Exec Summary (max 5 bullets)\n2) What changed\n3) Likely drivers (hypotheses)\n` +
        `4) Risks\n5) Recommended actions\n6) Questions to answer next\n\n` +
        `INPUT:\n${input}`
      );

    case "feedback":
      return (
        base +
        `TASK: Theme and prioritize user feedback.\n` +
        `OUTPUT SECTIONS:\n` +
        `1) Themes\n2) Representative quotes (short)\n3) Sentiment\n` +
        `4) Impact vs Effort (suggested)\n5) Proposed Epics\n6) Next Steps\n\n` +
        `INPUT:\n${input}`
      );

    default:
      return base + `TASK: General PM assistance.\nINPUT:\n${input}`;
  }
}