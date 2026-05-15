import { createPortal } from "react-dom";
import Button from "../ui/Button/Button";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export default function CartNotificationPortal({ message, onClose }: ToastProps) {
  const portalRoot = document.getElementById("cart-notification");

  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed bottom-6 right-4 z-50 flex max-w-[calc(100vw-2rem)] animate-[slideInFromRight_0.35s_ease-out_forwards] items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 text-sm text-slate-800 shadow-2xl sm:min-w-[320px] sm:max-w-[420px]">
      <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
      <div className="flex-1">{message}</div>
      <Button variant="ghost" onClick={onClose} className="min-h-8 px-2 py-1 text-xs">Zamknij</Button>
    </div>,
    portalRoot
  );
}
