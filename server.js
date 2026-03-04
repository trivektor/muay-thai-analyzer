// server.js — lightweight proxy for the Anthropic API
// Usage:
//   1. npm install express cors
//   2. Set your API key:  export ANTHROPIC_API_KEY=sk-ant-...
//   3. node server.js
//   4. Open http://localhost:3000 in your browser

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("\n❌  Missing API key. Run:\n\n  export ANTHROPIC_API_KEY=sk-ant-...\n  node server.js\n");
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: "100mb" }));

// Serve the HTML file
app.use(express.static(path.join(__dirname)));

// Proxy endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🥊 Muay Thai Analyzer running at http://localhost:${PORT}\n`);
});
