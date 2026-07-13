// lib/circularStore.ts
export type Status = "pending" | "approved" | "rejected" | "changes_requested";

export type Remark = { by: "HOD" | "Principal"; message: string; at: string };

export type Circular = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  hod: Status;
  principal: Status;
  remarks: Remark[];
  issuedBy?: string;
  department?: string;
};

const STORAGE_KEY = "ecircular:circulars";

export function loadCirculars(fallback: Circular[]): Circular[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return JSON.parse(raw) as Circular[];
  } catch {
    return fallback;
  }
}

export function saveCirculars(items: Circular[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota/storage errors for now
  }
}