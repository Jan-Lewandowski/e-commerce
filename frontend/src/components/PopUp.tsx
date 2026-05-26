"use client";

import { createPortal } from "react-dom";

type PopUpProps = {
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  panelClassName?: string;
  backdropClassName?: string;
};

export default function PopUp({ open, onClose, content, panelClassName, backdropClassName, }: PopUpProps) {

  if (!open || typeof document === "undefined") return null;

  const container = document.getElementById("notification");
  if (!container) return null;

  return createPortal(
    <div
      className={
        backdropClassName ??
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      }
      onClick={onClose}
      role="presentation"
    >
      <div
        className={
          panelClassName ??
          "relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
        }
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij"
          className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <span aria-hidden>×</span>
        </button>
        {content}
      </div>
    </div>,
    container,
  );
}
