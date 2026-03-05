import { useState } from "react";
import "./App.css";

const tools = [
  { id: "prd", name: "PRD Generator" },
  { id: "hypothesis", name: "Hypothesis Validator" },
  { id: "kpi", name: "KPI Narrator" },
  { id: "feedback", name: "Feedback Analyzer" },
];

export default function App() {
  const [tool, setTool] = useState("prd");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>PM AI Toolkit</h1>
      <p>Interactive Product Manager AI tools</p>

      <div style={{ marginBottom: "20px" }}>
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            style={{
              marginRight: "10px",
              padding: "10px",
              background: tool === t.id ? "#000" : "#ddd",
              color: tool === t.id ? "white" : "black",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <textarea
        rows="8"
        style={{ width: "100%", padding: "10px" }}
        placeholder="Enter your input..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br />
      <br />

      <button
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Generate
      </button>

      <h2 style={{ marginTop: "40px" }}>Output</h2>

      <pre style={{ background: "#f4f4f4", padding: "20px" }}>{output}</pre>
    </div>
  );
}