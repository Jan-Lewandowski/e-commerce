import "@/components/CartNotificationPortal/cart-notification-portal.scss";
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
    <div className="toast">
      <div>{message}</div>
      <Button onClick={onClose} variant="outline">Zamknij</Button>
    </div>,
    portalRoot
  );
}