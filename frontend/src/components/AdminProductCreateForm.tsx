"use client";

import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { useCategories, useCreateProduct } from "@/lib/queries/catalog";
import type { Product } from "@/types/product";

const inputClass =
  "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const textareaClass =
  "min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

const requiredTagsSchema = Yup.string()
  .required("Tagi sa wymagane.")
  .test(
    "tags-json",
    "Tagi musza byc poprawnym JSON array stringow (min 1, max 20, max 30 znakow).",
    (value) => {
      if (!value || !value.trim()) return false;
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return false;
        if (parsed.length === 0 || parsed.length > 20) return false;
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

const requiredSpecsSchema = Yup.string()
  .required("Specyfikacja jest wymagana.")
  .test(
    "specs-json",
    "Specyfikacja musi byc poprawnym JSON obiektem (min 1 pole).",
    (value) => {
      if (!value || !value.trim()) return false;
      try {
        const parsed = JSON.parse(value);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
        const entries = Object.entries(parsed);
        if (entries.length === 0 || entries.length > 40) return false;
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
  category: Yup.string().trim().required("Kategoria jest wymagana."),
  brand: Yup.string()
    .trim()
    .min(2, "Marka musi miec co najmniej 2 znaki.")
    .max(80, "Marka nie moze przekraczac 80 znakow.")
    .required("Marka jest wymagana."),
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
  rating: Yup.number()
    .typeError("Ocena musi byc liczba.")
    .min(0, "Ocena nie moze byc ujemna.")
    .max(5, "Ocena nie moze przekraczac 5.")
    .required("Ocena jest wymagana."),
  description: Yup.string()
    .trim()
    .min(10, "Opis musi miec co najmniej 10 znakow.")
    .max(4000, "Opis nie moze przekraczac 4000 znakow.")
    .required("Opis jest wymagany."),
  tags: requiredTagsSchema,
  specs: requiredSpecsSchema,
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
  category: string;
  brand: string;
  name: string;
  price: number | "";
  stock: number | "";
  rating: number | "";
  description: string;
  tags: string;
  specs: string;
  thumbnail: string;
  thumbnailFile: File | null;
};

type Props = {
  onCreated?: (product: Product) => void;
};

export default function AdminProductCreateForm({ onCreated }: Props) {
  const createProduct = useCreateProduct();
  const categoriesQuery = useCategories();
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);

  const formik = useFormik<FormValues>({
    initialValues: {
      category: "",
      brand: "",
      name: "",
      price: "",
      stock: "",
      rating: 0,
      description: "",
      tags: "",
      specs: "",
      thumbnail: "",
      thumbnailFile: null,
    },
    validationSchema: ProductSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("category", values.category.trim());
      formData.append("brand", values.brand.trim());
      formData.append("name", values.name.trim());
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("rating", String(values.rating));
      formData.append("description", values.description.trim());
      formData.append("tags", values.tags.trim());
      formData.append("specs", values.specs.trim());

      if (values.thumbnailFile) {
        formData.append("thumbnail", values.thumbnailFile);
      } else {
        formData.append("thumbnail", values.thumbnail.trim());
      }

      createProduct.mutate(
        { formData },
        {
          onSuccess: (product) => {
            onCreated?.(product);
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

  const isSaving = createProduct.isPending;
  const submitError =
    createProduct.isError &&
    (createProduct.error instanceof Error
      ? createProduct.error.message
      : "Wystapil blad zapisu.");
  const submitSuccess = createProduct.isSuccess ? "Produkt zostal dodany." : null;

  return (
    <form onSubmit={formik.handleSubmit} className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-orange-600">
          Nowy produkt
        </div>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">Kategoria</span>
        <select
          id="category"
          name="category"
          className={inputClass}
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled>
            {categoriesQuery.isLoading ? "Ladowanie kategorii..." : "Wybierz kategorie"}
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {formik.touched.category && formik.errors.category && (
          <span className="text-sm font-semibold text-red-600">
            {formik.errors.category}
          </span>
        )}
        {categoriesQuery.isError && (
          <span className="text-sm font-semibold text-red-600">
            Nie udalo sie pobrac kategorii.
          </span>
        )}
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-slate-700">Marka</span>
        <input
          id="brand"
          className={inputClass}
          {...formik.getFieldProps("brand")}
        />
        {formik.touched.brand && formik.errors.brand && (
          <span className="text-sm font-semibold text-red-600">
            {formik.errors.brand}
          </span>
        )}
      </label>

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

      <div className="grid gap-4 sm:grid-cols-3">
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

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-slate-700">Ocena (0-5)</span>
          <input
            id="rating"
            type="number"
            step="0.1"
            className={inputClass}
            {...formik.getFieldProps("rating")}
          />
          {formik.touched.rating && formik.errors.rating && (
            <span className="text-sm font-semibold text-red-600">
              {formik.errors.rating}
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
          placeholder='["tag-1", "tag-2"]'
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
          placeholder='{"parametr": "wartosc"}'
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
            <Image
              src={previewUrl}
              alt="Podglad miniatury"
              className="h-full w-full object-cover"
              width={200}
              height={200}
            />
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
        {isSaving ? "Zapisywanie..." : "Dodaj produkt"}
      </Button>
    </form>
  );
}
