import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [activeTool, setActiveTool] = useState("json");
  const [darkMode, setDarkMode] = useState(false);

  const tools = [
    { id: "json", icon: "🔄", name: "JSON Formatter" },
    { id: "password", icon: "🔐", name: "Password Generator" },
    { id: "base64", icon: "🔤", name: "Base64 Encoder" },
    { id: "url", icon: "🔗", name: "URL Encoder" },
    { id: "timestamp", icon: "⏱️", name: "Timestamp Converter" },
  ];

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="navbar">
        <div className="logo">
          <span>🧰</span>
          <div>
            <h1>DevToolBox</h1>
            <p>Open-source developer utilities</p>
          </div>
        </div>

        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <main className="container">
        <section className="hero">
          <span className="badge">OPEN SOURCE • FREE</span>

          <h2>Simple tools for developers.</h2>

          <p>
            A collection of fast, useful and privacy-friendly developer
            utilities. No signup. No tracking.
          </p>
        </section>

        <div className="layout">
          <aside className="sidebar">
            <h3>TOOLS</h3>

            {tools.map((tool) => (
              <button
                key={tool.id}
                className={
                  activeTool === tool.id
                    ? "tool-button active"
                    : "tool-button"
                }
                onClick={() => setActiveTool(tool.id)}
              >
                <span>{tool.icon}</span>
                {tool.name}
              </button>
            ))}
          </aside>

          <section className="workspace">
            {activeTool === "json" && <JsonFormatter />}
            {activeTool === "password" && <PasswordGenerator />}
            {activeTool === "base64" && <Base64Tool />}
            {activeTool === "url" && <UrlTool />}
            {activeTool === "timestamp" && <TimestampTool />}
          </section>
        </div>
      </main>

      <footer>
        <p>Built with ❤️ by the open-source community • DevToolBox</p>
      </footer>
    </div>
  );
}

function CopyButton({ value, successText = "Copied!" }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopied(true);

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }

    resetTimer.current = setTimeout(() => {
      setCopied(false);
      resetTimer.current = null;
    }, 1600);
  };

  return (
    <button onClick={handleCopy} aria-live="polite">
      {copied ? successText : "Copy"}
    </button>
  );
}

/* JSON FORMATTER */

function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON. Please check your syntax.");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON. Please check your syntax.");
    }
  };

  return (
    <ToolCard
      title="JSON Formatter"
      description="Format or minify JSON instantly in your browser."
    >
      <textarea
        placeholder='Paste JSON here... Example: {"name":"DevToolBox"}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="button-row">
        <button onClick={formatJson}>Format JSON</button>

        <button onClick={minifyJson} className="secondary">
          Minify
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {output && (
        <div className="output-box">
          <div className="output-header">
            <strong>Result</strong>
            <CopyButton value={output} />
          </div>

          <pre>{output}</pre>
        </div>
      )}
    </ToolCard>
  );
}

/* PASSWORD GENERATOR */

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setPassword(result);
  };

  return (
    <ToolCard
      title="Password Generator"
      description="Generate a random password directly in your browser."
    >
      <div className="range-container">
        <label>
          Password length: <strong>{length}</strong>
        </label>

        <input
          type="range"
          min="6"
          max="40"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />
      </div>

      <button onClick={generatePassword}>Generate Password</button>

      {password && (
        <div className="password-result">
          <code>{password}</code>
          <CopyButton value={password} />
        </div>
      )}
    </ToolCard>
  );
}

/* BASE64 */

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");

  const processText = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput("Invalid input.");
    }
  };

  return (
    <ToolCard
      title="Base64 Encoder / Decoder"
      description="Encode or decode Base64 text locally."
    >
      <div className="button-row">
        <button
          onClick={() => setMode("encode")}
          className={mode === "encode" ? "" : "secondary"}
        >
          Encode
        </button>

        <button
          onClick={() => setMode("decode")}
          className={mode === "decode" ? "" : "secondary"}
        >
          Decode
        </button>
      </div>

      <textarea
        placeholder="Enter text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={processText}>Process</button>

      {output && (
        <div className="output-box">
          <pre>{output}</pre>
        </div>
      )}
    </ToolCard>
  );
}

/* URL */

function UrlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");

  const processUrl = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput("Invalid URL encoded text.");
    }
  };

  return (
    <ToolCard
      title="URL Encoder / Decoder"
      description="Encode or decode URL components."
    >
      <div className="button-row">
        <button
          onClick={() => setMode("encode")}
          className={mode === "encode" ? "" : "secondary"}
        >
          Encode
        </button>

        <button
          onClick={() => setMode("decode")}
          className={mode === "decode" ? "" : "secondary"}
        >
          Decode
        </button>
      </div>

      <textarea
        placeholder="Enter URL text..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={processUrl}>Process</button>

      {output && (
        <div className="output-box">
          <pre>{output}</pre>
        </div>
      )}
    </ToolCard>
  );
}

/* TIMESTAMP */

function TimestampTool() {
  const [timestamp, setTimestamp] = useState("");
  const [date, setDate] = useState("");

  const timestampToDate = () => {
    const value = Number(timestamp);

    if (!Number.isFinite(value)) {
      setDate("Invalid timestamp");
      return;
    }

    setDate(new Date(value * 1000).toLocaleString());
  };

  const currentTimestamp = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
    setDate(new Date().toLocaleString());
  };

  return (
    <ToolCard
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps into readable dates."
    >
      <input
        type="number"
        placeholder="Enter Unix timestamp..."
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
      />

      <div className="button-row">
        <button onClick={timestampToDate}>Convert</button>

        <button onClick={currentTimestamp} className="secondary">
          Current Time
        </button>
      </div>

      {date && (
        <div className="timestamp-result">
          <strong>{date}</strong>
        </div>
      )}
    </ToolCard>
  );
}

/* TOOL CARD */

function ToolCard({ title, description, children }) {
  return (
    <div className="tool-card">
      <div className="tool-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="tool-content">{children}</div>
    </div>
  );
}

export default App;
