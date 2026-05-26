type ProductAvailabilityBadgeProps = {
  stock: number;
  className?: string;
};

export default function ProductAvailabilityBadge({
  stock,
  className,
}: ProductAvailabilityBadgeProps) {
  const unavailable = stock <= 0;
  const lowStock = stock > 0 && stock <= 5;

  const label = unavailable ? "Niedostępny" : lowStock ? "Ostatnie sztuki!" : "Dostępny";
  const colorClass = unavailable
    ? "border-red-200 bg-red-50 text-red-700"
    : lowStock
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${colorClass} ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
