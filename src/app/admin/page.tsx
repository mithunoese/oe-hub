"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

const WEEKS = [
  { value: "week-2", label: "Week 2 — Feb 23–27, 2026" },
  { value: "week-3", label: "Week 3 — Mar 2–6, 2026" },
  { value: "week-4", label: "Week 4 — Mar 9–13, 2026" },
  { value: "week-5", label: "Week 5 — Mar 16–20, 2026" },
  { value: "week-6", label: "Week 6 — Mar 23–27, 2026" },
  { value: "week-7", label: "Week 7 — Mar 30–Apr 3, 2026" },
];

interface UploadedPdf {
  week: string;
  filename: string;
  uploaded_at: string;
}

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [selectedWeek, setSelectedWeek] = useState("week-5");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [uploaded, setUploaded] = useState<UploadedPdf[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchUploaded = useCallback(async (currentPin: string) => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/report-pdf", {
        headers: { "x-admin-pin": currentPin },
      });
      const data = await res.json();
      setUploaded(data.pdfs ?? []);
    } catch {
      setUploaded([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  function handleLogin() {
    if (pin.trim() === "") return;
    // We'll validate by trying the API
    fetch("/api/report-pdf", { headers: { "x-admin-pin": pin } })
      .then((r) => {
        if (r.ok) {
          setAuthenticated(true);
          setPinError(false);
          fetchUploaded(pin);
        } else {
          setPinError(true);
        }
      })
      .catch(() => setPinError(true));
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  }, []);

  async function handleUpload() {
    if (!file || !selectedWeek) return;
    setUploading(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append("week", selectedWeek);
      form.append("file", file);
      const res = await fetch("/api/report-pdf", {
        method: "POST",
        headers: { "x-admin-pin": pin },
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", msg: `✓ Uploaded "${file.name}" for ${selectedWeek}` });
        setFile(null);
        fetchUploaded(pin);
      } else {
        setStatus({ type: "error", msg: data.error ?? "Upload failed" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: String(err) });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(week: string) {
    if (!confirm(`Remove PDF for ${week}?`)) return;
    await fetch("/api/report-pdf", {
      method: "DELETE",
      headers: { "x-admin-pin": pin, "Content-Type": "application/json" },
      body: JSON.stringify({ week }),
    });
    fetchUploaded(pin);
  }

  // ── PIN screen ──────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <main style={{ maxWidth: 400, margin: "100px auto", padding: "0 24px", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Open Exchange
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Admin</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>Enter your PIN to manage report PDFs.</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="PIN"
          style={{
            width: "100%",
            border: `1px solid ${pinError ? "#ef4444" : "#e5e7eb"}`,
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 16,
            outline: "none",
            marginBottom: 8,
            boxSizing: "border-box",
          }}
        />
        {pinError && <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 8 }}>Incorrect PIN.</p>}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            background: "#008285",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "11px 0",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </main>
    );
  }

  // ── Upload screen ───────────────────────────────────────────────────────────
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px", fontFamily: "system-ui, sans-serif" }}>
      <Link
        href="/reports"
        style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}
      >
        ← Back to Reports
      </Link>

      <p style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Admin</p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Upload Report PDF</h1>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
        Upload a PDF to attach it to a weekly report. Stored in the database — no redeploy needed.
      </p>

      {/* Week selector */}
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        Week
      </label>
      <select
        value={selectedWeek}
        onChange={(e) => setSelectedWeek(e.target.value)}
        style={{
          width: "100%",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 14,
          color: "#111827",
          background: "#fff",
          marginBottom: 20,
          boxSizing: "border-box",
        }}
      >
        {WEEKS.map((w) => (
          <option key={w.value} value={w.value}>{w.label}</option>
        ))}
      </select>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#008285" : file ? "#008285" : "#d1d5db"}`,
          borderRadius: 12,
          padding: "40px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#f0fafa" : file ? "#f0fafa" : "#fafafa",
          transition: "all 0.15s",
          marginBottom: 16,
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />
        {file ? (
          <>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#008285", marginBottom: 4 }}>{file.name}</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>{(file.size / 1024).toFixed(0)} KB · Click to change</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⬆️</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
              Drop PDF here or click to browse
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>PDF files only</p>
          </>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          width: "100%",
          background: file && !uploading ? "#008285" : "#d1d5db",
          color: file && !uploading ? "#fff" : "#9ca3af",
          border: "none",
          borderRadius: 8,
          padding: "12px 0",
          fontSize: 15,
          fontWeight: 600,
          cursor: file && !uploading ? "pointer" : "not-allowed",
          transition: "background 0.15s",
          marginBottom: 12,
        }}
      >
        {uploading ? "Uploading…" : "Upload PDF"}
      </button>

      {status && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: status.type === "success" ? "#f0fafa" : "#fef2f2",
            border: `1px solid ${status.type === "success" ? "#a7f3d0" : "#fca5a5"}`,
            fontSize: 13,
            color: status.type === "success" ? "#065f46" : "#b91c1c",
            marginBottom: 32,
          }}
        >
          {status.msg}
          {status.type === "success" && (
            <Link
              href={`/reports/${selectedWeek}`}
              style={{ marginLeft: 12, color: "#008285", textDecoration: "underline" }}
            >
              View report →
            </Link>
          )}
        </div>
      )}

      {/* Existing uploads */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12, marginTop: 32 }}>
        Uploaded PDFs
      </h2>
      {loadingList ? (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>Loading…</p>
      ) : uploaded.length === 0 ? (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>No PDFs uploaded yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {uploaded.map((p) => (
            <div
              key={p.week}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{p.week}</span>
                <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 10 }}>{p.filename}</span>
                <span style={{ fontSize: 11, color: "#d1d5db", marginLeft: 8 }}>
                  {new Date(p.uploaded_at).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={`/api/report-pdf/${p.week}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 12, color: "#008285", textDecoration: "none", fontWeight: 500 }}
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(p.week)}
                  style={{ fontSize: 12, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
