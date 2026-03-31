"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

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
    firms: ["Freeman", "George P. Johnson (GPJ)", "Imagination", "TBA Global"],
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
  {
    label: "New — Comms & Employee",
    firms: [
      "The Grossman Group",
      "Gagen MacDonald",
      "Ketchum",
      "H+K Strategies",
      "Porter Novelli",
    ],
  },
];

const ALL_FIRMS = FIRM_GROUPS.flatMap((g) => g.firms);

interface Contact {
  name: string;
  title: string;
  linkedin_url: string | null;
}

interface CachedContact {
  contact: Contact;
  fetchedAt: number;
}

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CACHE_KEY = "corp-comms-contacts-v1";

function loadCache(): Record<string, CachedContact> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveToCache(firm: string, contact: Contact) {
  const cache = loadCache();
  cache[firm] = { contact, fetchedAt: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function getCached(firm: string): Contact | null {
  const cache = loadCache();
  const entry = cache[firm];
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
  return entry.contact;
}

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: "2px solid #e0f0f0",
        borderTopColor: "#008285",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

export default function CorpCommsProspectorPage() {
  const [firm, setFirm] = useState(ALL_FIRMS[0]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  function exportExcel() {
    const cache = loadCache();
    const rows = ALL_FIRMS.map((f) => {
      const entry = cache[f];
      const c = entry ? entry.contact : null;
      return {
        Firm: f,
        "Contact Name": c?.name ?? "",
        Title: c?.title ?? "",
        LinkedIn: c?.linkedin_url ?? "",
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Corp Comms");
    XLSX.writeFile(wb, "corp-comms-contacts.xlsx");
  }

  // Auto-fetch contact whenever firm changes
  useEffect(() => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setEmail(null);
    setEmailError("");
    setContactError("");

    const cached = getCached(firm);
    if (cached) {
      setContact(cached);
      setContactLoading(false);
      return;
    }

    setContact(null);
    setContactLoading(true);

    const controller = abortRef.current;

    fetch("/api/corp-comms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "find", firm }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: { contact?: Contact; error?: string }) => {
        if (data.error) throw new Error(data.error);
        if (!data.contact) throw new Error("No contact returned");
        setContact(data.contact);
        saveToCache(firm, data.contact);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setContactError(err.message || "Could not find contact.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setContactLoading(false);
      });
  }, [firm]);

  const handleDraftEmail = async () => {
    if (!contact) return;
    setEmailLoading(true);
    setEmailError("");
    setEmail(null);
    setCopied(false);

    try {
      const res = await fetch("/api/corp-comms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "email", firm, contact }),
      });
      const data = await res.json() as { email?: string; error?: string };
      if (data.error) throw new Error(data.error);
      setEmail(data.email ?? "");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleRefresh = () => {
    const cache = loadCache();
    delete cache[firm];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    setContact(null);
    setEmail(null);
    setEmailError("");
    setContactError("");
    // Trigger re-fetch by resetting firm (same value, use a counter trick)
    setFirm((f) => f); // Won't re-trigger useEffect as value is same
    // Force by calling fetch directly
    setContactLoading(true);
    fetch("/api/corp-comms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "find", firm }),
    })
      .then((r) => r.json())
      .then((data: { contact?: Contact; error?: string }) => {
        if (data.error) throw new Error(data.error);
        if (!data.contact) throw new Error("No contact returned");
        setContact(data.contact);
        saveToCache(firm, data.contact);
      })
      .catch((err: Error) => setContactError(err.message || "Could not refresh."))
      .finally(() => setContactLoading(false));
  };

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 96px", ...serif }}>

        {/* Back */}
        <Link href="/projects" style={{ fontSize: 12, color: "#9ca3af", ...sans }}>
          &larr; Back to Projects
        </Link>

        {/* Header */}
        <div style={{ marginTop: 24, marginBottom: 40 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#c0c0c0", ...sans, marginBottom: 16 }}>
            Agent
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Corp Comms Prospector
          </h1>
          <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.7, margin: 0 }}>
            Select a firm — contact is looked up automatically. Draft a cold email in one click.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" as const, alignItems: "center" }}>
            {["Auto-search", "Gemini Flash", "Cached 7 days"].map((tag) => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", padding: "3px 10px", borderRadius: 20, ...sans }}>
                {tag}
              </span>
            ))}
            <button
              onClick={exportExcel}
              style={{ fontSize: 11, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #99e0e1", padding: "3px 10px", borderRadius: 20, cursor: "pointer", ...sans }}
            >
              Export Excel
            </button>
          </div>
          <div style={{ width: 40, height: 3, background: "#008285", borderRadius: 2, marginTop: 24 }} />
        </div>

        {/* Firm Selector */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", ...sans, display: "block", marginBottom: 8 }}>
            Select Firm
          </label>
          <select
            value={firm}
            onChange={(e) => {
              setFirm(e.target.value);
              setEmail(null);
              setEmailError("");
            }}
            style={{ width: "100%", padding: "12px 14px", fontSize: 15, ...serif, border: "1px solid #e5e7eb", borderRadius: 8, outline: "none", color: "#111827", background: "#fff", cursor: "pointer" }}
          >
            {FIRM_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.firms.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Contact Card */}
        <div style={{ marginBottom: 32 }}>
          {contactLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 24px", border: "1px solid #e0f0f0", borderRadius: 8, background: "#f0fafa" }}>
              <Spinner size={16} />
              <span style={{ fontSize: 13, color: "#9ca3af", ...sans }}>Finding best contact at {firm}…</span>
            </div>
          )}

          {!contactLoading && contactError && (
            <div style={{ padding: "16px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#ef4444", ...sans }}>
              {contactError}
            </div>
          )}

          {!contactLoading && contact && (
            <div style={{ border: "1px solid #e0f0f0", borderRadius: 8, padding: "20px 24px", background: "#f0fafa" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#008285", ...sans }}>
                  Suggested Contact
                </div>
                <button
                  onClick={handleRefresh}
                  style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", ...sans, padding: 0 }}
                >
                  ↻ Refresh
                </button>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 3 }}>
                {contact.name}
              </div>
              <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: contact.linkedin_url ? 14 : 0 }}>
                {contact.title}
              </div>
              {contact.linkedin_url && (
                <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#008285", ...sans, textDecoration: "underline" }}>
                  LinkedIn →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Draft Email Button */}
        {contact && !contactLoading && (
          <div style={{ marginBottom: 32 }}>
            <button
              onClick={handleDraftEmail}
              disabled={emailLoading}
              style={{ fontSize: 14, fontWeight: 700, ...sans, color: emailLoading ? "#9ca3af" : "#fff", background: emailLoading ? "#f3f4f6" : "#008285", border: "none", borderRadius: 8, padding: "12px 28px", cursor: emailLoading ? "default" : "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}
            >
              {emailLoading && <Spinner />}
              {emailLoading ? "Drafting…" : email ? "Redraft Email" : "Draft Email"}
            </button>
            {emailError && (
              <p style={{ fontSize: 13, color: "#ef4444", marginTop: 10, ...sans }}>{emailError}</p>
            )}
          </div>
        )}

        {/* Email Output */}
        {email && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#008285", ...sans }}>
                Draft Email
              </div>
              <button
                onClick={handleCopy}
                style={{ fontSize: 12, fontWeight: 600, ...sans, color: copied ? "#008285" : "#6b7280", background: copied ? "#f0fafa" : "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 6, padding: "5px 12px", cursor: "pointer", transition: "all 0.15s" }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 8, padding: "20px 24px", fontSize: 14, lineHeight: 1.8, color: "#374151", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, ...serif, margin: 0 }}>
              {email}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20, marginTop: 48, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#c0c0c0", ...sans }}>
          <span>Open Exchange &middot; Confidential</span>
          <span>Corp Comms Prospector</span>
        </div>
      </div>
    </>
  );
}
