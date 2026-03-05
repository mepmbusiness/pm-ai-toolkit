import { useState } from "react";
import "./App.css";

const tools = [
  { id: "prd", name: "PRD Generator" },
  { id: "hypothesis", name: "Hypothesis Validator" },
  { id: "kpi", name: "KPI Narrator" },
  { id: "feedback", name: "Feedback Analyzer" },
];

const examplePrompts = {
  prd: "Create a PRD for a feature that allows users to save favorite products in an e-commerce app.",
  hypothesis: "Hypothesis: adding onboarding tooltips will increase feature adoption by 20%.",
  kpi: "Daily active users dropped from 50k to 40k this week. Analyze possible causes.",
  feedback: "Users complain that the checkout process is confusing. Analyze themes.",
};

export default function App() {
  const [tool, setTool] = useState("prd");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState(".");

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");

    // Start a loading animation
    const loadingInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tool, input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setOutput(data.text);
    } catch (error) {
      console.error("Failed to generate output:", error);
      setOutput(`An error occurred: ${error.message}`);
    } finally {
      clearInterval(loadingInterval); // Stop the loading animation
      setLoading(false);
    }
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      alert("Output copied to clipboard!");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>PM AI Toolkit</h1>
      <p>Interactive Product Manager AI tools</p>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            style={{
              padding: "10px",
              background: tool === t.id ? "#000" : "#ddd",
              color: tool === t.id ? "white" : "black",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <textarea
          rows="8"
          style={{ width: "100%", padding: "10px" }}
          placeholder="Enter your input..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setInput(examplePrompts[tool])}
            style={{ padding: "10px", background: "#eee", border: "1px solid #ccc", cursor: "pointer" }}
          >
            Use Example Prompt
          </button>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "12px 20px",
          background: loading ? "#555" : "black",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? `Generating${loadingDots}` : "Generate"}
      </button>

      <h2 style={{ marginTop: "40px" }}>Output</h2>

      {loading && (
        <p style={{ fontStyle: "italic", color: "#555" }}>Generating insights in real-time, please wait...</p>
      )}

      <pre style={{ background: "#f4f4f4", padding: "20px", whiteSpace: "pre-wrap", border: "1px solid #ddd", borderRadius: "5px" }}>{output}</pre>

      {output && (
        <button
          onClick={handleCopyOutput}
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#eee",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Copy Output
        </button>
      )}
    </div>
  );
}