'use client';

import "@/components/SignupForm/signup-form.scss";
import { use, useState } from 'react';
import { User } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Button from '../ui/Button/Button';

export default function SignupForm() {
  const [authOption, setAuthOption] = useState<"login" | "signup">("login");

  const toggleAuthOption = () => {
    setAuthOption((prev) => (prev === "signup" ? "login" : "signup"));
  };

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

  const signupFormik = useFormik({
    initialValues: { username: "", email: "", password: "", role: "user" },
    validationSchema: SignupSchema,
    onSubmit: ({ username, email, password, role }: User) => {
      handleSignup({ username, email, password });
    }
  });

  const loginFormik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async ({ email, password }) => {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Błąd podczas logowania");
      }
    }
  }
  );

  return (
    <>
      {
        authOption === "signup" ? (
          <div className="form-container" >
            <form onSubmit={signupFormik.handleSubmit}>
              <div className='input-box'>
                <label htmlFor="username" className="label">
                  Imię i nazwisko:
                </label>
                <input
                  id="username"
                  className="input"
                  {...signupFormik.getFieldProps("username")}
                />
                {signupFormik.touched.username && signupFormik.errors.username && (
                  <div className="error">{signupFormik.errors.username}</div>
                )}
              </div>


              <div className='input-box'>
                <label htmlFor="email" className="label">
                  Email:
                </label>
                <input
                  id="email"
                  className="input"
                  {...signupFormik.getFieldProps("email")}
                />
                {signupFormik.touched.email && signupFormik.errors.email && (
                  <div className="error">{signupFormik.errors.email}</div>
                )}

              </div>

              <div className="input-box">
                <label htmlFor="password">Hasło:</label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  {...signupFormik.getFieldProps("password")}
                />
                {signupFormik.touched.password && signupFormik.errors.password && (
                  <div className="error">{signupFormik.errors.password}</div>
                )}
              </div>

              <Button type="submit" className="signup-button" disabled={!signupFormik.isValid || !signupFormik.dirty}>
                Zarejestruj się
              </Button>
            </form>
          </div>) : (
          <div className="form-container" >
            <form onSubmit={loginFormik.handleSubmit}>
              <div className='input-box'>
                <label htmlFor="email" className="label">
                  Email:
                </label>
                <input
                  id="email"
                  className="input"
                  {...loginFormik.getFieldProps("email")}
                />
                {loginFormik.touched.email && loginFormik.errors.email && (
                  <div className="error">{loginFormik.errors.email}</div>
                )}
              </div>
              <div className="input-box">
                <label htmlFor="password">Hasło:</label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  {...loginFormik.getFieldProps("password")}
                />
                {loginFormik.touched.password && loginFormik.errors.password && (
                  <div className="error">{loginFormik.errors.password}</div>
                )}
              </div>

              <Button type="submit" className="signup-button" disabled={!loginFormik.isValid || !loginFormik.dirty}>
                Zaloguj się
              </Button>
            </form>
          </div>
        )
      };
      <div className="toggle-container">
        <p>{authOption === "signup" ? "Masz już konto?" : "Nie masz konta?"}</p>
        <Button onClick={toggleAuthOption} className="toggle-button">
          {authOption === "signup" ? "Zaloguj się" : "Zarejestruj się"}
        </Button>
      </div>
    </>
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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Nieprawidłowy format email')
    .required('Email jest wymagany'),

  password: Yup.string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),
});