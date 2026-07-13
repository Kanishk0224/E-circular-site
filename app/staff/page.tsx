// app/staff/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, Plus, FileText, Download, ExternalLink,
  CheckCircle2, Clock, AlertCircle, MessageSquare, X, LogOut,
} from "lucide-react";
import { loadCirculars, saveCirculars, type Circular, type Status } from "@/lib/circularStore";

// Use fixed ISO timestamps for demo data so server/client render identically
const initial: Circular[] = [
  {
    id: "c1", title: "Annual Sports Day Notice",
    fileName: "sports-day.pdf", fileUrl: "#", fileType: "application/pdf",
    uploadedAt: "2026-07-10T00:00:00.000Z",
    hod: "changes_requested", principal: "pending",
    remarks: [{ by: "HOD", message: "Please update the date to 15th and add venue.", at: "2026-07-09T14:32:00.000Z" }],
  },
  {
    id: "c2", title: "Exam Schedule — Sem 5",
    fileName: "exam-schedule.docx", fileUrl: "#",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uploadedAt: "2026-07-03T00:00:00.000Z",
    hod: "approved", principal: "approved", remarks: [],
  },
];

type TabKey = "issue" | "processing" | "approved";

export default function StaffPortal() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("issue");
  const [items, setItems] = useState<Circular[]>(initial);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detail, setDetail] = useState<Circular | null>(null);

  // Load shared data on mount (client-only — localStorage isn't available during SSR)
  useEffect(() => {
    setItems(loadCirculars(initial));
  }, []);

  // Persist every change so HOD/Principal portals see the same data
  useEffect(() => {
    saveCirculars(items);
     console.log("Saved to storage:", items); // temp debug
  }, [items]);

  const processing = useMemo(
    () => items.filter(i => !(i.hod === "approved" && i.principal === "approved")),
    [items]
  );
  const approved = useMemo(
    () => items.filter(i => i.hod === "approved" && i.principal === "approved"),
    [items]
  );

 const addCirculars = (files: FileList | File[]) => {
  const newOnes: Circular[] = Array.from(files).map((f, idx) => ({
    id: `c${Date.now()}-${idx}`,
    title: f.name.replace(/\.[^.]+$/, ""),
    fileName: f.name,
    fileUrl: URL.createObjectURL(f),
    fileType: f.type,
    uploadedAt: new Date().toISOString(),
    hod: "pending",
    principal: "pending",
    remarks: [],
    issuedBy: "staff@organisation.org", // matches header's "Signed in as"
    department: "General Administration", // placeholder — swap for real dept later
  }));
  setItems(prev => [...newOnes, ...prev]);
  
  setUploadOpen(false);
  setTab("processing");
};

  const resubmit = (id: string) => {
    setItems(prev => prev.map(c =>
      c.id === id ? { ...c, hod: "pending", principal: "pending" } : c
    ));
    setDetail(null);
  };

  function handleLogout() {
    document.cookie = "session=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#0f2a22]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-[#0f2a22]/10 bg-[#0f2a22] text-[#f4f1ea]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-[#f4f1ea]/40">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] text-[#f4f1ea]/70">STAFF PORTAL</p>
              <h1 className="font-serif text-lg sm:text-xl">e-Circular</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right text-xs text-[#f4f1ea]/70 sm:block">
              Signed in as <span className="text-[#f4f1ea]">staff@organisation.org</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#f4f1ea]/25 px-3.5 py-1.5 text-xs font-medium text-[#f4f1ea]/90 transition hover:border-[#f4f1ea]/50 hover:bg-[#f4f1ea]/10 hover:text-[#f4f1ea]"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Tabs */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-full overflow-x-auto rounded-full border border-[#0f2a22]/15 bg-white p-1 sm:w-auto">
            {([
              { k: "issue", label: `Issue` },
              { k: "processing", label: `Processing (${processing.length})` },
              { k: "approved", label: `Approved (${approved.length})` },
            ] as { k: TabKey; label: string }[]).map(t => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                  tab === t.k
                    ? "bg-[#0f2a22] text-[#f4f1ea]"
                    : "text-[#0f2a22]/70 hover:text-[#0f2a22]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "issue" && (
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2a22] px-5 py-2.5 text-sm font-medium text-[#f4f1ea] hover:bg-[#0f2a22]/90"
            >
              <Plus className="h-4 w-4" /> New circular
            </button>
          )}
        </div>

        {/* Content */}
        <section className="rounded-2xl border border-[#0f2a22]/10 bg-white shadow-sm">
          {tab === "issue" && (
            <IssueTab
              items={items}
              onOpenUpload={() => setUploadOpen(true)}
              onDetail={setDetail}
            />
          )}
          {tab === "processing" && (
            <ProcessingTab items={processing} onDetail={setDetail} onResubmit={resubmit} />
          )}
          {tab === "approved" && <ApprovedTab items={approved} />}
        </section>
      </main>

      {uploadOpen && (
        <UploadModal onClose={() => setUploadOpen(false)} onFiles={addCirculars} />
      )}
      {detail && <DetailDrawer circular={detail} onClose={() => setDetail(null)} onResubmit={resubmit} />}
    </div>
  );
}

// --- Date formatting helpers (use explicit locale to avoid hydration mismatches) ---
function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("en-GB"); }
  catch { return iso; }
}
function formatDateTime(iso: string) {
  try { return new Date(iso).toLocaleString("en-GB"); }
  catch { return iso; }
}

/* ---------- Tabs ---------- */

function IssueTab({
  items, onOpenUpload, onDetail,
}: { items: Circular[]; onOpenUpload: () => void; onDetail: (c: Circular) => void }) {
  const drafts = items.filter(i => i.hod === "changes_requested" || i.principal === "changes_requested");
  return (
    <div className="p-4 sm:p-6">
      <button
        onClick={onOpenUpload}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#0f2a22]/25 bg-[#f4f1ea]/50 py-10 text-[#0f2a22] transition hover:border-[#0f2a22]/60 hover:bg-[#f4f1ea]"
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#c0392b] text-white">
          <Plus className="h-6 w-6" />
        </div>
        <p className="font-medium">Upload or drag & drop a circular</p>
        <p className="text-xs text-[#0f2a22]/60">PDF, DOC, DOCX up to 10 MB</p>
      </button>

      {drafts.length > 0 && (
        <>
          <h3 className="mt-8 mb-3 text-sm font-semibold tracking-wide text-[#0f2a22]/80">
            Changes requested — action needed
          </h3>
          <Table
            rows={drafts}
            onRowClick={onDetail}
            extraColumn={{
              header: "Feedback",
              render: (c) => (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#c0392b]/10 px-2 py-1 text-xs text-[#c0392b]">
                  <MessageSquare className="h-3 w-3" /> {c.remarks.length} note{c.remarks.length !== 1 && "s"}
                </span>
              ),
            }}
          />
        </>
      )}
    </div>
  );
}

function ProcessingTab({
  items, onDetail, onResubmit,
}: { items: Circular[]; onDetail: (c: Circular) => void; onResubmit: (id: string) => void }) {
  if (!items.length) return <Empty text="No circulars in review." />;
  return (
    <div className="p-4 sm:p-6">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-[#0f2a22]/10 md:block">
        <table className="w-full text-sm">
          <thead className="bg-[#0f2a22]/5 text-left text-xs uppercase tracking-wider text-[#0f2a22]/70">
            <tr>
              <th className="px-4 py-3">Circular</th>
              <th className="px-4 py-3">HOD</th>
              <th className="px-4 py-3">Principal</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-t border-[#0f2a22]/10 hover:bg-[#f4f1ea]/40">
                <td className="px-4 py-3">
                  <button onClick={() => onDetail(c)} className="text-left font-medium hover:underline">
                    {c.title}
                  </button>
                  <p className="text-xs text-[#0f2a22]/60">{c.fileName}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge s={c.hod} /></td>
                <td className="px-4 py-3"><StatusBadge s={c.principal} /></td>
                <td className="px-4 py-3 text-[#0f2a22]/70">
                  {formatDate(c.uploadedAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  {(c.hod === "changes_requested" || c.principal === "changes_requested") ? (
                    <button
                      onClick={() => onDetail(c)}
                      className="rounded-full bg-[#c0392b] px-3 py-1.5 text-xs text-white hover:bg-[#a5311f]"
                    >
                      View feedback
                    </button>
                  ) : (
                    <span className="text-xs text-[#0f2a22]/50">Awaiting review</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {items.map(c => (
          <button
            key={c.id}
            onClick={() => onDetail(c)}
            className="rounded-xl border border-[#0f2a22]/10 bg-white p-4 text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{c.title}</p>
                <p className="truncate text-xs text-[#0f2a22]/60">{c.fileName}</p>
              </div>
              <span className="shrink-0 text-xs text-[#0f2a22]/60">
                {formatDate(c.uploadedAt)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-[#0f2a22]/60">HOD:</span> <StatusBadge s={c.hod} />
              <span className="text-xs text-[#0f2a22]/60">Principal:</span> <StatusBadge s={c.principal} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ApprovedTab({ items }: { items: Circular[] }) {
  if (!items.length) return <Empty text="No approved circulars yet." />;
  return (
    <div className="grid gap-3 p-4 sm:p-6 md:grid-cols-2">
      {items.map(c => (
        <div key={c.id} className="rounded-xl border border-[#0f2a22]/10 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0f2a22]/5">
              <FileText className="h-5 w-5 text-[#0f2a22]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{c.title}</p>
              <p className="truncate text-xs text-[#0f2a22]/60">{c.fileName}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                <CheckCircle2 className="h-3 w-3" /> Fully approved
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a
              href={c.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#0f2a22]/20 px-4 py-2 text-sm hover:bg-[#f4f1ea]"
            >
              <ExternalLink className="h-4 w-4" /> Open
            </a>
            <a
              href={c.fileUrl}
              download={c.fileName}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f2a22] px-4 py-2 text-sm text-[#f4f1ea] hover:bg-[#0f2a22]/90"
            >
              <Download className="h-4 w-4" /> Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Building blocks ---------- */

function StatusBadge({ s }: { s: Status }) {
  const map: Record<Status, { label: string; cls: string; icon: ReactElement }> = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-800", icon: <Clock className="h-3 w-3" /> },
    approved: { label: "Approved", cls: "bg-emerald-100 text-emerald-800", icon: <CheckCircle2 className="h-3 w-3" /> },
    rejected: { label: "Rejected", cls: "bg-red-100 text-red-800", icon: <AlertCircle className="h-3 w-3" /> },
    changes_requested: { label: "Changes requested", cls: "bg-[#c0392b]/10 text-[#c0392b]", icon: <MessageSquare className="h-3 w-3" /> },
  };
  const it = map[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${it.cls}`}>
      {it.icon} {it.label}
    </span>
  );
}

function Table({
  rows, onRowClick, extraColumn,
}: {
  rows: Circular[];
  onRowClick: (c: Circular) => void;
  extraColumn?: { header: string; render: (c: Circular) => ReactElement };
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#0f2a22]/10">
      <table className="w-full text-sm">
        <thead className="bg-[#0f2a22]/5 text-left text-xs uppercase tracking-wider text-[#0f2a22]/70">
          <tr>
            <th className="px-4 py-3">Circular</th>
            <th className="px-4 py-3">Uploaded</th>
            {extraColumn && <th className="px-4 py-3">{extraColumn.header}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id} onClick={() => onRowClick(c)}
                className="cursor-pointer border-t border-[#0f2a22]/10 hover:bg-[#f4f1ea]/40">
              <td className="px-4 py-3">
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-[#0f2a22]/60">{c.fileName}</p>
              </td>
              <td className="px-4 py-3 text-[#0f2a22]/70">{formatDate(c.uploadedAt)}</td>
              {extraColumn && <td className="px-4 py-3">{extraColumn.render(c)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-sm text-[#0f2a22]/60">{text}</div>;
}

/* ---------- Upload modal (drag & drop) ---------- */

function UploadModal({ onClose, onFiles }: { onClose: () => void; onFiles: (f: FileList | File[]) => void }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  }, [onFiles]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#0f2a22]">Upload circular</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[#f4f1ea]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-12 transition ${
            drag ? "border-[#0f2a22] bg-[#f4f1ea]" : "border-[#0f2a22]/25 bg-[#f4f1ea]/50"
          }`}
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#c0392b] text-white">
            <Upload className="h-5 w-5" />
          </div>
          <p className="font-medium text-[#0f2a22]">Drop files here or click to browse</p>
          <p className="text-xs text-[#0f2a22]/60">PDF, DOC, DOCX — up to 10 MB</p>
          <input
            ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files && onFiles(e.target.files)}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Detail drawer (shows HOD/Principal remarks + edit) ---------- */

function DetailDrawer({
  circular, onClose, onResubmit,
}: { circular: Circular; onClose: () => void; onResubmit: (id: string) => void }) {
  const needsChanges = circular.hod === "changes_requested" || circular.principal === "changes_requested";
  const [reply, setReply] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.25em] text-[#0f2a22]/60">CIRCULAR</p>
            <h2 className="font-serif text-2xl text-[#0f2a22]">{circular.title}</h2>
            <p className="mt-1 truncate text-xs text-[#0f2a22]/60">{circular.fileName}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-[#f4f1ea]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#0f2a22]/10 p-3">
            <p className="text-xs text-[#0f2a22]/60">HOD</p>
            <div className="mt-1"><StatusBadge s={circular.hod} /></div>
          </div>
          <div className="rounded-xl border border-[#0f2a22]/10 p-3">
            <p className="text-xs text-[#0f2a22]/60">Principal</p>
            <div className="mt-1"><StatusBadge s={circular.principal} /></div>
          </div>
        </div>

        <h3 className="mb-2 text-sm font-semibold text-[#0f2a22]">Feedback</h3>
        {circular.remarks.length === 0 ? (
          <p className="rounded-lg bg-[#f4f1ea] p-3 text-sm text-[#0f2a22]/60">No remarks yet.</p>
        ) : (
          <ul className="space-y-2">
            {circular.remarks.map((r, i) => (
              <li key={i} className="rounded-lg border border-[#c0392b]/20 bg-[#c0392b]/5 p-3">
                <p className="text-xs font-semibold text-[#c0392b]">{r.by}</p>
                <p className="mt-1 text-sm text-[#0f2a22]">{r.message}</p>
                <p className="mt-1 text-[10px] text-[#0f2a22]/50">{formatDateTime(r.at)}</p>
              </li>
            ))}
          </ul>
        )}

        {needsChanges && (
          <div className="mt-6 rounded-xl border border-[#0f2a22]/10 p-4">
            <h3 className="mb-2 text-sm font-semibold text-[#0f2a22]">Apply changes</h3>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              placeholder="Describe your changes / notes for reviewer…"
              className="w-full rounded-lg border border-[#0f2a22]/20 bg-white p-2 text-sm outline-none focus:border-[#0f2a22]"
            />
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="mt-2 block w-full text-xs" />
            <button
              onClick={() => onResubmit(circular.id)}
              className="mt-3 w-full rounded-full bg-[#0f2a22] py-2 text-sm text-[#f4f1ea] hover:bg-[#0f2a22]/90"
            >
              Resubmit for approval
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <a href={circular.fileUrl} target="_blank" rel="noreferrer"
             className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#0f2a22]/20 px-4 py-2 text-sm hover:bg-[#f4f1ea]">
            <ExternalLink className="h-4 w-4" /> Open
          </a>
          <a href={circular.fileUrl} download={circular.fileName}
             className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f2a22] px-4 py-2 text-sm text-[#f4f1ea] hover:bg-[#0f2a22]/90">
            <Download className="h-4 w-4" /> Download
          </a>
        </div>
      </aside>
    </div>
  );
}