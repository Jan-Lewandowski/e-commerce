'use client';

import { useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import "@/components/FiltersAsideForm/filters-aside-form.scss"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'
import { useApp } from '@/context/AppContext';

export default function FiltersAsideForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { isFiltersVisible } = useApp();

  const formik = useFormik({
    initialValues: { priceFrom: '', priceTo: '', producer: '', ratingFrom: '', ratingTo: '' },
    validationSchema: FiltersSchema,
    onSubmit: (values) => { },
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
    <>
      {isFiltersVisible && (
        <div className="filters-aside">
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="priceFrom" className="label">
              Cena
            </label>
            <div className='inputs'>
              <input
                id="priceFrom"
                type="number"
                placeholder='od'
                className="input"
                {...formik.getFieldProps("priceFrom")}
              />
              <input
                id="priceTo"
                type="number"
                placeholder='do'
                className="input"
                {...formik.getFieldProps("priceTo")}
              />

            </div>
            {formik.touched.priceFrom && formik.errors.priceFrom && (
              <div className="error">{formik.errors.priceFrom}</div>
            )}
            {formik.touched.priceTo && formik.errors.priceTo && (
              <div className="error">{formik.errors.priceTo}</div>
            )}
            <label htmlFor="producer" className="label">
              Producent:
            </label>
            <input
              id="producer"
              className="input"

              {...formik.getFieldProps("producer")}
            />
            {
              formik.touched.producer && formik.errors.producer && (
                <div className="error">{formik.errors.producer}</div>
              )
            }


            <label htmlFor="ratingFrom" className="label">
              Ocena:
            </label>
            <div className='inputs'>
              <input
                id="ratingFrom"
                type="number"
                placeholder='od'
                className="input"
                {...formik.getFieldProps("ratingFrom")}
              />



              <input
                id="ratingTo"
                type="number"
                placeholder='do'
                className="input"
                {...formik.getFieldProps("ratingTo")}
              />
            </div>
            {formik.touched.ratingFrom && formik.errors.ratingFrom && (
              <div className="error">{formik.errors.ratingFrom}</div>
            )}
            {
              formik.touched.ratingTo && formik.errors.ratingTo && (
                <div className="error">{formik.errors.ratingTo}</div>
              )
            }
          </form >
        </div >)}
    </>
  );
}

const FiltersSchema = Yup.object({
  priceFrom: Yup.number()
    .min(0, 'Cena nie może być mniejsza niż 0'),

  priceTo: Yup.number()
    .min(0, 'Cena nie może być mniejsza niż 0')
    .max(10000, 'Cena nie może być większa niż 10000'),

  producer: Yup.string()
    .min(2, 'Nazwa producenta musi mieć co najmniej 2 znaki')
    .max(50, 'Nazwa producenta nie może przekraczać 50 znaków'),

  ratingFrom: Yup.number()
    .min(0, 'Ocena nie może być mniejsza niż 0')
    .max(5, 'Ocena nie może być większa niż 5'),

  ratingTo: Yup.number()
    .min(0, 'Ocena nie może być mniejsza niż 0')
    .max(5, 'Ocena nie może być większa niż 5'),

});