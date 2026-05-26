'use client';

import { useApp } from "@/context/AppContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import { useAuth } from "@/context/AuthContext";
import { useCreateOrder } from "@/lib/queries/orders";
import { useUpdateMyProfile } from "@/lib/queries/user";

const inputClass = "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

export default function PaymentPage() {
  const { cart, clearCart, getOrderDetails, clearOrderDetails } = useApp();
  const { user } = useAuth();
  const router = useRouter();
  const createOrderMutation = useCreateOrder();
  const updateMyProfileMutation = useUpdateMyProfile();

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const orderDetails = getOrderDetails();
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const paymentMethod = orderDetails.paymentMethod || "";

  const formik = useFormik({
    initialValues: {
      paymentMethod,
      blikCode: "",
      googlePayEmail: "",
      applePayEmail: "",
      creditCardNumber: "",

    },
    validationSchema: PaymentSchema,
    onSubmit: async () => {
      setStatus("processing");
      setErrorMsg("");
      try {
        const destination = orderDetails?.destination || {
          name: "",
          street: "",
          city: "",
          zipCode: "",
          phone: "",
          email: "",
        };

        await createOrderMutation.mutateAsync({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          destination,
          paymentMethod,
          deliveryMethod: orderDetails?.deliveryMethod || "",
          shipper: orderDetails?.shipper,
          email: user?.email,
        });

        try {
          await updateMyProfileMutation.mutateAsync({
            name: destination.name,
            phone: destination.phone,
            street: destination.street,
            city: destination.city,
            zipCode: destination.zipCode,
          });
        } catch (profileError) {
          console.error("Profile update error", profileError);
        }

        setStatus("success");

        clearCart();
        clearOrderDetails();
      } catch (err) {
        console.error("Payment error", err);
        setStatus("error");
        if (err instanceof Error && err.message) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Wystąpił błąd podczas płatności. Spróbuj ponownie.");
        }
      }
    },
  });

  return (
    <main className="mx-auto grid min-h-[70vh] w-full max-w-xl place-items-center px-4 py-10">
      {status === "success" ? (
        <div className="w-full rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-xl sm:p-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-emerald-100" />
          <h1 className="text-3xl font-black text-slate-950">Płatność zakończona</h1>
          <p className="mt-2 text-sm text-slate-500">Twoja płatność została przetworzona pomyślnie.</p>
          <Button type="button" className="mt-6 w-full" onClick={() => router.push("/")}>Przejdź do strony głównej</Button>
        </div>
      ) : (
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Płatność</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{totalPrice} zł</h1>
          </div>
          <form onSubmit={formik.handleSubmit} className="grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Metoda płatności</span>
              <div className="mt-1 font-semibold text-slate-950">{paymentMethod || "-"}</div>
              {formik.errors.paymentMethod && <span className="mt-2 block text-sm font-semibold text-red-600">{formik.errors.paymentMethod}</span>}
            </div>

            {formik.values.paymentMethod === "Blik" && (
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-slate-700">Kod BLIK</span>
                <input type="text" name="blikCode" value={formik.values.blikCode} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={status === "processing"} className={inputClass} />
                {formik.touched.blikCode && formik.errors.blikCode && <span className="text-sm font-semibold text-red-600">{formik.errors.blikCode}</span>}
              </label>
            )}

            {formik.values.paymentMethod === "Google Pay" && (
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-slate-700">Adres e-mail Google Pay</span>
                <input type="email" name="googlePayEmail" value={formik.values.googlePayEmail} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={status === "processing"} className={inputClass} />
                {formik.touched.googlePayEmail && formik.errors.googlePayEmail && <span className="text-sm font-semibold text-red-600">{formik.errors.googlePayEmail}</span>}
              </label>
            )}

            {formik.values.paymentMethod === "Apple Pay" && (
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-slate-700">Apple ID (e-mail)</span>
                <input type="email" name="applePayEmail" value={formik.values.applePayEmail} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={status === "processing"} className={inputClass} />
                {formik.touched.applePayEmail && formik.errors.applePayEmail && <span className="text-sm font-semibold text-red-600">{formik.errors.applePayEmail}</span>}
              </label>
            )}

            {formik.values.paymentMethod === "Karta kredytowa" && (
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold text-slate-700">Numer karty</span>
                <input type="text" name="creditCardNumber" value={formik.values.creditCardNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={status === "processing"} placeholder="1234 5678 9012 3456" className={inputClass} />
                {formik.touched.creditCardNumber && formik.errors.creditCardNumber && <span className="text-sm font-semibold text-red-600">{formik.errors.creditCardNumber}</span>}
              </label>
            )}

            {status === "error" && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{errorMsg}</div>}

            <Button type="submit" disabled={status === "processing"} className="mt-2 w-full">
              {status === "processing" ? "Przetwarzanie..." : "Zapłać"}
            </Button>
          </form>
        </div>
      )}
    </main>
  );
}

const PaymentSchema = Yup.object({
  paymentMethod: Yup.string()
    .oneOf(["Blik", "Google Pay", "Apple Pay", "Przy odbiorze", "Karta kredytowa"], "Wybierz poprawną metodę")
    .required("Wybierz metodę płatności"),
  blikCode: Yup.string().when("paymentMethod", ([method], schema) =>
    method === "Blik"
      ? schema.matches(/^\d{6}$/g, "Kod BLIK musi mieć 6 cyfr").required("Podaj kod BLIK")
      : schema.notRequired()
  ),
  googlePayEmail: Yup.string().when("paymentMethod", ([method], schema) =>
    method === "Google Pay"
      ? schema.email("Podaj poprawny e-mail").required("Podaj e-mail powiązany z Google Pay")
      : schema.notRequired()
  ),
  applePayEmail: Yup.string().when("paymentMethod", ([method], schema) =>
    method === "Apple Pay"
      ? schema.email("Podaj poprawny e-mail").required("Podaj Apple ID")
      : schema.notRequired()
  ),
  creditCardNumber: Yup.string().when("paymentMethod", ([method], schema) =>
    method === "Karta kredytowa"
      ? schema.matches(/^\d{12,19}$/g, "Numer karty powinien mieć 12-19 cyfr").required("Podaj numer karty")
      : schema.notRequired()
  ),
});
