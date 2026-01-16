'use client';

import "@/components/SignupForm/signup-form.scss";
import { User } from '@/types/user';
import { useApp } from '@/context/AppContext';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as Yup from 'yup';
import Button from '../ui/Button/Button';

export default function SignupForm() {
  const { signup, isLoggedIn, authReady } = useApp();
  const router = useRouter();


  useEffect(() => {
    if (!authReady || !isLoggedIn) return;
    router.replace("/");
  }, [authReady, isLoggedIn]);

  const formik = useFormik({
    initialValues: { username: "", email: "", role: "" },
    validationSchema: SignupSchema,
    onSubmit: ({ username, email }: User) => {
      const isAdmin = username.toLowerCase() === "admin";
      const role = isAdmin ? "admin" : "user";
      signup(username, email, role);
      router.push("/");
    }
  });

  if (!authReady) {
    return <div className="form-container">Loading...</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        <div className='input-box'>
          <label htmlFor="username" className="label">
            Imię i nazwisko:
          </label>
          <input
            id="username"
            className="input"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error">{formik.errors.username}</div>
          )}
        </div>


        <div className='input-box'>
          <label htmlFor="email" className="label">
            Email:
          </label>
          <input
            id="email"
            className="input"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}

        </div>


        <Button type="submit" className="signup-button" disabled={!formik.isValid || !formik.dirty}>
          Zarejestruj się
        </Button>
      </form>
    </div>
  );
}

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki")
    .max(50, "Imię i nazwisko może mieć maksymalnie 50 znaków")
    .matches(
      /^[a-zA-Z ]+$/,
      'Imię i nazwisko może zawierać tylko litery'
    )
    .required("Podaj imię i nazwisko"),

  email: Yup.string()
    .email('Nieprawidłowy format email')
    .required('Email jest wymagany'),

});