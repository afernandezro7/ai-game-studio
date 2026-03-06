/**
 * Toast — Lightweight notification system.
 *
 * Usage:
 *   import { toast } from '@/components/ui/Toast';
 *   toast('¡Gran Salón mejorado a Nivel 2!');
 *
 * Mount <ToastContainer /> once in AppLayout.
 * Toasts auto-dismiss after 5 s and stack vertically.
 */

import { useEffect } from "react";
import { create } from "zustand";
import "./Toast.css";

// ── Store ─────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  add: (message: string) => void;
  remove: (id: number) => void;
}

let _nextId = 0;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message) => {
    const id = ++_nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    // Auto-dismiss after 5 s
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 5_000);
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ── Public API ────────────────────────────────────────────────

/** Imperatively show a toast from anywhere — no hooks required. */
export function toast(message: string): void {
  useToastStore.getState().add(message);
}

// ── Toast item ────────────────────────────────────────────────

function ToastItemComponent({ item }: { item: ToastItem }) {
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    // Begin slide-out animation 300 ms before store removes the toast
    const timer = setTimeout(() => remove(item.id), 4_700);
    return () => clearTimeout(timer);
  }, [item.id, remove]);

  return (
    <div className="toast-item" role="alert" aria-live="assertive">
      <span className="toast-item__message">{item.message}</span>
      <button
        className="toast-item__close"
        onClick={() => remove(item.id)}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}

// ── Container ── place once in AppLayout ─────────────────────

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItemComponent key={t.id} item={t} />
      ))}
    </div>
  );
}
