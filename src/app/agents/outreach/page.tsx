"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const serif = { fontFamily: "Georgia, serif" };
const sans = { fontFamily: "system-ui, sans-serif" };

export interface OutreachItem {
  id: string;
  companyName: string;
  industry: string;
  targetRole: string;
  subject: string;
  body: string;
  status: "pending" | "sent";
  createdAt: string;
  toEmail?: string;
}

const STORAGE_KEY = "oe-hub-outreach-queue";

export function loadQueue(): OutreachItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveToQueue(item: Omit<OutreachItem, "id" | "status" | "createdAt">) {
  const queue = loadQueue();
  const newItem: OutreachItem = {
    ...item,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newItem, ...queue]));
  return newItem;
}

type FilterType = "all" | "pending" | "sent";

export default function OutreachQueuePage() {
  const [queue, setQueue] = useState<OutreachItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showPreview, setShowPreview] = useState(false);
  const [emails, setEmails] = useState<Record<string, string>>({});

  useEffect(() => {
    setQueue(loadQueue());
  }, []);

  const refresh = () => setQueue(loadQueue());

  const markSent = (id: string) => {
    const updated = loadQueue().map((item) =>
      item.id === id ? { ...item, status: "sent" as const, sentAt: new Date().toISOString() } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    refresh();
  };

  const deleteItem = (id: string) => {
    const updated = loadQueue().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    refresh();
  };

  const updateEmail = (id: string, email: string) => {
    setEmails((prev) => ({ ...prev, [id]: email }));
    const updated = loadQueue().map((item) =>
      item.id === id ? { ...item, toEmail: email } : item
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    refresh();
  };

  const [copied, setCopied] = useState<Record<string, "subject" | "body" | null>>({});

  const mailtoUrl = (item: OutreachItem) => {
    const to = emails[item.id] ?? item.toEmail ?? "";
    // Note: body omitted — mailto with long bodies gets truncated by browsers.
    // Kristen copies the body separately and pastes into Outlook.
    return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(item.subject)}`;
  };

  const copyText = (id: string, text: string, field: "subject" | "body") => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [id]: field }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [id]: null })), 2000);
  };

  const downloadExcel = () => {
    const rows = filteredQueue.map((item) => ({
      Company: item.companyName,
      Industry: item.industry,
      "Target Role": item.targetRole,
      "To Email": item.toEmail ?? "",
      Subject: item.subject,
      "Email Body": item.body,
      Status: item.status,
      "Created At": new Date(item.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Column widths
    ws["!cols"] = [
      { wch: 20 }, // Company
      { wch: 28 }, // Industry
      { wch: 30 }, // Target Role
      { wch: 28 }, // To Email
      { wch: 40 }, // Subject
      { wch: 80 }, // Email Body
      { wch: 10 }, // Status
      { wch: 14 }, // Created At
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Outreach Queue");
    XLSX.writeFile(wb, `outreach-queue-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const filteredQueue =
    filter === "all" ? queue : queue.filter((item) => item.status === filter);

  const pendingCount = queue.filter((i) => i.status === "pending").length;
  const sentCount = queue.filter((i) => i.status === "sent").length;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 96px", ...serif }}>
      {/* Back */}
      <Link href="/agents" style={{ fontSize: 12, color: "#9ca3af", ...sans, textDecoration: "none" }}>
        ← Back to Agents
      </Link>

      {/* Header */}
      <div style={{ marginTop: 24, marginBottom: 40 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#c0c0c0", ...sans, marginBottom: 12 }}>
          Agent
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
          Outreach Queue
        </h1>
        <p style={{ fontSize: 16, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 16px 0" }}>
          Drafted emails for your prospecting targets — one click to open in Outlook, or download all as Excel.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 16 }}>
          {["Zoom Sales", "Outlook Ready", "Excel Export"].map((tag) => (
            <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: "#008285", background: "#f0fafa", border: "1px solid #e0f0f0", padding: "3px 10px", borderRadius: 20, ...sans }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ width: 40, height: 3, background: "#008285", borderRadius: 2 }} />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" as const }}>
        {[
          { value: queue.length, label: "Total" },
          { value: pendingCount, label: "Pending" },
          { value: sentCount, label: "Sent" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 20px", textAlign: "center" as const }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#008285", letterSpacing: "-0.03em" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#6b7280", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions Row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "center", flexWrap: "wrap" as const }}>
        {/* Filter */}
        {(["all", "pending", "sent"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ fontSize: 12, fontWeight: 600, ...sans, padding: "6px 14px", borderRadius: 20, border: filter === f ? "1px solid #008285" : "1px solid #e5e7eb", background: filter === f ? "#008285" : "#fff", color: filter === f ? "#fff" : "#6b7280", cursor: "pointer" }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {filteredQueue.length > 0 && (
            <>
              <button
                onClick={() => setShowPreview(true)}
                style={{ fontSize: 12, fontWeight: 600, ...sans, padding: "7px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer" }}
              >
                Preview Excel
              </button>
              <button
                onClick={downloadExcel}
                style={{ fontSize: 12, fontWeight: 700, ...sans, padding: "7px 16px", borderRadius: 8, border: "none", background: "#008285", color: "#fff", cursor: "pointer" }}
              >
                ↓ Download Excel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Excel Preview Modal */}
      {showPreview && (
        <div style={{ position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, maxWidth: 900, width: "100%", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" as const }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ ...serif, fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Excel Preview</h2>
                <p style={{ fontSize: 12, color: "#9ca3af", ...sans, marginTop: 4 }}>{filteredQueue.length} rows · outreach-queue-{new Date().toISOString().slice(0, 10)}.xlsx</p>
              </div>
              <button onClick={() => setShowPreview(false)} style={{ fontSize: 20, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ overflow: "auto", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 12, ...sans }}>
                <thead>
                  <tr style={{ background: "#f9fafb", position: "sticky" as const, top: 0 }}>
                    {["Company", "Target Role", "To Email", "Subject", "Email Body", "Status"].map((h) => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "10px 14px", color: "#111827", fontWeight: 600, whiteSpace: "nowrap" as const }}>{item.companyName}</td>
                      <td style={{ padding: "10px 14px", color: "#6b7280", whiteSpace: "nowrap" as const }}>{item.targetRole}</td>
                      <td style={{ padding: "10px 14px", color: "#9ca3af", fontStyle: "italic" }}>{item.toEmail || "—"}</td>
                      <td style={{ padding: "10px 14px", color: "#374151", maxWidth: 200 }}>{item.subject}</td>
                      <td style={{ padding: "10px 14px", color: "#6b7280", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{item.body}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: item.status === "sent" ? "#15803d" : "#c2410c", background: item.status === "sent" ? "#f0fdf4" : "#fff7ed", padding: "2px 8px", borderRadius: 20 }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowPreview(false)} style={{ fontSize: 13, fontWeight: 600, ...sans, padding: "9px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer" }}>
                Close
              </button>
              <button
                onClick={() => { setShowPreview(false); downloadExcel(); }}
                style={{ fontSize: 13, fontWeight: 700, ...sans, padding: "9px 20px", borderRadius: 8, border: "none", background: "#008285", color: "#fff", cursor: "pointer" }}
              >
                ↓ Download Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {queue.length === 0 && (
        <div style={{ textAlign: "center" as const, padding: "60px 24px", color: "#9ca3af", ...sans }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>Queue is empty</div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Go to a{" "}
            <Link href="/reports/prospecting" style={{ color: "#008285" }}>Prospecting Report</Link>,
            open a company, and click &quot;Draft Email&quot; to add emails here.
          </p>
        </div>
      )}

      {/* Queue Items */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
        {filteredQueue.map((item) => {
          return (
            <div key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", overflow: "hidden" }}>
              {/* Card Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{item.companyName}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, ...sans, color: item.status === "sent" ? "#15803d" : "#c2410c", background: item.status === "sent" ? "#f0fdf4" : "#fff7ed", border: `1px solid ${item.status === "sent" ? "#bbf7d0" : "#fed7aa"}`, padding: "2px 8px", borderRadius: 20 }}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", ...sans }}>{item.targetRole}</div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{ fontSize: 11, ...sans, padding: "4px 10px", borderRadius: 6, border: "1px solid #fecaca", background: "#fff", color: "#ef4444", cursor: "pointer", flexShrink: 0 }}
                >
                  Remove
                </button>
              </div>

              {/* Email content — always visible */}
              <div style={{ padding: "16px 20px" }}>
                {/* To */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em", display: "block", marginBottom: 5 }}>
                    To
                  </label>
                  <input
                    type="email"
                    placeholder="firstname@company.com"
                    defaultValue={item.toEmail ?? ""}
                    onChange={(e) => updateEmail(item.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: "100%", padding: "7px 11px", fontSize: 13, ...sans, border: "1px solid #e5e7eb", borderRadius: 6, outline: "none", boxSizing: "border-box" as const }}
                  />
                </div>

                {/* Subject */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 5 }}>Subject</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 6, padding: "8px 12px" }}>{item.subject}</div>
                </div>

                {/* Body */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", ...sans, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Message</div>
                    <button
                      onClick={() => copyText(item.id, item.body, "body")}
                      style={{ fontSize: 11, fontWeight: 700, ...sans, padding: "4px 12px", borderRadius: 6, border: copied[item.id] === "body" ? "1px solid #bbf7d0" : "1px solid #e5e7eb", background: copied[item.id] === "body" ? "#f0fdf4" : "#fff", color: copied[item.id] === "body" ? "#15803d" : "#374151", cursor: "pointer", transition: "all 0.15s" }}
                    >
                      {copied[item.id] === "body" ? "✓ Copied!" : "Copy Message"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={item.body}
                    rows={8}
                    style={{ width: "100%", fontSize: 13, color: "#374151", lineHeight: 1.8, background: "#f9fafb", border: "1px solid #f0f0f0", borderRadius: 6, padding: "12px 14px", whiteSpace: "pre-wrap", resize: "vertical", outline: "none", boxSizing: "border-box" as const, fontFamily: "system-ui, sans-serif", cursor: "text" }}
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
                  <a
                    href={mailtoUrl(item)}
                    style={{ fontSize: 12, fontWeight: 700, ...sans, padding: "8px 16px", borderRadius: 8, border: "none", background: "#0072c6", color: "#fff", textDecoration: "none", display: "inline-block" }}
                  >
                    Open Outlook →
                  </a>
                  <button
                    onClick={() => copyText(item.id, item.subject, "subject")}
                    style={{ fontSize: 12, fontWeight: 600, ...sans, padding: "8px 14px", borderRadius: 8, border: copied[item.id] === "subject" ? "1px solid #bbf7d0" : "1px solid #e5e7eb", background: copied[item.id] === "subject" ? "#f0fdf4" : "#fff", color: copied[item.id] === "subject" ? "#15803d" : "#374151", cursor: "pointer" }}
                  >
                    {copied[item.id] === "subject" ? "✓ Copied!" : "Copy Subject"}
                  </button>
                  <span style={{ fontSize: 11, color: "#c0c0c0", ...sans }}>← paste body into Outlook</span>
                  {item.status === "pending" && (
                    <button
                      onClick={() => markSent(item.id)}
                      style={{ fontSize: 12, fontWeight: 600, ...sans, padding: "8px 14px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#15803d", cursor: "pointer", marginLeft: "auto" }}
                    >
                      Mark Sent ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20, marginTop: 48, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#c0c0c0", ...sans }}>
        <span>Open Exchange · Confidential</span>
        <span>Outreach Queue</span>
      </div>
    </div>
  );
}
