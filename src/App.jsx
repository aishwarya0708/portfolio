import { useState, useEffect } from "react";
import { themes, COMPANY_LIST } from "./themes";
import AdminPanel from "./AdminPanel";
import profilePhoto from "./assets/photo.jpg";
import daesoLogo from "./assets/daeso-logo.jpeg";

const STAGES = [
  { id: "ingest",    label: "INGEST",    sub: "01 — Origin",      },
  { id: "transform", label: "TRANSFORM", sub: "02 — Processing",  },
  { id: "validate",  label: "VALIDATE",  sub: "03 — Quality Gate",},
  { id: "load",      label: "LOAD",      sub: "04 — Destination", },
];

// Default content populated from resume
export const DEFAULT_CONTENT = {
  name: "Aishwarya Vedaraman",
  email: "vedaraman.a@northeastern.edu",
  phone: "(617) 375-9277",
  linkedin: "https://linkedin.com/in/aishwarya-vedaraman-598b651b3",
  github: "https://github.com/aishwarya0708",
  tagline: "Building pipelines\nthat don't break\nat 3 AM.",
  summary: "MS Data Analytics Engineering @ Northeastern (4.0 GPA) · 3+ years at Mphasis as Senior Data Engineer & AI/ML CoE · SAFe 5 Practitioner certified · CPT authorized · Boston, MA",
  education: [
    {
      school: "Northeastern University",
      degree: "MS Data Analytics Engineering",
      gpa: "4.0 / 4.0",
      period: "Sep 2025 – May 2027",
      location: "Boston, MA",
      courses: "Machine Learning · MLOps · Statistical Learning · Data Mining · Data Engineering · Algorithms"
    },
    {
      school: "SASTRA University",
      degree: "BTech Electronics & Instrumentation Engineering",
      gpa: "7.9069 / 10",
      period: "Aug 2018 – May 2022",
      location: "Thanjavur, India",
      courses: ""
    }
  ],
  experience: [
    {
      company: "Mphasis Limited",
      role: "Senior Data Engineer & AI/ML CoE",
      period: "Jun 2024 – May 2025",
      location: "Chennai, India",
      bullets: [
        "Designed and executed test plans for data pipeline validation across FedEx international logistics systems; maintained test cases in Jira across 12 markets",
        "Developed automated test scripts using Selenium, Cucumber, and BDD frameworks — reduced manual QA effort by 40% and ensured quality across 12 markets",
        "Worked in SAFe Agile environment (SAFe 5 Practitioner certified) with cross-functional teams across India, US, and Europe",
        "Supported creation of manual and automated test suites achieving 99.9% pipeline uptime across international operations",
        "Identified compliance risk patterns and system anomalies through statistical analysis — presented findings to senior engineers and management",
        "Troubleshot and reproduced software issues in production pipelines; tracked bugs through resolution using Jira and VersionOne"
      ]
    },
    {
      company: "Mphasis Limited",
      role: "Data Engineer & AI/ML CoE",
      period: "Jun 2022 – Jun 2024",
      location: "Chennai, India",
      bullets: [
        "Built automated test frameworks using Selenium, Cucumber, and BDD; wrote test cases covering data ingestion, transformation logic, and output quality",
        "Developed Python test scripts for extraction, transformation, and validation on FedEx shipment datasets using strong OOP principles",
        "Supported Power BI dashboard development and KPI reporting; ensured accuracy of analytics delivered to Operations and Finance teams",
        "Collaborated with engineers and testers to develop rigorous test scenarios; tracked bugs using Jira and VersionOne in Agile/Scrum ceremonies"
      ]
    }
  ],
  skills: {
    "Test Automation":  ["Selenium", "Cucumber", "BDD", "pytest", "Python (OOP)", "Automated Test Scripts", "Regression Testing"],
    "QA & Quality":     ["Test Plan Design", "Jira", "Bug Tracking", "Defect Documentation", "Manual Test Suites", "CI/CD", "QE Process Improvement"],
    "Agile & SDLC":     ["SAFe Agilist (Certified)", "Agile/Scrum", "Sprint Planning", "Backlog Grooming", "Jenkins (familiar)", "Windows/Linux"],
    "Programming":      ["Python (Advanced)", "SQL", "JSON", "Shell Scripting", "Git", "GitHub", "Azure DevOps"],
    "Tools & Cloud":    ["Jira", "Docker", "GCP (BigQuery)", "AWS (S3, Glue)", "LangChain", "LangGraph", "Streamlit", "Power BI"]
  },
  certifications: [
    { name: "SAFe Agilist", issuer: "Scaled Agile", year: "2024" },
  ],
};

function getSlug() {
  const p = window.location.pathname.replace(/^\//, "").toLowerCase();
  if (p === "admin") return "admin";
  return p || "_base";
}

function getThemeFromSlug(slug) {
  return themes[slug] || themes["_base"];
}

export default function App() {
  const [theme, setTheme]                   = useState(() => getThemeFromSlug(getSlug()));
  const [activeStage, setActiveStage]       = useState("ingest");
  const [particles, setParticles]           = useState([]);
  const [transitioning, setTransitioning]   = useState(false);
  const [switcherOpen, setSwitcherOpen]     = useState(false);
  const [content, setContent]               = useState(DEFAULT_CONTENT);
  const [isAdmin, setIsAdmin]               = useState(getSlug() === "admin");

  const switchTheme = (slug) => {
    if (slug === getSlug()) { setSwitcherOpen(false); return; }
    setTransitioning(true);
    setTimeout(() => {
      window.history.pushState({}, "", slug === "_base" ? "/" : `/${slug}`);
      setTheme(getThemeFromSlug(slug));
      setTransitioning(false);
    }, 350);
    setSwitcherOpen(false);
  };

  useEffect(() => {
    const onPop = () => {
      const slug = getSlug();
      setIsAdmin(slug === "admin");
      setTheme(getThemeFromSlug(slug));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent",     theme.primaryColor);
    root.style.setProperty("--accent-dim", theme.primaryColor + "33");
    root.style.setProperty("--bg",         theme.bgColor);
    root.style.setProperty("--surface",    theme.surfaceColor);
    root.style.setProperty("--text",       theme.textColor);
    root.style.setProperty("--muted",      theme.mutedColor);
    document.title = `Aishwarya × ${theme.companyName}`;
  }, [theme]);

  useEffect(() => {
    setParticles(Array.from({ length: 18 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 3,
    })));
  }, []);

  if (isAdmin) return <AdminPanel content={content} setContent={setContent} />;

  return (
    <div className={`app ${transitioning ? "transitioning" : ""}`}>
      <div className={`theme-overlay ${transitioning ? "active" : ""}`} aria-hidden="true" />

      {/* Theme switcher */}
      <div className="switcher-fab">
        <button className="switcher-trigger" onClick={() => setSwitcherOpen(!switcherOpen)}>
          <span className="switcher-icon">{switcherOpen ? "✕" : "⬡"}</span>
          <span className="switcher-label">
            {theme.companyName === "Base" ? "THEME" : theme.companyName.toUpperCase()}
          </span>
        </button>
        {switcherOpen && (
          <div className="switcher-panel">
            <div className="switcher-panel-header"><span>SWITCH COMPANY THEME</span></div>
            <div className="switcher-grid">
              {COMPANY_LIST.map((c) => (
                <button key={c.slug} className={`switcher-item ${getSlug() === c.slug ? "active" : ""}`}
                  onClick={() => switchTheme(c.slug)} style={{"--item-accent": c.color}}>
                  <span className="switcher-item-dot" />
                  <span className="switcher-item-name">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recruiter Chatbot */}
      <RecruiterChat theme={theme} content={content} />

      {/* Particles */}
      <div className="particles" aria-hidden="true">
        {particles.map((p) => (
          <span key={p.id} className="particle" style={{
            left: `${p.x}%`, animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`, width: p.size, height: p.size,
          }} />
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="wordmark">
            <span className="wordmark-name">AISHWARYA</span>
            <span className="wordmark-dot" />
            <span className="wordmark-role">DATA ENGINEER · AI/ML</span>
          </div>
          {theme.companyName !== "Base" && (
            <div className="company-badge">
              <span className="badge-viewing">viewing for</span>
              <span className="badge-name" style={{ color: "var(--accent)" }}>{theme.companyName}</span>
            </div>
          )}
          <nav className="stage-nav">
            {STAGES.map((s) => (
              <button key={s.id} className={`nav-btn ${activeStage === s.id ? "active" : ""}`}
                onClick={() => setActiveStage(s.id)}>{s.label}</button>
            ))}
          </nav>
        </div>
      </header>

      {/* Pipeline track */}
      <div className="pipeline-track">
        {STAGES.map((s, i) => (
          <div key={s.id} className="pipeline-stage-wrapper">
            <button className={`stage-node ${activeStage === s.id ? "active" : ""}`}
              onClick={() => setActiveStage(s.id)}>
              <span className="node-index">0{i + 1}</span>
              <span className="node-label">{s.label}</span>
              <span className="node-sub">{s.sub}</span>
            </button>
            {i < STAGES.length - 1 && (
              <div className="pipeline-connector">
                <div className="connector-line" />
                <div className="connector-flow" />
              </div>
            )}
          </div>
        ))}
      </div>

      <main className="stage-content">
        {activeStage === "ingest"    && <IngestStage    theme={theme} content={content} />}
        {activeStage === "transform" && <TransformStage theme={theme} content={content} />}
        {activeStage === "validate"  && <ValidateStage  theme={theme} />}
        {activeStage === "load"      && <LoadStage       theme={theme} content={content} />}
      </main>

      <footer className="footer">
        <span className="footer-status"><span className="status-dot" /> PIPELINE ACTIVE</span>
        <span className="footer-meta">schema: aishwarya_v1 · rows_processed: ∞ · status: READY_TO_LOAD</span>
      </footer>
    </div>
  );
}

/* ── INGEST ─────────────────────────────────────────── */
function IngestStage({ theme, content }) {
  return (
    <section className="stage ingest-stage">
      <div className="ingest-hero">
        <div className="ingest-text">
          <span className="stage-tag">STAGE_01 / INGEST</span>
          <h1 className="stage-headline">
            {theme.heroTagline || content.tagline}
          </h1>
          <p className="stage-body">{content.summary}</p>
          <div className="cta-row">
            <a href={`mailto:${content.email}`} className="cta-primary">Hire Me →</a>
            <a href={content.linkedin} className="cta-secondary" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={content.github} className="cta-secondary" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>

        <div className="ingest-right">
          <div className="profile-photo-frame">
            <img src={profilePhoto} alt="Aishwarya Vedaraman" className="profile-photo" />
          </div>
          <div className="ingest-meta">
            <MetaCard label="GPA" value="4.0" unit="/ 4.0" />
            <MetaCard label="Experience" value="3+" unit="years" />
            <MetaCard label="Certified" value="SAFe" unit="Agilist" />
            <MetaCard label="Status" value="CPT" unit="authorized" />
          </div>
        </div>
      </div>

      {theme.brandPersonality && (
        <div className="brand-context">
          <span className="brand-context-label">context for {theme.companyName}</span>
          <p className="brand-context-text">{theme.brandPersonality}</p>
        </div>
      )}

      <div className="daeso-block">
        <img src={daesoLogo} alt="DAESO" className="daeso-logo" />
        <div>
          <span className="daeso-tag">DAESO</span>
          <p className="daeso-text">
            Data Analytics Engineering Student Organization — Northeastern University.
            Building community, industry connections, and technical depth for the next generation of data engineers.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── TRANSFORM ──────────────────────────────────────── */
function TransformStage({ theme, content }) {
  return (
    <section className="stage transform-stage">
      <span className="stage-tag">STAGE_02 / TRANSFORM</span>
      <h2 className="stage-headline-sm">Skills & Experience</h2>

      <div className="skills-grid">
        {Object.entries(content.skills).map(([cat, items]) => (
          <div key={cat} className="skill-group">
            <span className="skill-group-label">{cat}</span>
            <div className="skill-tags">
              {items.map((item) => (
                <span key={item} className={`skill-tag ${item.includes("familiar") || item.includes("learning") ? "learning" : ""}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-divider">
        <span>EXPERIENCE</span>
      </div>

      <div className="experience-block">
        {content.experience.map((exp, i) => (
          <div key={i} className="exp-card">
            <div className="exp-header">
              <div>
                <span className="exp-company">{exp.company}</span>
                <span className="exp-role">{exp.role}</span>
                <span className="exp-location">{exp.location}</span>
              </div>
              <span className="exp-period">{exp.period}</span>
            </div>
            <ul className="exp-bullets">
              {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="section-divider"><span>EDUCATION</span></div>
      <div className="experience-block">
        {content.education.map((ed, i) => (
          <div key={i} className="exp-card">
            <div className="exp-header">
              <div>
                <span className="exp-company">{ed.school}</span>
                <span className="exp-role">{ed.degree} · GPA: {ed.gpa}</span>
                {ed.courses && <span className="exp-location">{ed.courses}</span>}
              </div>
              <span className="exp-period">{ed.period}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-divider"><span>CERTIFICATIONS</span></div>
      <div className="cert-grid">
        {content.certifications.map((c, i) => (
          <div key={i} className="cert-card">
            <span className="cert-badge">✓</span>
            <div>
              <span className="cert-name">{c.name}</span>
              <span className="cert-meta">{c.issuer} · {c.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── VALIDATE ───────────────────────────────────────── */
function ValidateStage({ theme }) {
  const projects = [
    {
      name: "Pipeline Autopilot",
      tag: "MLOps · GCP · LangGraph · pytest",
      desc: "Automated QA & testing platform for ML pipelines. CI/CD failure prediction trained on 100K+ pipeline runs. LangGraph agent for root cause analysis. Deployed on GCP with BigQuery, Vertex AI, Cloud Run.",
      status: "LIVE",
      metric: "100K+ runs · 70/70 tests passing · Streamlit dashboard",
      link: "https://github.com/aishwarya0708",
    },
    {
      name: "AeroAssist",
      tag: "RAG · LangChain · NLP · Cohere",
      desc: "Aviation compliance assistant built with LangChain RAG and Cohere. Natural language queries over FAA documents, maintenance logs, and regulatory text. Built using the Cohere application framework.",
      status: "LIVE",
      metric: "RAG · Pinecone · Cohere API · Healthcare adjacent",
      link: "https://github.com/aishwarya0708/aeroassist",
    },
    {
      name: "Healthcare Analytics Platform",
      tag: "Python · Cohere · NLP · Data Engineering",
      desc: "End-to-end healthcare data pipeline built using the Cohere application. Processes patient records, extracts clinical insights using NLP, and surfaces anomalies through automated quality checks.",
      status: "LIVE",
      metric: "Cohere Application · NLP · Clinical data quality",
      link: "https://github.com/aishwarya0708",
    },
    {
      name: "Board Game Recommendation System",
      tag: "SVD · Content-based · Hybrid · Python",
      desc: "Hybrid recommendation engine using SVD collaborative filtering, content-based filtering, and a combined approach. Built for IE7275 Data Mining with MovieLens-scale board game dataset.",
      status: "LIVE",
      metric: "SVD · Cosine similarity · Hybrid ensemble",
      link: "https://github.com/aishwarya0708",
    },
  ];

  return (
    <section className="stage validate-stage">
      <span className="stage-tag">STAGE_03 / VALIDATE</span>
      <h2 className="stage-headline-sm">Projects</h2>
      <p className="stage-body-sm">Quality-gated. Production-minded. Not just notebooks.</p>
      <div className="projects-grid">
        {projects.map((p) => (
          <div key={p.name} className={`project-card ${p.link ? "clickable" : ""}`}
            onClick={() => p.link && window.open(p.link, "_blank")}>
            <div className="project-card-top">
              <span className={`project-status ${p.status === "LIVE" ? "live" : "building"}`}>{p.status}</span>
              <span className="project-tag">{p.tag}</span>
            </div>
            <h3 className="project-name">{p.name}</h3>
            <p className="project-desc">{p.desc}</p>
            <span className="project-metric">{p.metric}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── LOAD ────────────────────────────────────────────── */
function LoadStage({ theme, content }) {
  return (
    <section className="stage load-stage">
      <span className="stage-tag">STAGE_04 / LOAD</span>
      <h2 className="stage-headline-sm">Ready to load into your pipeline?</h2>
      <p className="stage-body">
        Open to Fall/Winter 2026 co-op · Data Engineering · AI/ML · QA Automation · Analytics<br/>
        CPT authorized · Boston, MA · Open to relocation
      </p>
      <div className="contact-block">
        <a href={`mailto:${content.email}`} className="cta-primary contact-cta">Initiate Connection →</a>
        <a href={content.linkedin} className="cta-secondary contact-cta" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={content.github} className="cta-secondary contact-cta" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <div className="contact-meta">
        <span>{content.email}</span>
        <span>{content.phone}</span>
      </div>
    </section>
  );
}

/* ── RECRUITER CHATBOT ──────────────────────────────── */
function RecruiterChat({ theme, content }) {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: `Hi! I'm Aishwarya's portfolio assistant. Ask me anything about her experience, skills, or projects — or leave a message and she'll get back to you.` }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const systemPrompt = `You are a portfolio assistant for Aishwarya Vedaraman, a Data Engineer and AI/ML professional.
Answer recruiter questions based on this information:
- Education: MS Data Analytics Engineering at Northeastern University, GPA 4.0, graduating May 2027. BTech Electronics & Instrumentation from SASTRA University.
- Experience: 3+ years at Mphasis as Senior Data Engineer & AI/ML CoE. Worked on FedEx logistics data pipelines.
- Skills: Selenium, Cucumber, BDD, pytest, Python, SQL, LangGraph, LangChain, GCP, AWS, Power BI, Jira, Docker
- Projects: Pipeline Autopilot (MLOps on GCP), AeroAssist (RAG/LangChain), Healthcare Analytics (Cohere), Board Game Recommender (SVD)
- Certifications: SAFe 5 Practitioner, SAFe Agilist
- Visa: F-1 CPT authorized, open to co-op Fall/Winter 2026
- Location: Boston, MA, open to relocation
- Contact: vedaraman.a@northeastern.edu

Be concise, confident, and professional. If someone leaves a message for Aishwarya, acknowledge it warmly and tell them she'll follow up. Keep answers under 3 sentences.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Thanks for your message! Aishwarya will get back to you soon.";
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Thanks for reaching out! Your message has been noted — Aishwarya will follow up at vedaraman.a@northeastern.edu" }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-fab">
      <button className="chat-trigger" onClick={() => setOpen(!open)}>
        {open ? "✕" : "💬"}
        {!open && <span className="chat-trigger-label">Ask me anything</span>}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span className="chat-status-dot" />
            <span>Aishwarya's Assistant</span>
            <span className="chat-powered">powered by Claude</span>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <p>{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <p className="chat-typing">···</p>
              </div>
            )}
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Ask about skills, availability, projects..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <button className="chat-send" onClick={send}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SMALL COMPONENTS ──────────────────────────────── */
function MetaCard({ label, value, unit }) {
  return (
    <div className="meta-card">
      <span className="meta-value">{value}</span>
      <span className="meta-unit">{unit}</span>
      <span className="meta-label">{label}</span>
    </div>
  );
}
