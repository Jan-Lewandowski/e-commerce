'use client';

import "@/components/SignupForm/signup-form.scss";
import { User } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Button from '../ui/Button/Button';

export default function SignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchSignup = async (username: string, email: string, password: string) => {
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      throw new Error("Błąd podczas rejestracji");
    }
    return response.json();
  };

  const { mutate: handleSignup } = useMutation({
    mutationFn: ({ username, email, password }: { username: string, email: string, password: string }) => fetchSignup(username, email, password),
    onError: (error: Error) => {
      console.error("Błąd podczas rejestracji:", error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.replace("/");
    }
  });

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "", role: "user" },
    validationSchema: SignupSchema,
    onSubmit: ({ username, email, password, role }: User) => {
      handleSignup({ username, email, password });
    }
  });

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

        <div className="input-box">
          <label htmlFor="password">Hasło:</label>
          <input
            id="password"
            className="input"
            type="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
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

  password: Yup.string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),

});