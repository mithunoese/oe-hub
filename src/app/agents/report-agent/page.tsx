"use client";

import Link from "next/link";
import { useState } from "react";

const PLACEHOLDER_NOTES = `Monday 2/23
- 9am Jefferies check-in with Connor - data issue, their field formatting changed
- 10am Connor + Nick integration status review
- 11am Delivery weekly - weather disruptions, Grinders earnings event
- 1pm Connor 1:1 product walkthrough - OE Central, Passport architecture
- 2pm Net Roadshow partnership intro (CEO-driven)
- 3pm Andersen discovery - coming off ON24, 35 webcasts to migrate
...

Tuesday 2/24
- Mark Lehrman intro - OE history, migration vision
- Zoom CMS/video migration status
- Annalisa 1:1 - delivery pain points, AI opportunities
...`;

interface MeetingSummary {
  title: string;
  summary: string;
}

interface DayEntry {
  day: string;
  date: string;
  meetings: MeetingSummary[];
}

interface Theme {
  title: string;
  text: string;
}

interface LookAheadItem {
  title: string;
  text: string;
}

interface MeetingTypeCount {
  type: string;
  count: number;
}

interface ReportAnalytics {
  peopleMet: number;
  clientsTouched: number;
  departments: number;
  meetingTypes: MeetingTypeCount[];
}

interface GeneratedReport {
  weekNumber: number;
  dateRange: string;
  meetingCount: number;
  analytics: ReportAnalytics;
  overview: string;
  themes: Theme[];
  days: DayEntry[];
  lookAhead: LookAheadItem[];
}

type GenerationStatus = "idle" | "generating" | "done" | "error";

export default function ReportAgentPage() {
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return;

    setStatus("generating");
    setErrorMessage("");
    setReport(null);

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }

      setReport(data.report);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Network error");
    }
  };

  const handleReset = () => {
    setReport(null);
    setStatus("idle");
    setNotes("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isGenerating = status === "generating";
  const isButtonEnabled = !isGenerating && !!notes.trim();

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "56px 24px 96px",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* Back Link */}
      <Link
        href="/agents"
        style={{
          fontSize: 12,
          color: "#9ca3af",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        &larr; Back to Agents
      </Link>

      {/* Header Section */}
      <div style={{ marginTop: 24, marginBottom: 40 }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c0c0c0",
            fontFamily: "system-ui, sans-serif",
            marginBottom: 16,
          }}
        >
          Agent
        </div>

        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 8px 0",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
          }}
        >
          Report Agent
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "#9ca3af",
            lineHeight: 1.7,
            margin: "0 0 4px 0",
          }}
        >
          Paste your raw meeting notes below. The agent will extract meetings,
          identify themes, compute analytics, and generate a structured report.
        </p>

        {/* Tags */}
        <div
          style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
        >
          {["Gemini Flash", "Free Tier", "Any Format"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#008285",
                background: "#f0fafa",
                border: "1px solid #e0f0f0",
                padding: "3px 10px",
                borderRadius: 20,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Accent bar */}
        <div
          style={{
            width: 40,
            height: 3,
            background: "#008285",
            borderRadius: 2,
            marginTop: 24,
          }}
        />
      </div>

      {/* Input Section */}
      <div style={{ marginBottom: 48 }}>
        <label
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#374151",
            fontFamily: "system-ui, sans-serif",
            display: "block",
            marginBottom: 8,
          }}
        >
          Raw Meeting Notes
        </label>

        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            fontFamily: "system-ui, sans-serif",
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          Bullet points, fragments, voice-to-text — any format. Include dates,
          names, and topics.
        </p>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={PLACEHOLDER_NOTES}
          rows={12}
          style={{
            width: "100%",
            padding: "16px 18px",
            fontSize: 14,
            fontFamily: "'Georgia', serif",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            outline: "none",
            resize: "vertical",
            background: "#fff",
            boxSizing: "border-box",
            lineHeight: 1.7,
            color: "#374151",
          }}
        />

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <button
            onClick={handleGenerate}
            disabled={!isButtonEnabled}
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "system-ui, sans-serif",
              color: isButtonEnabled ? "#fff" : "#9ca3af",
              background: isButtonEnabled ? "#008285" : "#f3f4f6",
              border: "none",
              borderRadius: 8,
              padding: "12px 28px",
              cursor: isButtonEnabled ? "pointer" : "default",
              transition: "all 0.15s",
            }}
          >
            {isGenerating ? "Generating..." : "Generate Report"}
          </button>

          {isGenerating && (
            <span
              style={{
                fontSize: 12,
                color: "#9ca3af",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              This takes 10–20 seconds
            </span>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 16px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              fontSize: 13,
              color: "#ef4444",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>

      {/* Generated Report */}
      {report && (
        <div>
          {/* Report Header */}
          <div
            style={{
              borderTop: "2px solid #008285",
              paddingTop: 32,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#008285",
                fontFamily: "system-ui, sans-serif",
                marginBottom: 12,
              }}
            >
              Generated Report
            </div>

            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.04em",
                margin: "0 0 4px 0",
              }}
            >
              Week {report.weekNumber}
            </h2>

            <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>
              {report.dateRange}
            </div>
          </div>

          {/* Analytics Cards */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: report.meetingCount, label: "Meetings" },
              { value: report.analytics.peopleMet, label: "People Met" },
              { value: report.analytics.clientsTouched, label: "Clients" },
              { value: report.analytics.departments, label: "Departments" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: "1 1 100px",
                  minWidth: 80,
                  background: "#f0fafa",
                  border: "1px solid #e0f0f0",
                  borderRadius: 8,
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#008285",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    fontFamily: "system-ui, sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Meeting Type Tags */}
          {report.analytics.meetingTypes.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 32,
              }}
            >
              {report.analytics.meetingTypes.map((mt) => (
                <div
                  key={mt.type}
                  style={{
                    fontSize: 12,
                    fontFamily: "system-ui, sans-serif",
                    color: "#374151",
                    background: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    borderRadius: 20,
                    padding: "5px 14px",
                  }}
                >
                  {mt.type} <strong>{mt.count}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          <div style={{ marginBottom: 32 }}>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Overview
            </h3>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: "#374151",
                whiteSpace: "pre-line",
              }}
            >
              {report.overview}
            </p>
          </div>

          {/* Themes */}
          {report.themes.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                Themes
              </h3>
              {report.themes.map((theme, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 4,
                    }}
                  >
                    {theme.title}
                  </div>
                  <div
                    style={{ fontSize: 14, lineHeight: 1.7, color: "#6b7280" }}
                  >
                    {theme.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Day by Day */}
          {report.days.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                Day by Day
              </h3>
              {report.days.map((day) => (
                <div key={day.day} style={{ marginBottom: 20 }}>
                  {/* Day Header (clickable to expand/collapse) */}
                  <div
                    onClick={() =>
                      setExpandedDay(
                        expandedDay === day.day ? null : day.day
                      )
                    }
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "12px 0",
                      borderBottom:
                        expandedDay === day.day
                          ? "none"
                          : "1px solid #f0f0f0",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#5b21b6",
                        }}
                      >
                        {day.day}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#9ca3af",
                          marginLeft: 10,
                        }}
                      >
                        {day.date}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "#008285",
                          background: "#f0fafa",
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontWeight: 600,
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        {day.meetings.length} meetings
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          color: "#d1d5db",
                          transform:
                            expandedDay === day.day
                              ? "rotate(90deg)"
                              : "rotate(0)",
                          transition: "transform 0.15s",
                        }}
                      >
                        &rsaquo;
                      </span>
                    </div>
                  </div>

                  {/* Expanded Day Content */}
                  {expandedDay === day.day && (
                    <div
                      style={{
                        paddingBottom: 12,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {day.meetings.map((meeting, meetingIndex) => (
                        <div
                          key={meetingIndex}
                          style={{
                            padding: "10px 0",
                            borderTop:
                              meetingIndex > 0
                                ? "1px solid #f9fafb"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#111827",
                              marginBottom: 4,
                            }}
                          >
                            {meeting.title}
                          </div>
                          <div
                            style={{
                              fontSize: 13.5,
                              lineHeight: 1.7,
                              color: "#6b7280",
                            }}
                          >
                            {meeting.summary}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Looking Ahead */}
          {report.lookAhead.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                Looking Ahead
              </h3>
              {report.lookAhead.map((item, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      color: "#6b7280",
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generate Another Button */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <button
              onClick={handleReset}
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
                color: "#008285",
                background: "#f0fafa",
                border: "1px solid #e0f0f0",
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Generate Another Report
            </button>
          </div>
        </div>
      )}

      {/* How It Works (shown when no report) */}
      {!report && (
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            How It Works
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {[
              {
                title: "Any Format",
                text: "Bullet points, fragments, voice-to-text transcripts. The agent handles messy input.",
              },
              {
                title: "Theme Extraction",
                text: "Identifies 3\u20135 recurring themes that connect across your meetings.",
              },
              {
                title: "Day-by-Day Structure",
                text: "Every meeting is organized by day with titles and summaries.",
              },
              {
                title: "Analytics",
                text: "People met, departments, clients touched, meeting type breakdown.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#f9fafb",
                  border: "1px solid #f0f0f0",
                  borderRadius: 10,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: 6,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "#6b7280",
                  }}
                >
                  {card.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <p
              style={{
                fontSize: 13,
                color: "#9ca3af",
                fontFamily: "system-ui, sans-serif",
                lineHeight: 1.6,
              }}
            >
              See it in action:{" "}
              <Link
                href="/reports/week-2"
                style={{ color: "#008285", textDecoration: "underline" }}
              >
                Week 2 Report
              </Link>{" "}
              was generated by this agent.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: 20,
          marginTop: 48,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10.5,
          color: "#c0c0c0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span>Open Exchange &middot; Confidential</span>
        <span>Report Agent</span>
      </div>
    </div>
  );
}
