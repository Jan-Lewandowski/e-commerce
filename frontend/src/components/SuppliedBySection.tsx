import type { SupplierSummary } from "@/types/supplier";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function SuppliedBySection({ supplier }: { supplier?: SupplierSummary | null }) {
  if (!supplier) return null;

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Dostawca</p>
          <Link
            href={`/suppliers/${supplier.id}`}
            className="text-sm font-bold text-slate-950 underline decoration-orange-300 decoration-2 underline-offset-4 transition hover:text-orange-600"
          >
            {supplier.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
