// Global unique 6-digit Order ID system shared by every module.
// IDs live in localStorage so they persist across sessions on the device.
// Two pools:
//   - "committed": permanently reserved IDs (after a successful WhatsApp send)
//   - "pending":   temporarily held IDs (while a customer fills a form);
//                  released if the customer leaves without sending.
//
// Note: this is a client-side ledger that gives strong per-device uniqueness
// and presents a consistent ID to the merchant in WhatsApp. A central
// backend can later replace this without touching call sites.
const COMMITTED_KEY = "mysanyoga:order-ids:committed";
const PENDING_KEY = "mysanyoga:order-ids:pending";
function read(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
function write(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* ignore quota */
  }
}
function randomSixDigits(): string {
  // 100000–999999 inclusive — always exactly 6 digits.
  return String(Math.floor(100000 + Math.random() * 900000));
}
function isTaken(id: string): boolean {
  return read(COMMITTED_KEY).has(id) || read(PENDING_KEY).has(id);
}
/** Generate a fresh 6-digit ID and reserve it in the pending pool. */
export function reserveOrderId(): string {
  let id = randomSixDigits();
  let guard = 0;
  while (isTaken(id) && guard < 50) {
    id = randomSixDigits();
    guard++;
  }
  const pending = read(PENDING_KEY);
  pending.add(id);
  write(PENDING_KEY, pending);
  return id;
}
/** Promote a pending ID to permanently committed (after WhatsApp send). */
export function commitOrderId(id: string) {
  const pending = read(PENDING_KEY);
  pending.delete(id);
  write(PENDING_KEY, pending);
  const committed = read(COMMITTED_KEY);
  committed.add(id);
  write(COMMITTED_KEY, committed);
}
/** Discard a pending ID — it can be reused later. */
export function releaseOrderId(id: string) {
  const pending = read(PENDING_KEY);
  if (pending.delete(id)) write(PENDING_KEY, pending);
}
export function isCommitted(id: string): boolean {
  return read(COMMITTED_KEY).has(id);
}