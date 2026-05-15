'use client'

import Header from "@/components/Header/Header";
import Button from "@/components/ui/Button/Button";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const inputClass = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const labelClass = "text-sm font-semibold text-slate-700";
const errorClass = "rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600";
const radioLabelClass = "flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50";

export default function OrderPage() {
  const { cart } = useApp()
  const { user } = useAuth();
  const router = useRouter();

  const handleGoToSummary = async () => {
    const errors = await formik.validateForm();
    formik.setTouched({
      deliveryMethod: true,
      shipper: true,
      paymentMethod: true,
      destination: {
        name: true,
        street: true,
        city: true,
        zipCode: true,
        phone: true,
        email: true,
      },
    });
    if (Object.keys(errors).length) return;
    await formik.submitForm();
    router.push("/order/summary");
  };

  const { setOrderDetails, getOrderDetails } = useApp();

  const getInitialDeliveryMethod = () => {
    if (typeof window === "undefined") return "";
    return getOrderDetails()?.deliveryMethod || "";
  };
  const getInitialShipper = () => {
    if (typeof window === "undefined") return "";
    return getOrderDetails()?.shipper || "";
  }
  const getInitialDestination = () => {
    if (typeof window === "undefined") return { name: "", street: "", city: "", zipCode: "", phone: "", email: "" };
    const storedDestination = getOrderDetails()?.destination || { name: "", street: "", city: "", zipCode: "", phone: "", email: "" };
    if (!storedDestination.email && user?.email) {
      return { ...storedDestination, email: user.email };
    }
    return storedDestination;
  }

  const getInitialPaymentMethod = () => {
    if (typeof window === "undefined") return "";
    return getOrderDetails()?.paymentMethod || "";
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      deliveryMethod: getInitialDeliveryMethod(),
      destination: getInitialDestination(),
      shipper: getInitialShipper(),
      paymentMethod: getInitialPaymentMethod(),
    },
    validationSchema: OrderSchema,
    onSubmit: ({ deliveryMethod, destination, shipper, paymentMethod }) => {
      setOrderDetails({
        deliveryMethod,
        destination,
        shipper,
        paymentMethod,
      });
    },
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">Zamówienie</p>
            <h1 className="text-3xl font-black text-slate-950">Dostawa i płatność</h1>
          </div>
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-700"><ChevronLeft className="h-5 w-5" />Powrót do koszyka</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <form className="grid gap-6" onSubmit={formik.handleSubmit}>
              <fieldset className="grid gap-3">
                <legend className="mb-1 text-lg font-bold text-slate-950">Sposób dostawy</legend>
                <label htmlFor="delivery-courier" className={radioLabelClass}>
                  <input type="radio" name="deliveryMethod" id="delivery-courier" value="Kurier" checked={formik.values.deliveryMethod === 'Kurier'} onChange={formik.handleChange} className="h-4 w-4 accent-orange-500" />
                  <span>Kurier</span>
                </label>
                <label htmlFor="delivery-pickup" className={radioLabelClass}>
                  <input type="radio" name="deliveryMethod" id="delivery-pickup" value="Odbiór w salonie" checked={formik.values.deliveryMethod === 'Odbiór w salonie'} onChange={formik.handleChange} className="h-4 w-4 accent-orange-500" />
                  <span>Odbiór w salonie</span>
                </label>
                {formik.touched.deliveryMethod && formik.errors.deliveryMethod && <div className={errorClass}>{formik.errors.deliveryMethod}</div>}
              </fieldset>

              <fieldset className="grid gap-3">
                <legend className="mb-1 text-lg font-bold text-slate-950">Adres dostawy</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5" htmlFor="name"><span className={labelClass}>Imię i nazwisko</span><input id="name" className={inputClass} {...formik.getFieldProps("destination.name")} /></label>
                  <label className="grid gap-1.5" htmlFor="email"><span className={labelClass}>E-mail</span><input id="email" className={inputClass} {...formik.getFieldProps("destination.email")} /></label>
                  <label className="grid gap-1.5 sm:col-span-2" htmlFor="street"><span className={labelClass}>Ulica</span><input id="street" className={inputClass} {...formik.getFieldProps("destination.street")} /></label>
                  <label className="grid gap-1.5" htmlFor="zipCode"><span className={labelClass}>Kod pocztowy</span><input id="zipCode" className={inputClass} {...formik.getFieldProps("destination.zipCode")} /></label>
                  <label className="grid gap-1.5" htmlFor="city"><span className={labelClass}>Miasto</span><input id="city" className={inputClass} {...formik.getFieldProps("destination.city")} /></label>
                  <label className="grid gap-1.5" htmlFor="phone"><span className={labelClass}>Telefon</span><input id="phone" className={inputClass} {...formik.getFieldProps("destination.phone")} /></label>
                </div>
                {formik.touched.destination?.name && formik.errors.destination?.name && <div className={errorClass}>{formik.errors.destination.name}</div>}
                {formik.touched.destination?.street && formik.errors.destination?.street && <div className={errorClass}>{formik.errors.destination.street}</div>}
                {formik.touched.destination?.zipCode && formik.errors.destination?.zipCode && <div className={errorClass}>{formik.errors.destination.zipCode}</div>}
                {formik.touched.destination?.city && formik.errors.destination?.city && <div className={errorClass}>{formik.errors.destination.city}</div>}
                {formik.touched.destination?.phone && formik.errors.destination?.phone && <div className={errorClass}>{formik.errors.destination.phone}</div>}
                {formik.touched.destination?.email && formik.errors.destination?.email && <div className={errorClass}>{formik.errors.destination.email}</div>}
              </fieldset>

              <fieldset className="grid gap-3">
                <legend className="mb-1 text-lg font-bold text-slate-950">Przesyłkę dostarczy</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label htmlFor="shipper-fedex" className={radioLabelClass}><input type="radio" name="shipper" id="shipper-fedex" value="Fedex" checked={formik.values.shipper === 'Fedex'} onChange={formik.handleChange} className="h-4 w-4 accent-orange-500" /><span>Fedex</span></label>
                  <label htmlFor="shipper-dhl" className={radioLabelClass}><input type="radio" name="shipper" id="shipper-dhl" value="dhl" checked={formik.values.shipper === 'dhl'} onChange={formik.handleChange} className="h-4 w-4 accent-orange-500" /><span>DHL</span></label>
                </div>
                {formik.touched.shipper && formik.errors.shipper && <div className={errorClass}>{formik.errors.shipper}</div>}
              </fieldset>

              <fieldset className="grid gap-3">
                <legend className="mb-1 text-lg font-bold text-slate-950">Metoda płatności</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Blik", "Google Pay", "Apple Pay", "Przy odbiorze", "Karta kredytowa"].map((method) => (
                    <label htmlFor={`payment-${method}`} className={radioLabelClass} key={method}>
                      <input type="radio" name="paymentMethod" id={`payment-${method}`} value={method} checked={formik.values.paymentMethod === method} onChange={formik.handleChange} className="h-4 w-4 accent-orange-500" />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
                {formik.touched.paymentMethod && formik.errors.paymentMethod && <div className={errorClass}>{formik.errors.paymentMethod}</div>}
              </fieldset>
            </form>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-bold text-slate-950">Podsumowanie zamówienia</h2>
            <div className="mt-4 max-h-72 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Brak produktów w koszyku.</p>
              ) : (
                <ul className="grid gap-2">
                  {cart.map((item, index) => (
                    <li key={index} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">{item.product.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.quantity} szt. · {item.product.price} zł</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-orange-50 p-4">
              <span className="text-sm font-semibold text-orange-700">Do zapłaty</span>
              <span className="text-2xl font-black text-slate-950">{cart.reduce((total, item) => total + item.product.price * item.quantity, 0)} zł</span>
            </div>
            <Button className="mt-4 w-full" onClick={handleGoToSummary}>
              Przejdź do podsumowania <ChevronRight className="h-5 w-5" />
            </Button>
          </aside>
        </div>
      </main>
    </>
  );
}

const OrderSchema = Yup.object().shape({
  deliveryMethod: Yup.string()
    .required("Wybierz sposób dostawy"),
  shipper: Yup.string()
    .required("Wybierz firmę kurierską"),
  paymentMethod: Yup.string()
    .required("Wybierz metodę płatności"),
  destination: Yup.object().shape({
    name: Yup.string()
      .min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki")
      .max(50, "Imię i nazwisko może mieć maksymalnie 50 znaków")
      .matches(
        /^[a-zA-Z ]+$/,
        'Imię i nazwisko może zawierać tylko litery'
      )
      .required("Podaj imię i nazwisko"),
    street: Yup.string()
      .min(3, "Ulica musi mieć co najmniej 3 znaki")
      .max(100, "Ulica może mieć maksymalnie 100 znaków")
      .required("Podaj ulicę"),
    zipCode: Yup.string()
      .matches(/^\d{2}-\d{3}$/, "Kod pocztowy musi mieć format XX-XXX")
      .required("Podaj kod pocztowy"),
    city: Yup.string()
      .min(2, "Miasto musi mieć co najmniej 2 znaki")
      .max(50, "Miasto może mieć maksymalnie 50 znaków")
      .matches(
        /^[a-zA-Z ]+$/,
        'Nazwa użytkownika może zawierać tylko litery bez polskich znaków'
      )
      .required("Podaj miasto"),
    phone: Yup.string()
      .matches(/^\+?\d{9,15}$/, "Podaj prawidłowy numer telefonu")
      .required("Podaj numer telefonu"),
    email: Yup.string()
      .email('Nieprawidłowy format email')
      .required("Podaj adres email"),
  })
});
