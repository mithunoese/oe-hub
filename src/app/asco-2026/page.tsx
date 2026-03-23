"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";

/* ─── Types ─── */

type OEStatus = "Existing client" | "Mentioned on call" | "Cold";
type Priority = "high" | "medium" | "low";

interface Company {
  name: string;
  ticker: string;
  privateLabel?: string;
  status: OEStatus;
  priority: Priority;
  owner: string;
  eventFocus: string;
  ascoRole: string;
}

interface ContactEntry {
  date: string;
  method: string;
  by: string;
  notes: string;
  outcome: string;
  loggedAt: string;
}

/* ─── Data ─── */

const companies: Company[] = [
  {
    name: "Amgen",
    ticker: "AMGN",
    status: "Existing client",
    priority: "high",
    owner: "Mithun",
    eventFocus: "Investor events, webcasts",
    ascoRole: "Sponsor + exhibitor",
  },
  {
    name: "AstraZeneca",
    ticker: "AZN",
    status: "Mentioned on call",
    priority: "high",
    owner: "Peter",
    eventFocus: "Earnings, webcasts",
    ascoRole: "Major exhibitor",
  },
  {
    name: "Gilead",
    ticker: "GILD",
    status: "Mentioned on call",
    priority: "high",
    owner: "Cara",
    eventFocus: "IR, investor day",
    ascoRole: "Sponsor",
  },
  {
    name: "Bristol Myers Squibb",
    ticker: "BMY",
    status: "Mentioned on call",
    priority: "high",
    owner: "Unassigned",
    eventFocus: "Earnings, IR day",
    ascoRole: "Major exhibitor",
  },
  {
    name: "Novartis",
    ticker: "NVS",
    status: "Mentioned on call",
    priority: "high",
    owner: "Unassigned",
    eventFocus: "Webcasts, earnings",
    ascoRole: "Sponsor",
  },
  {
    name: "Pfizer Oncology",
    ticker: "PFE",
    status: "Cold",
    priority: "high",
    owner: "Unassigned",
    eventFocus: "Earnings, investor day",
    ascoRole: "Major exhibitor",
  },
  {
    name: "Merck",
    ticker: "MRK",
    status: "Cold",
    priority: "high",
    owner: "Unassigned",
    eventFocus: "Earnings, webcasts",
    ascoRole: "Major exhibitor",
  },
  {
    name: "GSK Oncology",
    ticker: "GSK",
    status: "Cold",
    priority: "high",
    owner: "Peter",
    eventFocus: "Earnings 2026-27",
    ascoRole: "Major exhibitor",
  },
  {
    name: "Roche / Genentech",
    ticker: "RHHBY",
    status: "Cold",
    priority: "high",
    owner: "Unassigned",
    eventFocus: "IR, investor day",
    ascoRole: "Major exhibitor",
  },
  {
    name: "Johnson & Johnson Oncology",
    ticker: "JNJ",
    status: "Cold",
    priority: "high",
    owner: "Unassigned",
    eventFocus: "Investor day, earnings",
    ascoRole: "Exhibitor",
  },
  {
    name: "Regeneron",
    ticker: "REGN",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Earnings, webcasts",
    ascoRole: "Exhibitor",
  },
  {
    name: "Sanofi",
    ticker: "SNY",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Earnings, IR",
    ascoRole: "Exhibitor",
  },
  {
    name: "Takeda Oncology",
    ticker: "TAK",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Webcasts, events",
    ascoRole: "Exhibitor",
  },
  {
    name: "Daiichi Sankyo",
    ticker: "DSNKY",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Investor events",
    ascoRole: "Exhibitor",
  },
  {
    name: "Eisai",
    ticker: "ESALY",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Webcasts",
    ascoRole: "Exhibitor",
  },
  {
    name: "Aurinia Pharmaceuticals",
    ticker: "ALPMF",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Earnings, events",
    ascoRole: "Exhibitor",
  },
  {
    name: "Incyte",
    ticker: "INCY",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Earnings, IR",
    ascoRole: "Exhibitor",
  },
  {
    name: "Exelixis",
    ticker: "EXEL",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Webcasts",
    ascoRole: "Exhibitor",
  },
  {
    name: "Seagen (absorbed into Pfizer)",
    ticker: "",
    status: "Cold",
    priority: "low",
    owner: "Unassigned",
    eventFocus: "Absorbed into Pfizer",
    ascoRole: "Exhibitor",
  },
  {
    name: "Bayer Oncology",
    ticker: "",
    privateLabel: "Private",
    status: "Cold",
    priority: "low",
    owner: "Unassigned",
    eventFocus: "Webcasts, EU focus",
    ascoRole: "Exhibitor",
  },
  {
    name: "Grail",
    ticker: "GRAL",
    status: "Existing client",
    priority: "high",
    owner: "Kaylee",
    eventFocus: "ASCO event + callbacks",
    ascoRole: "Presenting",
  },
  {
    name: "EarlySense",
    ticker: "",
    privateLabel: "Private",
    status: "Cold",
    priority: "medium",
    owner: "Unassigned",
    eventFocus: "Investor events",
    ascoRole: "Exhibitor",
  },
  {
    name: "Myriad Genetics",
    ticker: "MYGN",
    status: "Cold",
    priority: "low",
    owner: "Unassigned",
    eventFocus: "Diagnostics, webcasts",
    ascoRole: "Exhibitor",
  },
];

/* ─── Style helpers ─── */

const serif = { fontFamily: "Georgia, serif" };

function statusBadge(status: OEStatus) {
  if (status === "Existing client")
    return {
      background: "#f0fdf4",
      color: "#15803d",
      border: "1px solid #bbf7d0",
    };
  if (status === "Mentioned on call")
    return {
      background: "#fffbeb",
      color: "#b45309",
      border: "1px solid #fde68a",
    };
  return {
    background: "#f9fafb",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
  };
}

function priorityBadge(priority: Priority) {
  if (priority === "high")
    return {
      background: "#f0fafa",
      color: "#008285",
      border: "1px solid #99e0e1",
    };
  if (priority === "medium")
    return {
      background: "#eff6ff",
      color: "#2563eb",
      border: "1px solid #bfdbfe",
    };
  return {
    background: "#f9fafb",
    color: "#9ca3af",
    border: "1px solid #e5e7eb",
  };
}

/* ─── Storage helpers ─── */

function storageKey(c: Company): string {
  if (c.ticker) return `asco_contacts_${c.ticker}`;
  const slug = c.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `asco_contacts_${slug}`;
}

function relativeDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

const METHOD_OPTIONS = ["Email", "Call", "LinkedIn", "Meeting"];
const BY_OPTIONS = ["Mithun", "Cara", "Peter", "Kaylee", "Kristen", "Other"];
const OUTCOME_OPTIONS = [
  "No response",
  "Interested",
  "Not interested",
  "Follow-up scheduled",
  "Already a client",
];

/* ─── Page ─── */

export default function AscoTracker() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [allContacts, setAllContacts] = useState<Record<string, ContactEntry[]>>({});
  const [drawerCompany, setDrawerCompany] = useState<Company | null>(null);
  const [formState, setFormState] = useState({
    date: todayStr(),
    method: "Email",
    by: "Mithun",
    notes: "",
    outcome: "No response",
  });

  // Load all contacts from localStorage on mount
  useEffect(() => {
    const loaded: Record<string, ContactEntry[]> = {};
    companies.forEach((c) => {
      try {
        const raw = localStorage.getItem(storageKey(c));
        if (raw) {
          const entries = JSON.parse(raw) as ContactEntry[];
          if (entries.length > 0) loaded[storageKey(c)] = entries;
        }
      } catch {
        // ignore malformed entries
      }
    });
    setAllContacts(loaded);
  }, []);

  // Reset form when drawer opens
  useEffect(() => {
    if (drawerCompany) {
      setFormState({
        date: todayStr(),
        method: "Email",
        by: "Mithun",
        notes: "",
        outcome: "No response",
      });
    }
  }, [drawerCompany?.name]);

  function getCompanyContacts(c: Company): ContactEntry[] {
    return allContacts[storageKey(c)] || [];
  }

  function handleLogContact() {
    if (!drawerCompany) return;
    const entry: ContactEntry = {
      ...formState,
      loggedAt: new Date().toISOString(),
    };
    const key = storageKey(drawerCompany);
    const existing = allContacts[key] || [];
    const updated = [entry, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    setAllContacts((prev) => ({ ...prev, [key]: updated }));
    setFormState({
      date: todayStr(),
      method: "Email",
      by: "Mithun",
      notes: "",
      outcome: "No response",
    });
  }

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q);

      const hasContacts = (allContacts[storageKey(c)] || []).length > 0;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "contacted" && hasContacts) ||
        (statusFilter === "not_contacted" && !hasContacts) ||
        c.status === statusFilter;

      const matchPriority =
        priorityFilter === "all" || c.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [search, statusFilter, priorityFilter, allContacts]);

  function exportExcel() {
    const rows = filtered.map((c) => ({
      Company: c.name,
      Ticker: c.ticker || c.privateLabel || "",
      "OE Status": c.status,
      Priority: c.priority,
      Owner: c.owner,
      "Event Focus": c.eventFocus,
      "ASCO Role": c.ascoRole,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ASCO 2026");
    XLSX.writeFile(wb, "ASCO-2026-outreach.xlsx");
  }

  const contactedCount = companies.filter(
    (c) => (allContacts[storageKey(c)] || []).length > 0
  ).length;

  const stats = {
    total: companies.length,
    existing: companies.filter((c) => c.status === "Existing client").length,
    mentioned: companies.filter((c) => c.status === "Mentioned on call").length,
    cold: companies.filter((c) => c.status === "Cold").length,
    contacted: contactedCount,
  };

  const drawerContacts = drawerCompany ? getCompanyContacts(drawerCompany) : [];

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    fontSize: 12.5,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    outline: "none",
    color: "#111827",
    background: "#fff",
    boxSizing: "border-box" as const,
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={() => setDrawerCompany(null)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.22)",
          zIndex: 999,
          opacity: drawerCompany ? 1 : 0,
          pointerEvents: drawerCompany ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 420,
          height: "100%",
          background: "#fff",
          boxShadow: "-4px 0 32px rgba(0,0,0,0.13)",
          zIndex: 1000,
          transform: drawerCompany ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {drawerCompany && (
          <>
            {/* Drawer header */}
            <div
              style={{
                padding: "20px 20px 16px",
                borderBottom: "1px solid #f0f0f0",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <p
                    style={{
                      ...serif,
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 3,
                    }}
                  >
                    {drawerCompany.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {(drawerCompany.ticker || drawerCompany.privateLabel) && (
                      <span style={{ fontSize: 11.5, color: "#9ca3af" }}>
                        {drawerCompany.ticker || drawerCompany.privateLabel}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: 20,
                        ...statusBadge(drawerCompany.status),
                      }}
                    >
                      {drawerCompany.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerCompany(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: "2px 6px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Log Contact form */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#9ca3af",
                  marginBottom: 12,
                }}
              >
                Log Contact
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) => setFormState((p) => ({ ...p, date: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>
                    Method
                  </label>
                  <select
                    value={formState.method}
                    onChange={(e) => setFormState((p) => ({ ...p, method: e.target.value }))}
                    style={inputStyle}
                  >
                    {METHOD_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>
                  By
                </label>
                <select
                  value={formState.by}
                  onChange={(e) => setFormState((p) => ({ ...p, by: e.target.value }))}
                  style={inputStyle}
                >
                  {BY_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>
                  Outcome
                </label>
                <select
                  value={formState.outcome}
                  onChange={(e) => setFormState((p) => ({ ...p, outcome: e.target.value }))}
                  style={inputStyle}
                >
                  {OUTCOME_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 4 }}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formState.notes}
                  onChange={(e) => setFormState((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Any context, next steps..."
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <button
                onClick={handleLogContact}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  background: "#008285",
                  color: "#fff",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
              >
                Log it
              </button>
            </div>

            {/* Contact history */}
            <div style={{ padding: "18px 20px", flex: 1 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#9ca3af",
                  marginBottom: 14,
                }}
              >
                History{drawerContacts.length > 0 ? ` · ${drawerContacts.length}` : ""}
              </p>

              {drawerContacts.length === 0 ? (
                <p style={{ fontSize: 12.5, color: "#c0c0c0", fontStyle: "italic" }}>
                  No contacts logged yet.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {drawerContacts.map((entry, i) => (
                    <div
                      key={entry.loggedAt}
                      style={{
                        display: "flex",
                        gap: 12,
                        paddingBottom: i < drawerContacts.length - 1 ? 16 : 0,
                      }}
                    >
                      {/* Timeline line + dot */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#008285",
                            marginTop: 4,
                            flexShrink: 0,
                          }}
                        />
                        {i < drawerContacts.length - 1 && (
                          <div
                            style={{
                              width: 1,
                              flex: 1,
                              background: "#e5e7eb",
                              marginTop: 4,
                            }}
                          />
                        )}
                      </div>

                      {/* Entry content */}
                      <div style={{ flex: 1, paddingBottom: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: 3,
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>
                            {entry.method} · {entry.by}
                          </span>
                          <span style={{ fontSize: 11, color: "#9ca3af" }}>
                            {relativeDate(entry.date)}
                          </span>
                        </div>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 11,
                            fontWeight: 500,
                            padding: "2px 7px",
                            borderRadius: 20,
                            background:
                              entry.outcome === "Interested" || entry.outcome === "Already a client"
                                ? "#f0fdf4"
                                : entry.outcome === "Not interested"
                                ? "#fef2f2"
                                : entry.outcome === "Follow-up scheduled"
                                ? "#fffbeb"
                                : "#f9fafb",
                            color:
                              entry.outcome === "Interested" || entry.outcome === "Already a client"
                                ? "#15803d"
                                : entry.outcome === "Not interested"
                                ? "#dc2626"
                                : entry.outcome === "Follow-up scheduled"
                                ? "#b45309"
                                : "#6b7280",
                            border:
                              entry.outcome === "Interested" || entry.outcome === "Already a client"
                                ? "1px solid #bbf7d0"
                                : entry.outcome === "Not interested"
                                ? "1px solid #fecaca"
                                : entry.outcome === "Follow-up scheduled"
                                ? "1px solid #fde68a"
                                : "1px solid #e5e7eb",
                            marginBottom: entry.notes ? 5 : 0,
                          }}
                        >
                          {entry.outcome}
                        </span>
                        {entry.notes && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#6b7280",
                              lineHeight: 1.45,
                              marginTop: 4,
                            }}
                          >
                            {entry.notes}
                          </p>
                        )}
                        <p style={{ fontSize: 10.5, color: "#d1d5db", marginTop: 4 }}>
                          {entry.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <p
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "#c0c0c0",
          marginBottom: 12,
        }}
      >
        ASCO 2026
      </p>
      <h1
        style={{
          ...serif,
          fontSize: 32,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: 6,
        }}
      >
        Pharma Outreach Tracker
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 28 }}>
        May 29 – June 2, 2026 &middot; McCormick Place, Chicago &middot; 500+ exhibitors
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search company or owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: 13,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          outline: "none",
          marginBottom: 10,
          boxSizing: "border-box",
          color: "#111827",
        }}
      />

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {(
          [
            {
              value: statusFilter,
              set: setStatusFilter,
              options: [
                { value: "all", label: "All statuses" },
                { value: "Existing client", label: "Existing client" },
                { value: "Mentioned on call", label: "Mentioned on call" },
                { value: "Cold", label: "Cold" },
                { value: "contacted", label: "Contacted" },
                { value: "not_contacted", label: "Not contacted" },
              ],
            },
            {
              value: priorityFilter,
              set: setPriorityFilter,
              options: [
                { value: "all", label: "All priorities" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ],
            },
          ] as const
        ).map((filter, i) => (
          <select
            key={i}
            value={filter.value}
            onChange={(e) => filter.set(e.target.value)}
            style={{
              flex: 1,
              padding: "9px 12px",
              fontSize: 13,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
              color: "#374151",
              outline: "none",
            }}
          >
            {filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Total companies", value: stats.total },
          { label: "Existing clients", value: stats.existing },
          { label: "Mentioned on call", value: stats.mentioned },
          { label: "Cold targets", value: stats.cold },
          { label: "Contacted", value: stats.contacted, highlight: true },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              border: s.highlight ? "1px solid #99e0e1" : "1px solid #f0f0f0",
              borderRadius: 10,
              padding: "12px 14px",
              background: s.highlight ? "#f0fafa" : "#fff",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: s.highlight ? "#008285" : "#9ca3af",
                marginBottom: 4,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                ...serif,
                fontSize: 26,
                fontWeight: 700,
                color: s.highlight ? "#008285" : "#111827",
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table header row with export */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button
          onClick={exportExcel}
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#008285",
            background: "#f0fafa",
            border: "1px solid #99e0e1",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
          }}
        >
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.4fr 0.7fr 0.8fr 0.9fr 1.3fr 1fr",
            padding: "10px 14px",
            background: "#f9fafb",
            borderBottom: "1px solid #f0f0f0",
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            color: "#9ca3af",
            gap: 8,
          }}
        >
          <div>Company</div>
          <div>OE status</div>
          <div>Priority</div>
          <div>Owner</div>
          <div>Last contacted</div>
          <div>Event focus</div>
          <div>ASCO role</div>
        </div>

        {/* Data rows */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "32px 14px",
              textAlign: "center",
              fontSize: 13,
              color: "#c0c0c0",
            }}
          >
            No companies match your filters.
          </div>
        ) : (
          filtered.map((c, i) => {
            const contacts = getCompanyContacts(c);
            const lastContact = contacts.length > 0 ? contacts[0] : null;
            return (
              <div
                key={c.name}
                onClick={() => setDrawerCompany(c)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.4fr 0.7fr 0.8fr 0.9fr 1.3fr 1fr",
                  padding: "11px 14px",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #f9f9f9" : "none",
                  background: i % 2 === 0 ? "#fff" : "#fafafa",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12.5,
                  cursor: "pointer",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#f0fafa";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    i % 2 === 0 ? "#fff" : "#fafafa";
                }}
              >
                {/* Company */}
                <div>
                  <p
                    style={{
                      fontWeight: 500,
                      color: "#111827",
                      lineHeight: 1.3,
                      marginBottom: 1,
                    }}
                  >
                    {c.name}
                  </p>
                  <p style={{ fontSize: 10.5, color: "#c0c0c0" }}>
                    {c.ticker || c.privateLabel || ""}
                  </p>
                </div>

                {/* Status badge */}
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 9px",
                      borderRadius: 20,
                      whiteSpace: "nowrap" as const,
                      ...statusBadge(c.status),
                    }}
                  >
                    {c.status}
                  </span>
                </div>

                {/* Priority badge */}
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 9px",
                      borderRadius: 20,
                      ...priorityBadge(c.priority),
                    }}
                  >
                    {c.priority}
                  </span>
                </div>

                {/* Owner */}
                <div style={{ color: "#6b7280", fontSize: 12 }}>{c.owner}</div>

                {/* Last contacted */}
                <div>
                  {lastContact ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        color: "#008285",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#008285",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      />
                      {relativeDate(lastContact.date)}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "#d1d5db" }}>Not yet</span>
                  )}
                </div>

                {/* Event focus */}
                <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.4 }}>
                  {c.eventFocus}
                </div>

                {/* ASCO role */}
                <div style={{ color: "#6b7280", fontSize: 12 }}>{c.ascoRole}</div>
              </div>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p
          style={{
            fontSize: 11,
            color: "#c0c0c0",
            textAlign: "right",
            marginTop: 8,
          }}
        >
          Showing {filtered.length} of {companies.length} companies
        </p>
      )}
    </>
  );
}
