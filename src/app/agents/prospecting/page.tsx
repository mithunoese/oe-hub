"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProspectCompany } from "../../api/prospect/route";

type RunStatus = "idle" | "running" | "done" | "error";

const seedDefaults = ["Intuit", "Siena AI", "Gibson Dunn"];

const SEED_DESCRIPTIONS: Record<string, string> = {
  "Intuit": "Large fintech SaaS — multi-dept webinars, internal training, partner events",
  "Siena AI": "AI SaaS startup — customer education, partner enablement, product demos",
  "Gibson Dunn": "AmLaw 200 firm — thought leadership webinars, client events, CLE sessions",
};

const INDUSTRY_COLORS: Record<string, { bg: string; text: string }> = {
  "Enterprise": { bg: "#f0f4ff", text: "#3b5fc0" },
  "HRIS": { bg: "#fdf0ff", text: "#7c3aed" },
  "HR Tech": { bg: "#fdf0ff", text: "#7c3aed" },
  "Law Firm": { bg: "#fff0f0", text: "#c0392b" },
  "Legal": { bg: "#fff0f0", text: "#c0392b" },
  "Fintech": { bg: "#f0fff4", text: "#16a34a" },
  "SaaS": { bg: "#f0fafa", text: "#008285" },
  "Consulting": { bg: "#fffbf0", text: "#b45309" },
  "Professional Services": { bg: "#fffbf0", text: "#b45309" },
};

function getIndustryColor(industry: string) {
  for (const key of Object.keys(INDUSTRY_COLORS)) {
    if (industry.toLowerCase().includes(key.toLowerCase())) {
      return INDUSTRY_COLORS[key];
    }
  }
  return { bg: "#f9fafb", text: "#374151" };
}

function SimilarToBadge({ label }: { label: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    "Intuit": { bg: "#f0fafa", text: "#008285", border: "#b2e4e4" },
    "Siena AI": { bg: "#f5f0ff", text: "#6d28d9", border: "#d4b8ff" },
    "Gibson Dunn": { bg: "#fff0f4", text: "#be185d", border: "#fdb8cc" },
  };
  const style = colors[label] ?? { bg: "#f9fafb", text: "#374151", border: "#e5e7eb" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, fontFamily: "system-ui, sans-serif",
      color: style.text, background: style.bg, border: `1px solid ${style.border}`,
      padding: "2px 8px", borderRadius: 12, whiteSpace: "nowrap",
    }}>
      Like {label}
    </span>
  );
}

function CompanyCard({ company, index }: { company: ProspectCompany; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const industryColor = getIndustryColor(company.industry);

  return (
    <div style={{
      border: "1px solid #f0f0f0", borderRadius: 10,
      background: "#fff", overflow: "hidden",
      transition: "box-shadow 0.15s",
    }}>
      {/* Header row */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "18px 22px", cursor: "pointer",
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: 12,
        }}
      >
        {/* Left: number + name + industry */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#c0c0c0",
            fontFamily: "system-ui, sans-serif", minWidth: 20,
            paddingTop: 2,
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{
                fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700,
                color: "#111827", letterSpacing: "-0.01em",
              }}>
                {company.name}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 600, fontFamily: "system-ui, sans-serif",
                color: industryColor.text, background: industryColor.bg,
                padding: "2px 8px", borderRadius: 10,
              }}>
                {company.industry}
              </span>
              <SimilarToBadge label={company.similarTo} />
            </div>
            <p style={{
              fontFamily: "Georgia, serif", fontSize: 13, color: "#9ca3af",
              lineHeight: 1.5, margin: 0,
            }}>
              {company.description}
            </p>
            {/* Meta row */}
            <div style={{
              display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "system-ui, sans-serif" }}>
                📍 {company.hq}
              </span>
              <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "system-ui, sans-serif" }}>
                👥 {company.size}
              </span>
            </div>
          </div>
        </div>
        {/* Right: expand arrow */}
        <span style={{
          fontSize: 16, color: "#d1d5db", flexShrink: 0,
          transform: expanded ? "rotate(90deg)" : "rotate(0)",
          transition: "transform 0.15s", paddingTop: 2,
        }}>
          ›
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          borderTop: "1px solid #f9fafb", padding: "18px 22px 22px",
          background: "#fdfdfd",
        }}>
          {/* Event types */}
          <div style={{ marginBottom: 18 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#9ca3af",
              fontFamily: "system-ui, sans-serif", marginBottom: 8,
            }}>
              Events They Run
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {company.eventTypes.map((t) => (
                <span key={t} style={{
                  fontSize: 11, fontWeight: 500, fontFamily: "system-ui, sans-serif",
                  color: "#374151", background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  padding: "3px 10px", borderRadius: 12,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Why it fits */}
          <div style={{ marginBottom: 18 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#9ca3af",
              fontFamily: "system-ui, sans-serif", marginBottom: 6,
            }}>
              Why OE Fits
            </div>
            <p style={{
              fontFamily: "Georgia, serif", fontSize: 13.5, color: "#374151",
              lineHeight: 1.7, margin: 0,
            }}>
              {company.whyItFits}
            </p>
          </div>

          {/* Two-col: roles + outreach */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Target roles */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#9ca3af",
                fontFamily: "system-ui, sans-serif", marginBottom: 8,
              }}>
                Who to Hit Up
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {company.targetRoles.map((role) => (
                  <div key={role} style={{
                    fontSize: 12, fontFamily: "system-ui, sans-serif",
                    color: "#111827", fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ color: "#008285", fontSize: 10 }}>→</span>
                    {role}
                  </div>
                ))}
              </div>
            </div>

            {/* Outreach angle */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#9ca3af",
                fontFamily: "system-ui, sans-serif", marginBottom: 8,
              }}>
                Outreach Hook
              </div>
              <p style={{
                fontFamily: "Georgia, serif", fontSize: 13, color: "#374151",
                lineHeight: 1.6, margin: 0,
                fontStyle: "italic",
                borderLeft: "2px solid #008285",
                paddingLeft: 10,
              }}>
                &ldquo;{company.outreachAngle}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProspectingAgent() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [prospects, setProspects] = useState<ProspectCompany[]>([]);
  const [seeds] = useState<string[]>(seedDefaults);
  const [criteria, setCriteria] = useState("");
  const [filterSeed, setFilterSeed] = useState<string>("All");
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [searchMode, setSearchMode] = useState<"ai-knowledge" | "web-search">("ai-knowledge");

  const handleRun = async () => {
    setStatus("running");
    setErrorMsg("");
    setProspects([]);
    setFilterSeed("All");

    try {
      const res = await fetch("/api/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seeds, criteria }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
        return;
      }
      setProspects(data.prospects ?? []);
      setGeneratedAt(data.generatedAt);
      setSearchMode(data.searchMode);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setProspects([]);
    setErrorMsg("");
    setGeneratedAt("");
    setCriteria("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isRunning = status === "running";
  const canRun = !isRunning;

  const filteredProspects =
    filterSeed === "All" ? prospects : prospects.filter((p) => p.similarTo === filterSeed);

  const countsBySeed = seeds.reduce<Record<string, number>>((acc, s) => {
    acc[s] = prospects.filter((p) => p.similarTo === s).length;
    return acc;
  }, {});

  return (
    <div style={{
      maxWidth: 780, margin: "0 auto",
      padding: "56px 24px 96px",
      fontFamily: "Georgia, serif",
    }}>
      {/* Back */}
      <Link href="/agents" style={{ fontSize: 12, color: "#9ca3af", fontFamily: "system-ui, sans-serif" }}>
        ← Back to Agents
      </Link>

      {/* Header */}
      <div style={{ marginTop: 24, marginBottom: 40 }}>
        <div style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#c0c0c0",
          fontFamily: "system-ui, sans-serif", marginBottom: 16,
        }}>
          Agent
        </div>

        <h1 style={{
          fontSize: 40, fontWeight: 700, color: "#111827",
          margin: "0 0 8px 0", letterSpacing: "-0.04em", lineHeight: 1.1,
        }}>
          Prospecting Agent
        </h1>

        <p style={{
          fontSize: 16, color: "#9ca3af", lineHeight: 1.7,
          margin: "0 0 4px 0",
        }}>
          Finds companies similar to your best clients — with dense intel on who to contact
          and how to pitch them.
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {["Claude Sonnet 4.6", "Zoom Sales", "Repeatable Pipeline"].map((tag) => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 600, color: "#008285",
              background: "#f0fafa", border: "1px solid #e0f0f0",
              padding: "3px 10px", borderRadius: 20,
              fontFamily: "system-ui, sans-serif",
            }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ width: 40, height: 3, background: "#008285", borderRadius: 2, marginTop: 24 }} />
      </div>

      {/* Seed Companies */}
      <div style={{ marginBottom: 32 }}>
        <label style={{
          fontSize: 13, fontWeight: 700, color: "#374151",
          fontFamily: "system-ui, sans-serif", display: "block", marginBottom: 10,
        }}>
          Seed Clients
        </label>
        <p style={{
          fontSize: 12, color: "#9ca3af", fontFamily: "system-ui, sans-serif",
          marginBottom: 12, lineHeight: 1.5,
        }}>
          The agent uses these clients as the ICP template — it finds lookalikes.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {seeds.map((seed) => (
            <div key={seed} style={{
              padding: "12px 16px",
              background: "#f9fafb",
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#008285", flexShrink: 0, display: "inline-block",
              }} />
              <div>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, fontWeight: 700, color: "#111827" }}>
                  {seed}
                </span>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>
                  {SEED_DESCRIPTIONS[seed]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional criteria */}
      <div style={{ marginBottom: 32 }}>
        <label style={{
          fontSize: 13, fontWeight: 700, color: "#374151",
          fontFamily: "system-ui, sans-serif", display: "block", marginBottom: 8,
        }}>
          Additional Focus (optional)
        </label>
        <textarea
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          disabled={isRunning}
          placeholder="e.g. Focus on Zoom-partner companies, companies with 1,000+ employees in the Northeast, or companies that do tech summits..."
          rows={3}
          style={{
            width: "100%", padding: "12px 16px",
            fontSize: 13, fontFamily: "Georgia, serif",
            border: "1px solid #e5e7eb", borderRadius: 8,
            outline: "none", resize: "vertical",
            background: isRunning ? "#f9fafb" : "#fff",
            boxSizing: "border-box", lineHeight: 1.6, color: "#374151",
          }}
        />
      </div>

      {/* Run button */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <button
          onClick={handleRun}
          disabled={!canRun}
          style={{
            fontSize: 14, fontWeight: 700, fontFamily: "system-ui, sans-serif",
            color: canRun ? "#fff" : "#9ca3af",
            background: canRun ? "#008285" : "#f3f4f6",
            border: "none", borderRadius: 8,
            padding: "12px 32px",
            cursor: canRun ? "pointer" : "default",
            transition: "all 0.15s",
          }}
        >
          {isRunning ? "Finding prospects..." : "Run Prospecting Agent"}
        </button>
        {isRunning && (
          <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "system-ui, sans-serif" }}>
            Usually takes 15–30 seconds
          </span>
        )}
      </div>

      {/* Error */}
      {status === "error" && (
        <div style={{
          padding: "12px 16px", background: "#fef2f2",
          border: "1px solid #fecaca", borderRadius: 8,
          fontSize: 13, color: "#ef4444",
          fontFamily: "system-ui, sans-serif", marginBottom: 24,
        }}>
          {errorMsg}
        </div>
      )}

      {/* Results */}
      {status === "done" && prospects.length > 0 && (
        <div>
          <div style={{ borderTop: "2px solid #008285", paddingTop: 32, marginBottom: 28 }}>
            <div style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "#008285",
              fontFamily: "system-ui, sans-serif", marginBottom: 12,
            }}>
              {searchMode === "web-search" ? "Live Research Results" : "AI Knowledge Results"}
            </div>
            <h2 style={{
              fontSize: 28, fontWeight: 700, color: "#111827",
              letterSpacing: "-0.04em", margin: "0 0 4px 0",
            }}>
              {prospects.length} Prospects Found
            </h2>
            <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: "system-ui, sans-serif" }}>
              Generated {new Date(generatedAt).toLocaleString()}
            </div>
          </div>

          {/* Stats by seed */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
            {seeds.map((seed) => (
              <div key={seed} style={{
                background: "#f9fafb", border: "1px solid #f0f0f0",
                borderRadius: 8, padding: "10px 16px", textAlign: "center",
              }}>
                <div style={{
                  fontSize: 22, fontWeight: 700, color: "#008285",
                  letterSpacing: "-0.02em",
                }}>
                  {countsBySeed[seed] ?? 0}
                </div>
                <div style={{
                  fontSize: 10, color: "#6b7280", fontFamily: "system-ui, sans-serif",
                  textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2,
                }}>
                  Like {seed}
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["All", ...seeds].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterSeed(tab)}
                style={{
                  fontSize: 12, fontWeight: 600, fontFamily: "system-ui, sans-serif",
                  color: filterSeed === tab ? "#008285" : "#6b7280",
                  background: filterSeed === tab ? "#f0fafa" : "transparent",
                  border: filterSeed === tab ? "1px solid #b2e4e4" : "1px solid #f0f0f0",
                  borderRadius: 20, padding: "5px 14px",
                  cursor: "pointer", transition: "all 0.1s",
                }}
              >
                {tab === "All" ? `All (${prospects.length})` : `${tab} (${countsBySeed[tab] ?? 0})`}
              </button>
            ))}
          </div>

          {/* Company cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredProspects.map((company, i) => (
              <CompanyCard key={company.name} company={company} index={prospects.indexOf(company)} />
            ))}
          </div>

          {/* Reset */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
            <button
              onClick={handleReset}
              style={{
                fontSize: 13, fontWeight: 600, fontFamily: "system-ui, sans-serif",
                color: "#008285", background: "#f0fafa",
                border: "1px solid #e0f0f0", borderRadius: 8,
                padding: "10px 20px", cursor: "pointer",
              }}
            >
              Run Again
            </button>
          </div>
        </div>
      )}

      {/* How it works (idle state) */}
      {status === "idle" && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{
            fontSize: 22, fontWeight: 700, color: "#111827",
            letterSpacing: "-0.03em", marginBottom: 16,
          }}>
            How It Works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { title: "ICP Analysis", text: "Claude analyzes what makes Intuit, Siena AI, and Gibson Dunn ideal clients — event cadence, company profile, decision makers." },
              { title: "Lookalike Search", text: "Identifies 20+ companies that match the same profile across SaaS, HRIS, legal, fintech, and professional services." },
              { title: "Dense Intel", text: "For each company: industry, size, HQ, event types they run, why they fit, and who to contact." },
              { title: "Repeatable", text: "Swap in any seed clients and re-run. New quarter, new campaign, new vertical — same pipeline in 30 seconds." },
            ].map((c) => (
              <div key={c.title} style={{
                background: "#f9fafb", border: "1px solid #f0f0f0",
                borderRadius: 10, padding: "16px 18px",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.65, color: "#6b7280" }}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #f0f0f0", paddingTop: 20, marginTop: 48,
        display: "flex", justifyContent: "space-between",
        fontSize: 10.5, color: "#c0c0c0", fontFamily: "system-ui, sans-serif",
      }}>
        <span>Open Exchange · Confidential</span>
        <span>Prospecting Agent</span>
      </div>
    </div>
  );
}
