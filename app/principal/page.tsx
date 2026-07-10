"use client";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "pending" | "approved";
type Circular = {
  id: number;
  title: string;
  file: string;
  staff: string;
  department: string;
  hod: string;
  date: string;
  status: "pending" | "approved";
};

// ─── Sample Data ──────────────────────────────────────────────────────────────
const CIRCULARS: Circular[] = [
  { id: 1, title: "Anti-Ragging Awareness Programme", file: "anti-ragging.pdf", staff: "Dr. Suresh Babu", department: "Student Welfare", hod: "Dr. R. Venkatesh", date: "1/7/2026", status: "pending" },
  { id: 2, title: "Staff Development Workshop", file: "sdw-2026.pdf", staff: "Prof. Priya Mohan", department: "Training & Development", hod: "Dr. R. Venkatesh", date: "30/6/2026", status: "pending" },
  { id: 3, title: "Independence Day Celebration", file: "independence-day.pdf", staff: "Mrs. Rekha Pillai", department: "Cultural Committee", hod: "Dr. R. Venkatesh", date: "28/6/2026", status: "approved" },
  { id: 4, title: "New Academic Year Orientation", file: "orientation-2026.pdf", staff: "Dr. Anil Kumar", department: "Academic Affairs", hod: "Dr. R. Venkatesh", date: "25/6/2026", status: "approved" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconDoc = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconPen = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

// ─── Circular Viewer Modal ────────────────────────────────────────────────────
function CircularViewer({
  circular,
  onClose,
  onApprove,
}: {
  circular: Circular;
  onClose: () => void;
  onApprove: (id: number) => void;
}) {
  const [mode, setMode] = useState<"view" | "changes">("view");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSendChanges = () => {
    if (!comment.trim()) return;
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handleApprove = () => {
    setSigned(true);
    setTimeout(() => {
      onApprove(circular.id);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(28,43,30,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[rgba(58,107,71,0.12)]">
          <div>
            <p className="text-[#6b7f6d] text-xs tracking-widest uppercase mb-0.5">e-Circular Document</p>
            <h2 className="text-[#1c2b1e] text-lg font-semibold" style={{ fontFamily: "'Gilda Display', serif" }}>{circular.title}</h2>
            <p className="text-[#a0b4a3] text-xs mt-0.5">Issued by <span className="text-[#3a6b47] font-medium">{circular.staff}</span> · {circular.department} · Forwarded by {circular.hod} · {circular.date}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#6b7f6d] hover:bg-[#f2f5f0] hover:text-[#1c2b1e] transition-all">
            <IconX />
          </button>
        </div>

        {/* Document preview area */}
        <div className="flex-1 overflow-y-auto px-7 py-6 bg-[#f8faf8]">
          <div className="bg-white rounded-xl border border-[rgba(58,107,71,0.1)] min-h-80 p-8 relative shadow-sm">
            {/* Mock document content */}
            <div className="text-center mb-8">
              <p className="text-[#1c2b1e] text-xs tracking-widest uppercase font-semibold mb-1">Government College of Engineering</p>
              <p className="text-[#6b7f6d] text-xs mb-4">Department of {circular.department}</p>
              <div className="w-16 h-px bg-[rgba(58,107,71,0.2)] mx-auto mb-4" />
              <h3 className="text-[#1c2b1e] text-xl font-semibold mb-1" style={{ fontFamily: "'Gilda Display', serif" }}>{circular.title}</h3>
              <p className="text-[#a0b4a3] text-xs">Ref No: GCE/{circular.department.slice(0,3).toUpperCase()}/2026/{String(circular.id).padStart(3,"0")} · Date: {circular.date}</p>
            </div>
            <div className="space-y-3 text-[#3a4a3c] text-sm leading-relaxed">
              <p>All students and staff members are hereby informed regarding the above-mentioned circular. This communication is issued on behalf of the college administration and is to be followed with immediate effect.</p>
              <p>The concerned departments are requested to take necessary action and ensure compliance. Any queries may be addressed to the office of the Head of Department.</p>
              <p>This circular is issued with the approval of the academic committee and shall remain in force until further notice.</p>
            </div>

            {/* Signature boxes */}
            <div className="flex gap-6 mt-10 pt-6 border-t border-[rgba(58,107,71,0.1)]">
              <div className="flex-1 border border-dashed border-[rgba(58,107,71,0.25)] rounded-xl p-4 min-h-[80px] flex flex-col items-center justify-center">
                <p className="text-[#a0b4a3] text-xs mb-1">Staff Signature</p>
                <p className="text-[#3a6b47] text-sm font-medium italic" style={{ fontFamily: "'Gilda Display', serif" }}>{circular.staff.split(" ").slice(-1)[0]}</p>
              </div>
              <div className="flex-1 border border-dashed border-[#3a6b47] bg-[#f0f7f2] rounded-xl p-4 min-h-[80px] flex flex-col items-center justify-center">
                <p className="text-[#a0b4a3] text-xs mb-1">HOD Signature</p>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[#3a6b47] text-sm font-semibold italic" style={{ fontFamily: "'Gilda Display', serif" }}>{circular.hod}</p>
                  <p className="text-[#a0b4a3] text-[10px]">Digitally signed</p>
                </div>
              </div>
              <div className={`flex-1 border border-dashed rounded-xl p-4 min-h-[80px] flex flex-col items-center justify-center transition-all duration-700 ${signed ? "border-[#3a6b47] bg-[#f0f7f2]" : "border-[rgba(58,107,71,0.25)]"}`}>
                <p className="text-[#a0b4a3] text-xs mb-1">Principal Signature</p>
                {signed ? (
                  <div className="flex flex-col items-center gap-1">
                    <IconPen />
                    <p className="text-[#3a6b47] text-sm font-semibold italic" style={{ fontFamily: "'Gilda Display', serif" }}>Dr. K. Balasubramaniam</p>
                    <p className="text-[#a0b4a3] text-[10px]">Digitally signed · {new Date().toLocaleDateString("en-IN")}</p>
                  </div>
                ) : (
                  <p className="text-[#c8d9ca] text-xs italic">Pending Principal approval</p>
                )}
              </div>
            </div>
          </div>

          {/* Changes comment box */}
          {mode === "changes" && (
            <div className="mt-4 bg-white rounded-xl border border-[rgba(58,107,71,0.15)] p-5 shadow-sm">
              <p className="text-[#1c2b1e] text-sm font-semibold mb-1">Request Changes</p>
              <p className="text-[#6b7f6d] text-xs mb-3">Describe the corrections needed. This will be forwarded back to <span className="text-[#3a6b47]">{circular.hod}</span>.</p>
              {sent ? (
                <div className="flex items-center gap-2 text-[#3a6b47] text-sm py-2">
                  <IconCheck /> <span>Feedback sent to {circular.hod}. Closing…</span>
                </div>
              ) : (
                <>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="e.g. Please update the date in paragraph 2 and correct the reference number format…"
                    rows={4}
                    className="w-full text-sm text-[#1c2b1e] placeholder-[#c8d9ca] bg-[#f7faf7] border border-[rgba(58,107,71,0.18)] rounded-lg p-3 outline-none focus:border-[#3a6b47] focus:ring-2 focus:ring-[#3a6b47]/15 resize-none transition-all"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleSendChanges}
                      disabled={!comment.trim()}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg,#3a6b47,#2a5238)" }}
                    >
                      <IconSend /> Forward to HOD
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-[rgba(58,107,71,0.1)] bg-white">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(58,107,71,0.2)] text-[#6b7f6d] text-sm font-medium hover:bg-[#f2f5f0] hover:text-[#1c2b1e] transition-all"
          >
            <IconX /> Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setMode(mode === "changes" ? "view" : "changes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${mode === "changes" ? "bg-amber-50 border-amber-300 text-amber-700" : "border-[rgba(58,107,71,0.2)] text-[#3a6b47] hover:bg-[#f0f7f2]"}`}
            >
              <IconEdit /> Request Changes
            </button>
            <button
              onClick={handleApprove}
              disabled={signed}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: signed ? "#6b9e7b" : "linear-gradient(135deg,#3a6b47,#2a5238)", boxShadow: signed ? "none" : "0 4px 16px rgba(58,107,71,0.3)" }}
            >
              <IconCheck /> {signed ? "Approved — Circular Finalized" : "Approve & Sign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Principal Portal ─────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>("pending");
  const [circulars, setCirculars] = useState<Circular[]>(CIRCULARS);
  const [openCircular, setOpenCircular] = useState<Circular | null>(null);

  const pending = circulars.filter((c) => c.status === "pending");
  const approved = circulars.filter((c) => c.status === "approved");

  const handleApprove = (id: number) => {
    setCirculars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
    );
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pending", label: "Pending Approval", count: pending.length },
    { key: "approved", label: "Approved", count: approved.length },
  ];

  const rows = tab === "pending" ? pending : approved;

  const statusBadge = (status: string) => {
    if (status === "approved") return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e6f4eb] text-[#2d6a40]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3a6b47] inline-block" /> Approved
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" /> Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#eeeae4", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-4" style={{ background: "#1c2b1e" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80">
            <IconDoc />
          </div>
          <div>
            <p className="text-white/40 text-[10px] tracking-widest uppercase leading-none mb-0.5">Principal Portal</p>
            <p className="text-white text-lg leading-none" style={{ fontFamily: "'Gilda Display', serif" }}>e-Circular</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-white/40 text-sm">Signed in as <span className="text-white/70">principal@organisation.org</span></p>
          <div className="w-8 h-8 rounded-full bg-[#3a6b47] flex items-center justify-center text-white text-xs font-bold">P</div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-8 py-8 max-w-6xl w-full mx-auto">

        {/* Tabs + info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-[rgba(58,107,71,0.08)]">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${tab === key ? "bg-[#1c2b1e] text-white shadow" : "text-[#6b7f6d] hover:text-[#1c2b1e]"}`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === key ? "bg-white/20 text-white" : "bg-[#e8ede9] text-[#6b7f6d]"}`}>{count}</span>
              </button>
            ))}
          </div>
          <p className="text-[#6b7f6d] text-sm">Office of the Principal</p>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-[rgba(58,107,71,0.08)] shadow-sm overflow-hidden">

          {/* Tab description row */}
          <div className="px-7 py-4 border-b border-[rgba(58,107,71,0.08)] flex items-center justify-between">
            <div>
              <p className="text-[#1c2b1e] text-sm font-semibold">
                {tab === "pending" && "Circulars forwarded by HODs — final approval required"}
                {tab === "approved" && "Circulars fully approved and finalized"}
              </p>
              <p className="text-[#a0b4a3] text-xs mt-0.5">
                {tab === "pending" && "Open any circular to review, request changes, or give final approval."}
                {tab === "approved" && "These circulars have completed the full approval workflow."}
              </p>
            </div>
            {rows.length > 0 && (
              <span className="text-[#6b7f6d] text-xs">{rows.length} circular{rows.length > 1 ? "s" : ""}</span>
            )}
          </div>

          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0f7f2] flex items-center justify-center text-[#b7cdb9] mb-4">
                <IconDoc />
              </div>
              <p className="text-[#6b7f6d] text-sm font-medium">No circulars here</p>
              <p className="text-[#a0b4a3] text-xs mt-1">
                {tab === "pending" && "No circulars awaiting your approval."}
                {tab === "approved" && "No approved circulars yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(58,107,71,0.08)]" style={{ background: "#f7faf7" }}>
                  <th className="text-left px-4 py-3 text-[#6b7f6d] text-xs font-semibold tracking-wider uppercase">Circular</th>
                  <th className="text-left px-4 py-3 text-[#6b7f6d] text-xs font-semibold tracking-wider uppercase">Forwarded By</th>
                  <th className="text-left px-4 py-3 text-[#6b7f6d] text-xs font-semibold tracking-wider uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-[#6b7f6d] text-xs font-semibold tracking-wider uppercase">Status</th>
                  {tab === "pending" && (
                    <th className="text-right px-4 py-3 text-[#6b7f6d] text-xs font-semibold tracking-wider uppercase">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b border-[rgba(58,107,71,0.06)] transition-colors hover:bg-[#f9fbf9] ${i === rows.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-[#1c2b1e] font-medium">{c.title}</p>
                      <p className="text-[#a0b4a3] text-xs mt-0.5">{c.file}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#1c2b1e] text-sm">{c.hod}</p>
                      <p className="text-[#a0b4a3] text-xs mt-0.5">{c.department}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6b7f6d] text-sm">{c.date}</td>
                    <td className="px-4 py-3">{statusBadge(c.status)}</td>
                    {tab === "pending" && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setOpenCircular(c)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[rgba(58,107,71,0.25)] text-[#3a6b47] text-xs font-semibold hover:bg-[#f0f7f2] hover:border-[#3a6b47]/50 transition-all"
                        >
                          <IconEye /> Open
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ── Circular Viewer Modal ── */}
      {openCircular && (
        <CircularViewer
          circular={openCircular}
          onClose={() => setOpenCircular(null)}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
}