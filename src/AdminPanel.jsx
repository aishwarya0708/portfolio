import { useState } from "react";
import { DEFAULT_CONTENT } from "./App";

const ADMIN_PASSWORD = "pipeline2026";

export default function AdminPanel({ content, setContent }) {
  const [authed, setAuthed]       = useState(false);
  const [pw, setPw]               = useState("");
  const [pwError, setPwError]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus]       = useState(null);
  const [parsed, setParsed]       = useState(null);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatus("Reading resume...");

    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Read failed"));
        r.readAsDataURL(file);
      });

      setStatus("Parsing with Claude...");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "document",
                source: { type: "base64", media_type: "application/pdf", data: base64 }
              },
              {
                type: "text",
                text: `Extract structured data from this resume and return ONLY valid JSON with this exact structure, no markdown, no preamble:
{
  "name": "full name",
  "email": "email",
  "phone": "phone",
  "linkedin": "linkedin url or empty string",
  "github": "github url or empty string",
  "tagline": "a 3-line poetic tagline based on their background, use \\n between lines",
  "summary": "one sentence professional summary",
  "education": [{"school":"","degree":"","gpa":"","period":"","location":"","courses":""}],
  "experience": [{"company":"","role":"","period":"","location":"","bullets":["bullet1","bullet2"]}],
  "skills": {"Category Name": ["skill1","skill2"]},
  "certifications": [{"name":"","issuer":"","year":""}]
}`
              }
            ]
          }]
        })
      });

      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(clean);
      setParsed(parsedData);
      setStatus("✓ Resume parsed successfully. Review below and click Apply.");
    } catch (err) {
      setStatus("⚠ Parse failed — check console. You can manually edit fields.");
      console.error(err);
    }
    setUploading(false);
  };

  const applyContent = () => {
    if (parsed) {
      setContent({ ...DEFAULT_CONTENT, ...parsed });
      setStatus("✓ Portfolio updated! Visit / to see changes.");
    }
  };

  const resetContent = () => {
    setContent(DEFAULT_CONTENT);
    setParsed(null);
    setStatus("✓ Reset to default resume.");
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-logo">⬡</span>
            <h1>Admin Panel</h1>
            <p>The Pipeline — Portfolio CMS</p>
          </div>
          <input
            type="password"
            className="admin-input"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          {pwError && <span className="admin-error">Incorrect password</span>}
          <button className="admin-btn-primary" onClick={login}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-logo">⬡</span>
          <span>Admin</span>
        </div>
        <nav className="admin-nav">
          <span className="admin-nav-item active">Resume Upload</span>
          <a href="/" className="admin-nav-item" target="_blank" rel="noreferrer">View Portfolio →</a>
        </nav>
        <button className="admin-btn-ghost" onClick={resetContent}>Reset to Default</button>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h2>Resume Upload</h2>
          <p>Upload a tailored resume PDF → portfolio auto-populates (skills, experience, education, summary). Projects stay fixed.</p>
        </div>

        <div className="admin-upload-zone">
          <input type="file" accept=".pdf" id="resume-upload" onChange={handleFile} style={{display:"none"}} />
          <label htmlFor="resume-upload" className="upload-label">
            <span className="upload-icon">📄</span>
            <span className="upload-text">Drop resume PDF here or click to browse</span>
            <span className="upload-hint">PDF only · Claude will parse it automatically</span>
          </label>
        </div>

        {status && (
          <div className={`admin-status ${status.startsWith("✓") ? "success" : status.startsWith("⚠") ? "error" : "info"}`}>
            {uploading && <span className="admin-spinner" />}
            {status}
          </div>
        )}

        {parsed && (
          <div className="parsed-preview">
            <div className="parsed-header">
              <h3>Parsed Content Preview</h3>
              <button className="admin-btn-primary" onClick={applyContent}>Apply to Portfolio →</button>
            </div>
            <div className="parsed-grid">
              <div className="parsed-field">
                <span className="parsed-label">Name</span>
                <span className="parsed-value">{parsed.name}</span>
              </div>
              <div className="parsed-field">
                <span className="parsed-label">Email</span>
                <span className="parsed-value">{parsed.email}</span>
              </div>
              <div className="parsed-field">
                <span className="parsed-label">Tagline</span>
                <span className="parsed-value" style={{whiteSpace:"pre-line"}}>{parsed.tagline}</span>
              </div>
              <div className="parsed-field">
                <span className="parsed-label">Summary</span>
                <span className="parsed-value">{parsed.summary}</span>
              </div>
              <div className="parsed-field">
                <span className="parsed-label">Experience</span>
                <span className="parsed-value">{parsed.experience?.map(e => `${e.role} @ ${e.company}`).join(" · ")}</span>
              </div>
              <div className="parsed-field">
                <span className="parsed-label">Skills</span>
                <span className="parsed-value">{Object.keys(parsed.skills || {}).join(" · ")}</span>
              </div>
              <div className="parsed-field">
                <span className="parsed-label">Certifications</span>
                <span className="parsed-value">{parsed.certifications?.map(c => c.name).join(" · ") || "None"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="admin-tip">
          <span className="admin-tip-label">HOW IT WORKS</span>
          <ol>
            <li>Tailor your resume for a specific company (Teradyne, Capital One, etc.)</li>
            <li>Upload the PDF here → Claude extracts all content automatically</li>
            <li>Click "Apply to Portfolio" → INGEST, TRANSFORM, LOAD stages update instantly</li>
            <li>Share the company-themed link: <code>aishwarya.dev/teradyne</code></li>
            <li>Projects section always stays fixed — it's your permanent showcase</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
