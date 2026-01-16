'use client';

import { useApp } from "@/context/AppContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import "@/styles/payment.scss";
import { useRouter } from "next/navigation";
import { CompletedOrder } from "@/types/completedOrder";
import Button from "@/components/ui/Button/Button";

export default function PaymentPage() {
  const { cart, clearCart, getOrderDetails, user } = useApp();
  const router = useRouter();

  const [readyToRender, setReadyToRender] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => setReadyToRender(true), []);

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
    onSubmit: async (values) => {
      setStatus("processing");
      setErrorMsg("");
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const items = cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          currency: "PLN",
          lineTotal: item.product.price * item.quantity,
        }));

        const order: CompletedOrder = {
          orderId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          username: user?.username || orderDetails.destination?.name || "Klient",
          email: user?.email || "",
          createdAt: new Date().toISOString(),
          status: "completed",
          items,
          totalAmount: totalPrice,
          paymentMethod,

          deliveryMethod: orderDetails?.deliveryMethod || "",
          shipper: orderDetails?.shipper,
          destination: orderDetails?.destination || {
            name: "",
            street: "",
            city: "",
            zipCode: "",
            phone: "",
            email: "",
          },
        };

        const existingRaw = typeof window !== "undefined" ? localStorage.getItem("order-history") : null;
        let existing: CompletedOrder[] = [];
        if (existingRaw) {
          try {
            const parsed = JSON.parse(existingRaw);
            if (Array.isArray(parsed)) existing = parsed;
          } catch {
            existing = [];
          }
        }

        const nextHistory = [order, ...existing];
        if (typeof window !== "undefined") {
          localStorage.setItem("order-history", JSON.stringify(nextHistory));
        }

        setStatus("success");

        clearCart()
      } catch (err) {
        console.error("Payment error", err);
        setStatus("error");
        setErrorMsg("Wystąpił błąd podczas płatności. Spróbuj ponownie.");
      }
    },
  });

  return (
    <>
      {!readyToRender ? (
        <div className="s-summary-page-container">Ładowanie płatności...</div>
      ) : status === "success" ? (
        <div className="p-summary-page-container p-result-box">
          <div className="p-page-title">Płatność zakończona</div>
          <p className="p-success-text">Twoja płatność została przetworzona pomyślnie.</p>
          <Button type="button" className="p-primary" onClick={() => router.push("/")}>Przejdź do strony głównej</Button>
        </div>
      ) : (
        <div className="p-summary-page-container">
          <div className="p-page-title">Płatność</div>
          <div className="p-payment-info">{totalPrice} zł</div>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <span>Metoda płatności</span>
              <div>{paymentMethod}</div>
              {formik.errors.paymentMethod && (
                <span className="p-error">{formik.errors.paymentMethod}</span>
              )}
            </div>

            {formik.values.paymentMethod === "Blik" && (
              <label>
                <span>Kod BLIK</span>
                <input
                  type="text"
                  name="blikCode"
                  value={formik.values.blikCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={status === "processing"}

                />
                {formik.touched.blikCode && formik.errors.blikCode && (
                  <span className="p-error">{formik.errors.blikCode}</span>
                )}
              </label>
            )}

            {formik.values.paymentMethod === "Google Pay" && (
              <label>
                <span>Adres e-mail Google Pay</span>
                <input
                  type="email"
                  name="googlePayEmail"
                  value={formik.values.googlePayEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={status === "processing"}

                />
                {formik.touched.googlePayEmail && formik.errors.googlePayEmail && (
                  <span className="p-error">{formik.errors.googlePayEmail}</span>
                )}
              </label>
            )}

            {formik.values.paymentMethod === "Apple Pay" && (
              <label>
                <span>Apple ID (e-mail)</span>
                <input
                  type="email"
                  name="applePayEmail"
                  value={formik.values.applePayEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={status === "processing"}

                />
                {formik.touched.applePayEmail && formik.errors.applePayEmail && (
                  <span className="p-error">{formik.errors.applePayEmail}</span>
                )}
              </label>
            )}


            {formik.values.paymentMethod === "Karta kredytowa" && (
              <label>
                <span>Numer karty</span>
                <input
                  type="text"
                  name="creditCardNumber"
                  value={formik.values.creditCardNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={status === "processing"}
                  placeholder="1234 5678 9012 3456"
                />
                {formik.touched.creditCardNumber && formik.errors.creditCardNumber && (
                  <span className="p-error">{formik.errors.creditCardNumber}</span>
                )}
              </label>
            )}

            {status === "error" && <div className="p-error">{errorMsg}</div>}

            <Button type="submit" disabled={status === "processing"} className="p-primary">
              {status === "processing" ? "Przetwarzanie..." : "Zapłać"}
            </Button>
          </form>
        </div>
      )}
    </>
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

