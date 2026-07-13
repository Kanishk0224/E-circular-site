"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadCirculars, saveCirculars, type Circular as StoreCircular } from "@/lib/circularStore";

// ─── Icons (unchanged) ────────────────────────────────────────────────────
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
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const IconPen = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────
type Tab = "issued" | "pending" | "approved";

// Demo fallback so the page isn't empty before any staff upload exists
const FALLBACK: StoreCircular[] = [
  {
    id: "c1", title: "Annual Sports Day Notice", fileName: "sports-day.pdf", fileUrl: "#",
    fileType: "application/pdf", uploadedAt: "2026-07-04T00:00:00.000Z",
    hod: "pending", principal: "pending", remarks: [],
    issuedBy: "Dr. Meena Krishnan", department: "Physical Education",
  },
  {
    id: "c2", title: "Internal Exam Schedule – July 2026", fileName: "exam-schedule-jul.pdf", fileUrl: "#",
    fileType: "application/pdf", uploadedAt: "2026-07-03T00:00:00.000Z",
    hod: "pending", principal: "pending", remarks: [],
    issuedBy: "Prof. Arjun Nair", department: "Examination Cell",
  },
  {
    id: "c4", title: "Anti-Ragging Awareness Programme", fileName: "anti-ragging.pdf", fileUrl: "#",
    fileType: "application/pdf", uploadedAt: "2026-07-01T00:00:00.000Z",
    hod: "approved", principal: "pending", remarks: [],
    issuedBy: "Dr. Suresh Babu", department: "Student Welfare",
  },
  {
    id: "c6", title: "Independence Day Celebration", fileName: "independence-day.pdf", fileUrl: "#",
    fileType: "application/pdf", uploadedAt: "2026-06-28T00:00:00.000Z",
    hod: "approved", principal: "approved", remarks: [],
    issuedBy: "Mrs. Rekha Pillai", department: "Cultural Committee",
  },
];

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB"); } catch { return iso; }
}

// ─── Circular Viewer Modal ─────────────────────────────────────────────────
function CircularViewer({
  circular,
  onClose,
  onApprove,
  onRequestChanges,
}: {
  circular: StoreCircular;
  onClose: () => void;
  onApprove: (id: string) => void;
  onRequestChanges: (id: string, message: string) => void;
}) {
  const [mode, setMode] = useState<"view" | "changes">("view");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSendChanges = () => {
    if (!comment.trim()) return;
    setSent(true);
    onRequestChanges(circular.id, comment.trim());
    setTimeout(() => onClose(), 1800);
  };

  const handleApprove = () => {
    setSigned(true);
    setTimeout(() => {
      onApprove(circular.id);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,42,34,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#0f2a22]/10">
          <div>
            <p className="text-[#0f2a22]/50 text-xs tracking-widest uppercase mb-0.5">e-Circular Document</p>
            <h2 className="text-[#0f2a22] text-lg font-semibold" style={{ fontFamily: "'Gilda Display', serif" }}>{circular.title}</h2>
            <p className="text-[#0f2a22]/40 text-xs mt-0.5">
              Issued by <span className="text-[#0f2a22] font-medium">{circular.issuedBy ?? "Staff"}</span> · {circular.department ?? "—"} · {formatDate(circular.uploadedAt)}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#0f2a22]/60 hover:bg-[#f4f1ea] hover:text-[#0f2a22] transition-all">
            <IconX />
          </button>
        </div>

        {/* Document preview area */}
        <div className="flex-1 overflow-y-auto px-7 py-6 bg-[#f4f1ea]">
          <div className="bg-white rounded-xl border border-[#0f2a22]/10 min-h-80 p-8 relative shadow-sm">
            <div className="text-center mb-8">
              <p className="text-[#0f2a22] text-xs tracking-widest uppercase font-semibold mb-1">Government College of Engineering</p>
              <p className="text-[#0f2a22]/60 text-xs mb-4">Department of {circular.department ?? "—"}</p>
              <div className="w-16 h-px bg-[#0f2a22]/15 mx-auto mb-4" />
              <h3 className="text-[#0f2a22] text-xl font-semibold mb-1" style={{ fontFamily: "'Gilda Display', serif" }}>{circular.title}</h3>
              <p className="text-[#0f2a22]/40 text-xs">Ref No: GCE/2026/{circular.id} · Date: {formatDate(circular.uploadedAt)}</p>
            </div>
            <div className="space-y-3 text-[#0f2a22]/80 text-sm leading-relaxed">
              <p>All students and staff members are hereby informed regarding the above-mentioned circular. This communication is issued on behalf of the college administration and is to be followed with immediate effect.</p>
              <p>The concerned departments are requested to take necessary action and ensure compliance. Any queries may be addressed to the office of the Head of Department.</p>
              <p>This circular is issued with the approval of the academic committee and shall remain in force until further notice.</p>
            </div>

            {/* Signature boxes */}
            <div className="flex gap-6 mt-10 pt-6 border-t border-[#0f2a22]/10">
              <div className="flex-1 border border-dashed border-[#0f2a22]/25 rounded-xl p-4 min-h-[80px] flex flex-col items-center justify-center">
                <p className="text-[#0f2a22]/40 text-xs mb-1">Staff Signature</p>
                <p className="text-[#0f2a22] text-sm font-medium italic" style={{ fontFamily: "'Gilda Display', serif" }}>
                  {(circular.issuedBy ?? "Staff").split(" ").slice(-1)[0]}
                </p>
              </div>
              <div className={`flex-1 border border-dashed rounded-xl p-4 min-h-[80px] flex flex-col items-center justify-center transition-all duration-700 ${signed ? "border-[#0f2a22] bg-[#f4f1ea]" : "border-[#0f2a22]/25"}`}>
                <p className="text-[#0f2a22]/40 text-xs mb-1">HOD Signature</p>
                {signed ? (
                  <div className="flex flex-col items-center gap-1">
                    <IconPen />
                    <p className="text-[#0f2a22] text-sm font-semibold italic" style={{ fontFamily: "'Gilda Display', serif" }}>Dr. R. Venkatesh</p>
                    <p className="text-[#0f2a22]/40 text-[10px]">Digitally signed · {new Date().toLocaleDateString("en-IN")}</p>
                  </div>
                ) : (
                  <p className="text-[#0f2a22]/30 text-xs italic">Pending HOD approval</p>
                )}
              </div>
              <div className="flex-1 border border-dashed border-[#0f2a22]/25 rounded-xl p-4 min-h-[80px] flex flex-col items-center justify-center">
                <p className="text-[#0f2a22]/40 text-xs mb-1">Principal Signature</p>
                <p className="text-[#0f2a22]/30 text-xs italic">Pending</p>
              </div>
            </div>
          </div>

          {/* Changes comment box */}
          {mode === "changes" && (
            <div className="mt-4 bg-white rounded-xl border border-[#0f2a22]/15 p-5 shadow-sm">
              <p className="text-[#0f2a22] text-sm font-semibold mb-1">Request Changes</p>
              <p className="text-[#0f2a22]/60 text-xs mb-3">
                Describe the corrections needed. This will be forwarded to <span className="text-[#0f2a22] font-medium">{circular.issuedBy ?? "Staff"}</span>.
              </p>
              {sent ? (
                <div className="flex items-center gap-2 text-[#0f2a22] text-sm py-2">
                  <IconCheck /> <span>Feedback sent to {circular.issuedBy ?? "Staff"}. Closing…</span>
                </div>
              ) : (
                <>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="e.g. Please update the date in paragraph 2 and correct the reference number format…"
                    rows={4}
                    className="w-full text-sm text-[#0f2a22] placeholder-[#0f2a22]/30 bg-[#f4f1ea] border border-[#0f2a22]/18 rounded-lg p-3 outline-none focus:border-[#0f2a22] focus:ring-2 focus:ring-[#0f2a22]/15 resize-none transition-all"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleSendChanges}
                      disabled={!comment.trim()}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0f2a22] text-white text-sm font-medium hover:bg-[#0f2a22]/90 transition-all disabled:opacity-40"
                    >
                      <IconSend /> Forward to Staff
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-[#0f2a22]/10 bg-white">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0f2a22]/20 text-[#0f2a22]/60 text-sm font-medium hover:bg-[#f4f1ea] hover:text-[#0f2a22] transition-all"
          >
            <IconX /> Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setMode(mode === "changes" ? "view" : "changes")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${mode === "changes" ? "bg-amber-50 border-amber-300 text-amber-700" : "border-[#0f2a22]/20 text-[#0f2a22] hover:bg-[#f4f1ea]"}`}
            >
              <IconEdit /> Request Changes
            </button>
            <button
              onClick={handleApprove}
              disabled={signed}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-[#0f2a22] hover:bg-[#0f2a22]/90 transition-all disabled:opacity-60"
            >
              <IconCheck /> {signed ? "Approved — Forwarded to Principal" : "Approve & Sign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOD Portal ─────────────────────────────────────────────────────────────
export default function App() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("issued");
  const [circulars, setCirculars] = useState<StoreCircular[]>(FALLBACK);
  const [openCircular, setOpenCircular] = useState<StoreCircular | null>(null);
  const hasLoadedRef = useRef(false);

  // Load shared data on mount, and pick up changes made in other tabs (e.g. staff uploads)
  useEffect(() => {
    setCirculars(loadCirculars(FALLBACK));
    hasLoadedRef.current = true;
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ecircular:circulars") setCirculars(loadCirculars(FALLBACK));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Only save AFTER the initial load has completed — otherwise this fires on
  // first render with the hardcoded FALLBACK and overwrites real shared data
  // that other portals (e.g. staff) may have already written.
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    saveCirculars(circulars);
  }, [circulars]);

  // Bucket by hod/principal status instead of a single "status" field
  const issued = circulars.filter((c) => c.hod === "pending");
  const pending = circulars.filter((c) => c.hod === "approved" && c.principal === "pending");
  const approved = circulars.filter((c) => c.principal === "approved");

  const handleApprove = (id: string) => {
    setCirculars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hod: "approved" } : c))
    );
  };

  const handleRequestChanges = (id: string, message: string) => {
    setCirculars((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              hod: "changes_requested",
              remarks: [...c.remarks, { by: "HOD" as const, message, at: new Date().toISOString() }],
            }
          : c
      )
    );
  };

  function handleLogout() {
    document.cookie = "session=; path=/; max-age=0";
    router.push("/login");
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "issued", label: "Issued", count: issued.length },
    { key: "pending", label: "Pending Principal", count: pending.length },
    { key: "approved", label: "Approved", count: approved.length },
  ];

  const rows = tab === "issued" ? issued : tab === "pending" ? pending : approved;

  const statusBadge = (c: StoreCircular) => {
    if (c.principal === "approved") return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" /> Approved
      </span>
    );
    if (c.hod === "approved") return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
        <IconClock /> Awaiting Principal
      </span>
    );
    if (c.hod === "changes_requested") return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#c0392b]/10 text-[#c0392b]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c0392b] inline-block" /> Changes requested
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0f2a22]/5 text-[#0f2a22]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0f2a22]/40 inline-block" /> Issued
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f4f1ea", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-4" style={{ background: "#0f2a22" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80">
            <IconDoc />
          </div>
          <div>
            <p className="text-white/40 text-[10px] tracking-widest uppercase leading-none mb-0.5">HOD Portal</p>
            <p className="text-white text-lg leading-none" style={{ fontFamily: "'Gilda Display', serif" }}>e-Circular</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-white/40 text-sm">Signed in as <span className="text-white/70">hod@organisation.org</span></p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-medium text-white/90 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
          >
            <IconLogout /> Logout
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 px-8 py-8 max-w-6xl w-full mx-auto">

        {/* Tabs + info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-[#0f2a22]/8">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${tab === key ? "bg-[#0f2a22] text-white shadow" : "text-[#0f2a22]/60 hover:text-[#0f2a22]"}`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === key ? "bg-white/20 text-white" : "bg-[#0f2a22]/5 text-[#0f2a22]/60"}`}>{count}</span>
              </button>
            ))}
          </div>
          <p className="text-[#0f2a22]/60 text-sm">Department of Computer Science &amp; Engineering</p>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-[#0f2a22]/8 shadow-sm overflow-hidden">

          {/* Tab description row */}
          <div className="px-7 py-4 border-b border-[#0f2a22]/8 flex items-center justify-between">
            <div>
              <p className="text-[#0f2a22] text-sm font-semibold">
                {tab === "issued" && "Circulars submitted by staff — review and action required"}
                {tab === "pending" && "Circulars forwarded to Principal — awaiting final approval"}
                {tab === "approved" && "Circulars approved by Principal"}
              </p>
              <p className="text-[#0f2a22]/40 text-xs mt-0.5">
                {tab === "issued" && "Open any circular to review, request changes, or approve and forward to Principal."}
                {tab === "pending" && "These circulars have been signed by you and are now with the Principal."}
                {tab === "approved" && "Fully approved circulars ready for circulation."}
              </p>
            </div>
            {rows.length > 0 && (
              <span className="text-[#0f2a22]/60 text-xs">{rows.length} circular{rows.length > 1 ? "s" : ""}</span>
            )}
          </div>

          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f4f1ea] flex items-center justify-center text-[#0f2a22]/30 mb-4">
                <IconDoc />
              </div>
              <p className="text-[#0f2a22]/60 text-sm font-medium">No circulars here</p>
              <p className="text-[#0f2a22]/40 text-xs mt-1">
                {tab === "issued" && "No new submissions from staff yet."}
                {tab === "pending" && "No circulars awaiting Principal's approval."}
                {tab === "approved" && "No approved circulars yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0f2a22]/8" style={{ background: "#f4f1ea" }}>
                  <th className="text-left px-4 py-3 text-[#0f2a22]/60 text-xs font-semibold tracking-wider uppercase">Circular</th>
                  {(tab === "issued" || tab === "pending") && (
                    <th className="text-left px-4 py-3 text-[#0f2a22]/60 text-xs font-semibold tracking-wider uppercase">Issued By</th>
                  )}
                  <th className="text-left px-4 py-3 text-[#0f2a22]/60 text-xs font-semibold tracking-wider uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-[#0f2a22]/60 text-xs font-semibold tracking-wider uppercase">Status</th>
                  {tab === "issued" && (
                    <th className="text-right px-4 py-3 text-[#0f2a22]/60 text-xs font-semibold tracking-wider uppercase">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b border-[#0f2a22]/6 transition-colors hover:bg-[#f4f1ea]/60 ${i === rows.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-[#0f2a22] font-medium">{c.title}</p>
                      <p className="text-[#0f2a22]/40 text-xs mt-0.5">{c.fileName}</p>
                    </td>
                    {(tab === "issued" || tab === "pending") && (
                      <td className="px-4 py-3">
                        <p className="text-[#0f2a22] text-sm">{c.issuedBy ?? "—"}</p>
                        <p className="text-[#0f2a22]/40 text-xs mt-0.5">{c.department ?? "—"}</p>
                      </td>
                    )}
                    <td className="px-4 py-3 text-[#0f2a22]/60 text-sm">{formatDate(c.uploadedAt)}</td>
                    <td className="px-4 py-3">{statusBadge(c)}</td>
                    {tab === "issued" && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setOpenCircular(c)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#0f2a22]/25 text-[#0f2a22] text-xs font-semibold hover:bg-[#f4f1ea] hover:border-[#0f2a22]/50 transition-all"
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
          onRequestChanges={handleRequestChanges}
        />
      )}
    </div>
  );
}