"use client";

import Header from "@/components/Header";
import SupplierProfile from "@/components/SupplierProfile";
import { useSupplier } from "@/lib/queries/suppliers";
import { notFound, useParams } from "next/navigation";

export default function SupplierPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const supplierQuery = useSupplier(id);

  if (supplierQuery.isError) {
    if (supplierQuery.error instanceof Error && supplierQuery.error.message.includes("HTTP 404")) {
      return notFound();
    }
  }

  return (
    <>
      <Header />
      <SupplierProfile supplierId={id} />
    </>
  );
}
