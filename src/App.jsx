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
    { id: "color", icon: "🎨", name: "Color Converter" },
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
            {activeTool === "color" && <ColorConverter />}
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


/* COLOR CONVERTER UTILITIES */

const PRESET_COLORS = [
  { name: "Indigo", hex: "#6366f1" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Dark", hex: "#1e1e2e" },
  { name: "Light", hex: "#ffffff" },
];

function parseHex(hex) {
  if (!hex || typeof hex !== "string") return null;
  const cleanHex = hex.trim().replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) return null;

  let r, g, b;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  }
  return { r, g, b };
}

function parseRgb(rgb) {
  if (!rgb || typeof rgb !== "string") return null;
  const match = rgb
    .trim()
    .match(/^(?:rgb\s*\()?\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})\s*\)?$/i);
  if (!match) return null;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  if (r > 255 || g > 255 || b > 255) return null;
  return { r, g, b };
}

function parseHsl(hsl) {
  if (!hsl || typeof hsl !== "string") return null;
  const match = hsl
    .trim()
    .match(
      /^(?:hsl\s*\()?\s*(\d{1,3})(?:deg)?[\s,]+(\d{1,3})%?[\s,]+(\d{1,3})%?\s*\)?$/i
    );
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  if (h > 360 || s > 100 || l > 100) return null;
  return hslToRgb(h, s, l);
}

function rgbToHex(r, g, b) {
  const toHex = (n) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === rNorm) {
      h = 60 * (((gNorm - bNorm) / delta) % 6);
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / delta + 2);
    } else {
      h = 60 * ((rNorm - gNorm) / delta + 4);
    }
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c;
    gPrime = x;
    bPrime = 0;
  } else if (h >= 60 && h < 120) {
    rPrime = x;
    gPrime = c;
    bPrime = 0;
  } else if (h >= 120 && h < 180) {
    rPrime = 0;
    gPrime = c;
    bPrime = x;
  } else if (h >= 180 && h < 240) {
    rPrime = 0;
    gPrime = x;
    bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x;
    gPrime = 0;
    bPrime = c;
  } else if (h >= 300 && h <= 360) {
    rPrime = c;
    gPrime = 0;
    bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

/* COLOR CONVERTER */

function ColorConverter() {
  const [hexInput, setHexInput] = useState("#6366f1");
  const [rgbInput, setRgbInput] = useState("rgb(99, 102, 241)");
  const [hslInput, setHslInput] = useState("hsl(239, 84%, 67%)");
  const [colorRgb, setColorRgb] = useState({ r: 99, g: 102,b: 241 });
  const [error, setError] = useState("");

  const updateFromRgb = (rgb, updatedHex = null, updatedHsl = null) => {
    setColorRgb(rgb);
    const hex = updatedHex ?? rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hslStr = updatedHsl ?? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    setHexInput(hex);
    setRgbInput(rgbStr);
    setHslInput(hslStr);
    setError("");
  };

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    const parsed = parseHex(val);
    if (parsed) {
      setColorRgb(parsed);
      const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
      setRgbInput(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
      setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      setError("");
    } else {
      setError("Please enter a valid HEX code (e.g. #6366f1 or 6366f1)");
    }
  };

  const handleRgbChange = (e) => {
    const val = e.target.value;
    setRgbInput(val);
    const parsed = parseRgb(val);
    if (parsed) {
      setColorRgb(parsed);
      const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
      const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
      setHexInput(hex);
      setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      setError("");
    } else {
      setError("Please enter a valid RGB format (e.g. rgb(99, 102, 241) or 99, 102, 241)");
    }
  };

  const handleHslChange = (e) => {
    const val = e.target.value;
    setHslInput(val);
    const parsed = parseHsl(val);
    if (parsed) {
      setColorRgb(parsed);
      const hex = rgbToHex(parsed.r, parsed.g, parsed.b);
      setHexInput(hex);
      setRgbInput(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
      setError("");
    } else {
      setError("Please enter a valid HSL format (e.g. hsl(239, 84%, 67%) or 239, 84%, 67%)");
    }
  };

  const handlePickerChange = (e) => {
    const val = e.target.value;
    const parsed = parseHex(val);
    if (parsed) {
      updateFromRgb(parsed, val);
    }
  };

  const handlePresetClick = (hex) => {
    const parsed = parseHex(hex);
    if (parsed) {
      updateFromRgb(parsed, hex);
    }
  };

  const activeHex = rgbToHex(colorRgb.r, colorRgb.g, colorRgb.b);
  const activeHsl = rgbToHsl(colorRgb.r, colorRgb.g, colorRgb.b);

  return (
    <ToolCard
      title="Color Converter"
      description="Convert colors between HEX, RGB, and HSL formats in real-time."
    >
      <div className="color-preview-card">
        <div
          className="color-swatch"
          style={{ backgroundColor: activeHex }}
        >
          <label className="color-picker-label" title="Click to pick a color">
            <input
              type="color"
              className="color-picker-input"
              value={activeHex}
              onChange={handlePickerChange}
              aria-label="Color picker"
            />
            <span className="color-picker-badge">🎨 Pick</span>
          </label>
        </div>

        <div className="color-preview-info">
          <div className="color-preview-meta">
            <span className="color-preview-name">{activeHex.toUpperCase()}</span>
            <span className="color-preview-sub">
              rgb({colorRgb.r}, {colorRgb.g}, {colorRgb.b}) • hsl({activeHsl.h}, {activeHsl.s}%, {activeHsl.l}%)
            </span>
          </div>
          <div className="color-presets">
            <span className="presets-label">Presets:</span>
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                className="color-preset-chip"
                style={{ backgroundColor: preset.hex }}
                title={`${preset.name} (${preset.hex})`}
                onClick={() => handlePresetClick(preset.hex)}
                aria-label={`Select ${preset.name} preset`}
              />
            ))}
          </div>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="color-formats-list">
        {/* HEX */}
        <div className="color-format-row">
          <div className="format-header">
            <span className="format-badge">HEX</span>
            <span className="format-desc">Hexadecimal color code</span>
          </div>
          <div className="format-input-group">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#6366f1"
              spellCheck="false"
              className="color-text-input"
            />
            <CopyButton value={hexInput} />
          </div>
        </div>

        {/* RGB */}
        <div className="color-format-row">
          <div className="format-header">
            <span className="format-badge">RGB</span>
            <span className="format-desc">Red, Green, Blue (0-255)</span>
          </div>
          <div className="format-input-group">
            <input
              type="text"
              value={rgbInput}
              onChange={handleRgbChange}
              placeholder="rgb(99, 102, 241)"
              spellCheck="false"
              className="color-text-input"
            />
            <CopyButton value={rgbInput} />
          </div>
        </div>

        {/* HSL */}
        <div className="color-format-row">
          <div className="format-header">
            <span className="format-badge">HSL</span>
            <span className="format-desc">Hue (0-360°), Saturation (0-100%), Lightness (0-100%)</span>
          </div>
          <div className="format-input-group">
            <input
              type="text"
              value={hslInput}
              onChange={handleHslChange}
              placeholder="hsl(239, 84%, 67%)"
              spellCheck="false"
              className="color-text-input"
            />
            <CopyButton value={hslInput} />
          </div>
        </div>
      </div>
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
