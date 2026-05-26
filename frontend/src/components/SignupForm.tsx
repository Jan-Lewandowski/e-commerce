'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Button from './ui/Button/Button';
import { apiFetch } from '@/lib/apiClient';
import { queryKeys } from '@/lib/queryKeys';

const inputClass = "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

export default function SignupForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: SignupSchema,
    onSubmit: async ({ email, password }) => {
      setError(null);
      try {
        const path = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
        await apiFetch(path, { method: 'POST', body: { email, password } });
        await queryClient.invalidateQueries({ queryKey: queryKeys.me });
        router.replace('/');
      } catch (err: unknown) {
        console.error('Auth error', err);
        if (err instanceof Error) setError(err.message);
        else setError(String(err) || 'Wystąpił błąd');
      }
    },
  });

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError(null);
    formik.resetForm()
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">TechStore</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{mode === 'register' ? 'Utwórz konto' : 'Witaj ponownie'}</h1>
        <p className="mt-2 text-sm text-slate-500">{mode === 'register' ? 'Zarejestruj się, aby przejść do sklepu.' : 'Zaloguj się, aby kontynuować zakupy.'}</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid gap-4">
        <label htmlFor="email" className="grid gap-1.5">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input id="email" className={inputClass} {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email && <span className="text-sm font-semibold text-red-600">{formik.errors.email}</span>}
        </label>

        <label htmlFor="password" className="grid gap-1.5">
          <span className="text-sm font-semibold text-slate-700">Hasło</span>
          <input id="password" className={inputClass} type="password" {...formik.getFieldProps('password')} />
          {formik.touched.password && formik.errors.password && <span className="text-sm font-semibold text-red-600">{formik.errors.password}</span>}
        </label>

        {error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{error}</div>}

        <Button type="submit" className="mt-2 w-full" disabled={!formik.isValid || !formik.dirty}>
          {mode === 'register' ? 'Zarejestruj się' : 'Zaloguj się'}
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-sm text-slate-500">{mode === 'register' ? 'Masz już konto?' : 'Nie masz konta?'}</p>
        <Button onClick={toggleMode} variant="ghost" className="mt-2 text-orange-700 hover:bg-orange-50">
          {mode === 'register' ? 'Zaloguj się' : 'Zarejestruj się'}
        </Button>
      </div>
    </div>
  );
}

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Nieprawidłowy format email')
    .required('Email jest wymagany'),

  password: Yup.string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),
});
