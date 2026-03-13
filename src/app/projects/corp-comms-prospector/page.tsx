"use client";

import Link from "next/link";
import { useState } from "react";

const serif = { fontFamily: "Georgia, serif" };
const sans = { fontFamily: "system-ui, sans-serif" };

const FIRM_GROUPS = [
  {
    label: "Priority",
    firms: [
      "Gatehouse",
      "ScarlettAbbott",
      "Brilliant Ink",
      "Davis & Company",
      "DRPG",
      "Jack Morton Worldwide",
      "InVision Communications",
      "Sparks",
      "Emperor",
      "JPL",
    ],
  },
  {
    label: "Internal Comms",
    firms: [
      "ROI Communication",
      "Blue Beyond Consulting",
      "StoryWorks",
      "Sequel Group",
      "AB Communications",
      "Brandpie",
      "Instinctif Partners",
      "MSL Employee Practice",
    ],
  },
  {
    label: "Event + Broadcast",
    firms: [
      "Freeman",
      "George P. Johnson (GPJ)",
      "Imagination",
      "TBA Global",
    ],
  },
  {
    label: "Boutique Advisors",
    firms: [
      "Peppercomm",
      "Prosek Partners",
      "Mission North",
      "Seven Letter",
      "Padilla",
      "Lansons",
      "Decker Communications",
      "Bully Pulpit International",
    ],
  },
  {
    label: "Enterprise",
    firms: [
      "Edelman",
      "Weber Shandwick",
      "APCO Worldwide",
      "BCW (Burson Cohn & Wolfe)",
      "FleishmanHillard",
      "Brunswick Group",
      "FGS Global",
      "Teneo",
      "Kekst CNC",
      "Ruder Finn",
    ],
  },
];

interface Contact {
  name: string;
  title: string;
  linkedin_url?: string;
}

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        border: "2px solid #e0f0f0",
        borderTopColor: "#008285",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        verticalAlign: "middle",
        marginRight: 8,
      }}
    />
  );
}

export default function CorpCommsProspectorPage() {
  const [apiKey, setApiKey] = useState("");
  const [firm, setFirm] = useState(FIRM_GROUPS[0].firms[0]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [findingContact, setFindingContact] = useState(false);
  const [draftingEmail, setDraftingEmail] = useState(false);
  const [contactError, setContactError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [copied, setCopied] = useState(false);

  const callGemini = async (
    model: string,
    body: object
  ): Promise<string> => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { error?: { message?: string } })?.error?.message ||
          `API error ${res.status}`
      );
    }
    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    };
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) throw new Error("Empty response from API.");
    return text;
  };

  const parseContact = (raw: string): Contact => {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    return JSON.parse(jsonMatch[0]) as Contact;
  };

  const handleFindContact = async () => {
    if (!apiKey.trim()) {
      setContactError("Please enter your Google AI API key.");
      return;
    }
    setFindingContact(true);
    setContactError("");
    setContact(null);
    setEmail(null);
    setEmailError("");

    try {
      const text = await callGemini("gemini-2.0-flash", {
        tools: [{ google_search: {} }],
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Find the best person to contact at ${firm} about a technology partnership for corporate broadcast infrastructure — town halls, executive webcasts, hybrid events. Return JSON only with keys: name, title, linkedin_url`,
              },
            ],
          },
        ],
      });
      const parsed = parseContact(text);
      setContact(parsed);
    } catch (err) {
      setContactError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setFindingContact(false);
    }
  };

  const handleDraftEmail = async () => {
    if (!contact) return;
    setDraftingEmail(true);
    setEmailError("");
    setEmail(null);

    try {
      const text = await callGemini("gemini-2.0-flash", {
        system_instruction: {
          parts: [
            {
              text: "You are writing a cold outreach email on behalf of OpenExchange (OE), a technology platform that powers executive-grade webcasts, global town halls, and hybrid corporate events via Zoom. OE partners with corporate communications agencies as their broadcast infrastructure layer. Under 150 words, warm but professional.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Write a cold outreach email to ${contact.name}, ${contact.title} at ${firm}. Introduce OE as a potential broadcast infrastructure partner for their town hall and executive event work.`,
              },
            ],
          },
        ],
      });
      setEmail(text);
    } catch (err) {
      setEmailError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setDraftingEmail(false);
    }
  };

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isLoading = findingContact || draftingEmail;

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "56px 24px 96px",
          ...serif,
        }}
      >
        {/* Back */}
        <Link href="/projects" style={{ fontSize: 12, color: "#9ca3af", ...sans }}>
          &larr; Back to Projects
        </Link>

        {/* Header */}
        <div style={{ marginTop: 24, marginBottom: 40 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#c0c0c0",
              ...sans,
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
            Corp Comms Prospector
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "#9ca3af",
              lineHeight: 1.7,
              margin: "0 0 4px 0",
            }}
          >
            Finds the right contact at corporate communications agencies and
            drafts a cold outreach email introducing OE as a broadcast
            infrastructure partner.
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" as const }}>
            {["Google Search", "Gemini Flash", "Corp Comms"].map((tag) => (
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
                  ...sans,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

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

        {/* API Key */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              ...sans,
              display: "block",
              marginBottom: 6,
            }}
          >
            Google AI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
            style={{
              width: "100%",
              padding: "12px 14px",
              fontSize: 14,
              ...sans,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              outline: "none",
              boxSizing: "border-box" as const,
              color: "#374151",
              background: "#fff",
            }}
          />
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, ...sans }}>
            Key is never stored.
          </p>
        </div>

        {/* Firm Selector */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#374151",
              ...sans,
              display: "block",
              marginBottom: 6,
            }}
          >
            Select Firm
          </label>
          <select
            value={firm}
            onChange={(e) => {
              setFirm(e.target.value);
              setContact(null);
              setEmail(null);
              setContactError("");
              setEmailError("");
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              fontSize: 14,
              ...sans,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              outline: "none",
              color: "#374151",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {FIRM_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.firms.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Find Contact Button */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={handleFindContact}
            disabled={isLoading}
            style={{
              fontSize: 14,
              fontWeight: 700,
              ...sans,
              color: isLoading ? "#9ca3af" : "#fff",
              background: isLoading ? "#f3f4f6" : "#008285",
              border: "none",
              borderRadius: 8,
              padding: "12px 28px",
              cursor: isLoading ? "default" : "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
            }}
          >
            {findingContact && <Spinner />}
            {findingContact ? "Searching..." : "Find Contact"}
          </button>

          {contactError && (
            <p
              style={{
                fontSize: 13,
                color: "#ef4444",
                marginTop: 10,
                ...sans,
                lineHeight: 1.5,
              }}
            >
              {contactError}
            </p>
          )}
        </div>

        {/* Contact Card */}
        {contact && (
          <div
            style={{
              border: "1px solid #e0f0f0",
              borderRadius: 8,
              padding: "20px 24px",
              background: "#f0fafa",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "#008285",
                ...sans,
                marginBottom: 10,
              }}
            >
              Suggested Contact
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              {contact.name}
            </div>
            <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 12 }}>
              {contact.title}
            </div>
            {contact.linkedin_url && (
              <a
                href={contact.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "#008285",
                  ...sans,
                  textDecoration: "underline",
                }}
              >
                LinkedIn →
              </a>
            )}
          </div>
        )}

        {/* Draft Email Button */}
        {contact && (
          <div style={{ marginBottom: 32 }}>
            <button
              onClick={handleDraftEmail}
              disabled={isLoading}
              style={{
                fontSize: 14,
                fontWeight: 700,
                ...sans,
                color: isLoading ? "#9ca3af" : "#fff",
                background: isLoading ? "#f3f4f6" : "#008285",
                border: "none",
                borderRadius: 8,
                padding: "12px 28px",
                cursor: isLoading ? "default" : "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
              }}
            >
              {draftingEmail && <Spinner />}
              {draftingEmail ? "Drafting..." : "Draft Email"}
            </button>

            {emailError && (
              <p
                style={{
                  fontSize: 13,
                  color: "#ef4444",
                  marginTop: 10,
                  ...sans,
                  lineHeight: 1.5,
                }}
              >
                {emailError}
              </p>
            )}
          </div>
        )}

        {/* Email Output */}
        {email && (
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  color: "#008285",
                  ...sans,
                }}
              >
                Draft Email
              </div>
              <button
                onClick={handleCopy}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  ...sans,
                  color: copied ? "#008285" : "#6b7280",
                  background: copied ? "#f0fafa" : "#f9fafb",
                  border: "1px solid #f0f0f0",
                  borderRadius: 6,
                  padding: "5px 12px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre
              style={{
                background: "#f9fafb",
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: "20px 24px",
                fontSize: 14,
                lineHeight: 1.75,
                color: "#374151",
                whiteSpace: "pre-wrap" as const,
                wordBreak: "break-word" as const,
                ...serif,
                margin: 0,
              }}
            >
              {email}
            </pre>
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
            ...sans,
          }}
        >
          <span>Open Exchange &middot; Confidential</span>
          <span>Corp Comms Prospector</span>
        </div>
      </div>
    </>
  );
}
