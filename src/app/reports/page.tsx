const serif = { fontFamily: "Georgia, serif" };

export default function Reports() {
  return (
    <>
      <h1 style={{ ...serif, fontSize: 36, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
        Weekly Reports
      </h1>
      <p style={{ ...serif, fontSize: 15, color: "#9ca3af", lineHeight: 1.65, marginTop: 8 }}>
        Week-by-week updates and progress tracking.
      </p>
      <div style={{ width: 40, height: 3, background: "#111827", borderRadius: 2, marginTop: 16, marginBottom: 32 }} />
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ ...serif, fontSize: 18, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", marginBottom: 6 }}>
            Week 2
          </h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>Feb 23-27, 2026</p>
          <p style={{ ...serif, fontSize: 14, color: "#9ca3af", lineHeight: 1.65 }}>
            27 meetings across sales, delivery, product, engineering, and the Zoom partnership.
          </p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#008285", background: "#f0fafa", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>
          27 meetings
        </span>
      </div>
    </>
  );
}
