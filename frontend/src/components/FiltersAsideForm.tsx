'use client';

import { useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'

const inputClass = "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const labelClass = "block text-xs font-bold uppercase tracking-[0.08em] text-slate-600";
const errorClass = "mt-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600";

export default function FiltersAsideForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const formik = useFormik({
    initialValues: { priceFrom: '', priceTo: '', producer: '', ratingFrom: '', ratingTo: '' },
    validationSchema: FiltersSchema,
    onSubmit: () => undefined,
  });

  const debouncedFilters = useDebouncedCallback((values) => {
    const params = new URLSearchParams(searchParams);
    const { priceFrom, priceTo, producer, ratingFrom, ratingTo } = values;

    const setOrDelete = (key: string, value: string | number | null) => {
      if (value === '' || value === null || value === 0) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    };

    setOrDelete('priceFrom', priceFrom);
    setOrDelete('priceTo', priceTo);
    setOrDelete('producer', producer);
    setOrDelete('ratingFrom', ratingFrom);
    setOrDelete('ratingTo', ratingTo);

    replace(`${pathname}?${params}`);
  }, 500);

  useEffect(() => {
    if (!formik.isValid) return;
    debouncedFilters(formik.values);
    return () => debouncedFilters.cancel();
  }, [debouncedFilters, formik.values, formik.isValid]);

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl lg:sticky lg:top-28 lg:ml-auto lg:w-72 lg:shrink-0">
      <form onSubmit={formik.handleSubmit} className="grid gap-4" noValidate>
        <div>
          <label htmlFor="priceFrom" className={labelClass}>Cena</label>
          <div className='grid grid-cols-2 gap-3'>
            <input
              {...formik.getFieldProps("priceFrom")}
              id="priceFrom"
              type="number"
              placeholder="od"
              min={0}
              max={10000}
              step={1}
              inputMode="numeric"
              className={inputClass}
            />
            <input
              {...formik.getFieldProps("priceTo")}
              id="priceTo"
              type="number"
              placeholder="do"
              min={0}
              max={10000}
              step={1}
              inputMode="numeric"
              className={inputClass}
            />
          </div>
          {formik.touched.priceFrom && formik.errors.priceFrom && <div className={errorClass}>{formik.errors.priceFrom}</div>}
          {formik.touched.priceTo && formik.errors.priceTo && <div className={errorClass}>{formik.errors.priceTo}</div>}
        </div>

        <div>
          <label htmlFor="producer" className={labelClass}>Producent</label>
          <input
            {...formik.getFieldProps("producer")}
            id="producer"
            type="text"
            maxLength={50}
            inputMode="text"
            autoComplete="off"
            className={inputClass}
          />
          {formik.touched.producer && formik.errors.producer && <div className={errorClass}>{formik.errors.producer}</div>}
        </div>

        <div>
          <label htmlFor="ratingFrom" className={labelClass}>Ocena</label>
          <div className='grid grid-cols-2 gap-3'>
            <input
              {...formik.getFieldProps("ratingFrom")}
              id="ratingFrom"
              type="number"
              placeholder="od"
              min={0}
              max={5}
              step={0.1}
              inputMode="decimal"
              className={inputClass}
            />
            <input
              {...formik.getFieldProps("ratingTo")}
              id="ratingTo"
              type="number"
              placeholder="do"
              min={0}
              max={5}
              step={0.1}
              inputMode="decimal"
              className={inputClass}
            />
          </div>
          {formik.touched.ratingFrom && formik.errors.ratingFrom && <div className={errorClass}>{formik.errors.ratingFrom}</div>}
          {formik.touched.ratingTo && formik.errors.ratingTo && <div className={errorClass}>{formik.errors.ratingTo}</div>}
        </div>
      </form>
    </aside>
  );
}

/** Zamienia <code>&apos;&apos;</code>/null/undefined na brak wartości — liczba z pola number lub string. */
function coerceOptionalNumber(originalValue: unknown): number | undefined {
  if (originalValue === '' || originalValue === null || typeof originalValue === 'undefined')
    return undefined;
  const n = typeof originalValue === 'number' ? originalValue : Number(originalValue);
  return Number.isFinite(n) ? n : undefined;
}

const optionalPrice = Yup.number()
  .optional()
  .transform((_v, raw) => coerceOptionalNumber(raw))
  .min(0, 'Cena nie może być ujemna.')
  .max(10000, 'Cena nie może przekraczać 10000.');

const optionalRating = Yup.number()
  .optional()
  .transform((_v, raw) => coerceOptionalNumber(raw))
  .min(0, 'Ocena nie może być mniejsza niż 0.')
  .max(5, 'Ocena nie może przekraczać 5.');

const FiltersSchema = Yup.object({
  priceFrom: optionalPrice,
  priceTo: optionalPrice,

  producer: Yup.string()
    .transform((val) => (typeof val === 'string' ? val.trim() : ''))
    .max(50, 'Najwyżej 50 znaków.')
    .matches(/^$|^.{2,50}$/, 'Albo pozostaw puste, albo wpisz co najmniej 2 znaki.'),

  ratingFrom: optionalRating,
  ratingTo: optionalRating,
});
