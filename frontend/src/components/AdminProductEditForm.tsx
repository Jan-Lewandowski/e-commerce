"use client";

import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/ui/Button/Button";
import type { Product } from "@/types/product";
import { useUpdateProduct } from "@/lib/queries/catalog";
import Image from "next/image";

const inputClass =
  "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const textareaClass =
  "min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

const tagsSchema = Yup.string().test(
  "tags-json",
  "Tags musza byc poprawnym JSON array stringow (max 20, max 30 znakow).",
  (value) => {
    if (!value || !value.trim()) return true;
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) return false;
      if (parsed.length > 20) return false;
      return parsed.every(
        (tag) =>
          typeof tag === "string" &&
          tag.trim().length > 0 &&
          tag.trim().length <= 30,
      );
    } catch {
      return false;
    }
  },
);

const specsSchema = Yup.string().test(
  "specs-json",
  "Specyfikacja musi byc poprawnym JSON obiektem.",
  (value) => {
    if (!value || !value.trim()) return true;
    try {
      const parsed = JSON.parse(value);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
      const entries = Object.entries(parsed);
      if (entries.length > 40) return false;
      return entries.every(([key, val]) => {
        if (typeof key !== "string" || !key.trim() || key.trim().length > 40) return false;
        return ["string", "number", "boolean"].includes(typeof val);
      });
    } catch {
      return false;
    }
  },
);

const ProductSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Nazwa musi miec co najmniej 3 znaki.")
    .max(120, "Nazwa nie moze przekraczac 120 znakow.")
    .required("Nazwa jest wymagana."),
  price: Yup.number()
    .typeError("Cena musi byc liczba.")
    .min(0, "Cena nie moze byc ujemna.")
    .required("Cena jest wymagana."),
  stock: Yup.number()
    .typeError("Stan magazynowy musi byc liczba.")
    .integer("Stan magazynowy musi byc liczba calkowita.")
    .min(0, "Stan magazynowy nie moze byc ujemny.")
    .required("Stan magazynowy jest wymagany."),
  description: Yup.string()
    .trim()
    .min(10, "Opis musi miec co najmniej 10 znakow.")
    .max(4000, "Opis nie moze przekraczac 4000 znakow.")
    .required("Opis jest wymagany."),
  tags: tagsSchema,
  specs: specsSchema,
  thumbnail: Yup.string().test(
    "thumbnail-required",
    "Miniatura jest wymagana (URL lub plik).",
    function (value) {
      const file = this.parent.thumbnailFile as File | null | undefined;
      if (file instanceof File) return true;
      return Boolean(value && value.trim());
    },
  ),
  thumbnailFile: Yup.mixed<File>().nullable(),
});

type FormValues = {
  name: string;
  price: number | "";
  stock: number | "";
  description: string;
  tags: string;
  specs: string;
  thumbnail: string;
  thumbnailFile: File | null;
};

export default function AdminProductEditForm({
  product,
  onSaved,
}: {
  product: Product;
  onSaved?: (product: Product) => void;
}) {
  const updateProduct = useUpdateProduct();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: product.name ?? "",
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      description: product.description ?? "",
      tags: JSON.stringify(product.tags ?? [], null, 2),
      specs: JSON.stringify(product.specs ?? {}, null, 2),
      thumbnail: product.thumbnail ?? "",
      thumbnailFile: null,
    },
    validationSchema: ProductSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("description", values.description.trim());
      formData.append("tags", values.tags?.trim() ? values.tags.trim() : "[]");
      formData.append("specs", values.specs?.trim() ? values.specs.trim() : "{}");

      if (values.thumbnailFile) {
        formData.append("thumbnail", values.thumbnailFile);
      } else {
        formData.append("thumbnail", values.thumbnail.trim());
      }

      updateProduct.mutate(
        { id: product.id, formData },
        {
          onSuccess: (updated) => {
            onSaved?.(updated);
          },
        },
      );
    },
  });

  const previewUrl = useMemo(() => {
    if (formik.values.thumbnailFile) {
      return URL.createObjectURL(formik.values.thumbnailFile);
    }
    return formik.values.thumbnail;
  }, [formik.values.thumbnailFile, formik.values.thumbnail]);

  useEffect(() => {
    if (!formik.values.thumbnailFile) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [formik.values.thumbnailFile, previewUrl]);

  const isSaving = updateProduct.isPending;
  const isCurrentMutation = updateProduct.variables?.id === product.id;
  const submitError =
    isCurrentMutation && updateProduct.isError
      ? updateProduct.error instanceof Error
        ? updateProduct.error.message
        : "Wystapil blad zapisu."
      : null;
  const submitSuccess =
    isCurrentMutation && updateProduct.isSuccess ? "Zapisano zmiany." : null;

  return (
    <form onSubmit={formik.handleSubmit} className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-orange-600">
          Edycja produktu
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          ID: {product.id}
        </div>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">Nazwa</span>
        <input
          id="name"
          className={inputClass}
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-sm font-semibold text-red-600">
            {formik.errors.name}
          </span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-slate-700">Cena (PLN)</span>
          <input
            id="price"
            type="number"
            step="0.01"
            className={inputClass}
            {...formik.getFieldProps("price")}
          />
          {formik.touched.price && formik.errors.price && (
            <span className="text-sm font-semibold text-red-600">
              {formik.errors.price}
            </span>
          )}
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-slate-700">Stan magazynowy</span>
          <input
            id="stock"
            type="number"
            step="1"
            className={inputClass}
            {...formik.getFieldProps("stock")}
          />
          {formik.touched.stock && formik.errors.stock && (
            <span className="text-sm font-semibold text-red-600">
              {formik.errors.stock}
            </span>
          )}
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">Opis</span>
        <textarea
          id="description"
          className={textareaClass}
          rows={5}
          {...formik.getFieldProps("description")}
        />
        {formik.touched.description && formik.errors.description && (
          <span className="text-sm font-semibold text-red-600">
            {formik.errors.description}
          </span>
        )}
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">Tagi (JSON)</span>
        <textarea
          id="tags"
          className={textareaClass}
          rows={4}
          {...formik.getFieldProps("tags")}
        />
        {formik.touched.tags && formik.errors.tags && (
          <span className="text-sm font-semibold text-red-600">
            {formik.errors.tags}
          </span>
        )}
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">Specyfikacja (JSON)</span>
        <textarea
          id="specs"
          className={textareaClass}
          rows={6}
          {...formik.getFieldProps("specs")}
        />
        {formik.touched.specs && formik.errors.specs && (
          <span className="text-sm font-semibold text-red-600">
            {formik.errors.specs}
          </span>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {previewUrl ? (
            <Image src={previewUrl} alt={product.name} className="h-full w-full object-cover" width={200} height={200} />
          ) : (
            <div className="grid h-full min-h-[160px] place-items-center text-sm text-slate-500">
              Brak miniatury
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Miniatura (URL)</span>
            <input
              id="thumbnail"
              className={inputClass}
              placeholder="/images/products/... lub /uploads/products/..."
              {...formik.getFieldProps("thumbnail")}
              disabled={Boolean(formik.values.thumbnailFile)}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Miniatura (plik)</span>
            <input
              id="thumbnailFile"
              type="file"
              accept="image/*"
              className="text-sm text-slate-600"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                formik.setFieldValue("thumbnailFile", file, true);
              }}
            />
          </label>

          {formik.touched.thumbnail && formik.errors.thumbnail && (
            <span className="text-sm font-semibold text-red-600">
              {formik.errors.thumbnail}
            </span>
          )}
        </div>
      </div>

      {submitError && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          {submitSuccess}
        </div>
      )}

      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
      </Button>
    </form>

  );
}
