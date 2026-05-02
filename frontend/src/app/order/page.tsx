'use client'

import FavoritesDrawer from "@/components/FavoritesDrawer/FavoritesDrawer";
import Header from "@/components/Header/Header";
import Button from "@/components/ui/Button/Button";
import { useApp } from "@/context/AppContext";
import "@/styles/order.scss";
import { useFormik } from "formik";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function OrderPage() {
  const { cart, user } = useApp()
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
    if (!storedDestination.name && user?.username) {
      return { ...storedDestination, name: user.username, email: user.email };
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
      <FavoritesDrawer />
      <Header />
      <div className="o-main-section">
        <div className="header-and-back-button">
          <div className="title-section">
            <h1>Dostawa i płatność</h1>
          </div>
          <Link href="/cart"><ChevronLeft />Powrót do koszyka</Link>
        </div>

        <div className="order-and-summary-section">
          <div className="o-order-details">

            <h2>Sposób dostawy</h2>
            <form className="order-details-form" onSubmit={formik.handleSubmit}>
              <label htmlFor="deliveryMethod"
              >
                <input
                  type="radio"
                  id="deliveryMethod"
                  value="Kurier"
                  checked={formik.values.deliveryMethod === 'Kurier'}
                  onChange={formik.handleChange}
                />
                <span>Kurier</span>
              </label>
              <label htmlFor="deliveryMethod"
              >
                <input
                  type="radio"
                  id="deliveryMethod"
                  value="Odbiór w salonie"
                  checked={formik.values.deliveryMethod === 'Odbiór w salonie'}
                  onChange={formik.handleChange}
                />
                <span>Odbiór w salonie</span>
              </label>
              {formik.touched.deliveryMethod && formik.errors.deliveryMethod && (
                <div className="error">{formik.errors.deliveryMethod}</div>
              )}

              <h2>Adres dostawy</h2>
              <label htmlFor="name" className="label">
                Imię i nazwisko:
              </label>
              <input
                id="name"
                className="form-input"
                {...formik.getFieldProps("destination.name")}
              />
              {formik.touched.destination?.name && formik.errors.destination?.name && (
                <div className="error">{formik.errors.destination.name}</div>
              )}
              <label htmlFor="street" className="label">
                Ulica:
              </label>
              <input
                id="street"
                className="form-input"
                {...formik.getFieldProps("destination.street")}
              />
              {formik.touched.destination?.street && formik.errors.destination?.street && (
                <div className="error">{formik.errors.destination.street}</div>
              )}
              <label htmlFor="zipCode" className="label">
                Kod pocztowy:
              </label>
              <input
                id="zipCode"
                className="form-input"
                {...formik.getFieldProps("destination.zipCode")}
              />
              {formik.touched.destination?.zipCode && formik.errors.destination?.zipCode && (
                <div className="error">{formik.errors.destination.zipCode}</div>
              )}
              <label htmlFor="city" className="label">
                Miasto:
              </label>
              <input
                id="city"
                className="form-input"
                {...formik.getFieldProps("destination.city")}
              />
              {formik.touched.destination?.city && formik.errors.destination?.city && (
                <div className="error">{formik.errors.destination.city}</div>
              )}
              <label htmlFor="phone" className="label">
                Telefon
              </label>
              <input
                id="phone"
                className="form-input"
                {...formik.getFieldProps("destination.phone")}
              />
              {formik.touched.destination?.phone && formik.errors.destination?.phone && (
                <div className="error">{formik.errors.destination.phone}</div>
              )}
              <label htmlFor="email" className="label">
                E-mail
              </label>
              <input
                id="email"
                className="form-input"
                {...formik.getFieldProps("destination.email")}
              />
              {formik.touched.destination?.email && formik.errors.destination?.email && (
                <div className="error">{formik.errors.destination.email}</div>
              )}

              <div className="shippers">
                <h2>Przesyłkę dostarczy</h2>
                <label htmlFor="shipper-fedex"
                >
                  <input
                    type="radio"
                    id="shipper"
                    value="Fedex"
                    checked={formik.values.shipper === 'Fedex'}
                    onChange={formik.handleChange}
                  />
                  <span>Fedex</span>
                </label>
                <label htmlFor="shipper-dhl"
                >
                  <input
                    type="radio"
                    id="shipper"
                    value="dhl"
                    checked={formik.values.shipper === 'dhl'}
                    onChange={formik.handleChange}
                  />
                  <span>DHL</span>
                </label>
                {formik.touched.shipper && formik.errors.shipper && (
                  <div className="error">{formik.errors.shipper}</div>
                )}
              </div>

              <div className="payment-method">
                <h2>Metoda płatności</h2>
                <label htmlFor="paymentMethod"
                >
                  <input
                    type="radio"
                    id="paymentMethod"
                    value="Blik"
                    checked={formik.values.paymentMethod === 'Blik'}
                    onChange={formik.handleChange}
                  />
                  <span>Blik</span>
                </label>
                <label htmlFor="paymentMethod"
                >
                  <input
                    type="radio"
                    id="paymentMethod"
                    value="Google Pay"
                    checked={formik.values.paymentMethod === 'Google Pay'}
                    onChange={formik.handleChange}
                  />
                  <span>Google Pay</span>
                </label>
                <label htmlFor="paymentMethod"
                >
                  <input
                    type="radio"
                    id="paymentMethod"
                    value="Apple Pay"
                    checked={formik.values.paymentMethod === 'Apple Pay'}
                    onChange={formik.handleChange}
                  />
                  <span>Apple Pay</span>
                </label>
                <label htmlFor="paymentMethod"
                >
                  <input
                    type="radio"
                    id="paymentMethod"
                    value="Przy odbiorze"
                    checked={formik.values.paymentMethod === 'Przy odbiorze'}
                    onChange={formik.handleChange}
                  />
                  <span>Przy odbiorze</span>
                </label>
                <label htmlFor="paymentMethod"
                >
                  <input
                    type="radio"
                    id="paymentMethod"
                    value="Karta kredytowa"
                    checked={formik.values.paymentMethod === 'Karta kredytowa'}
                    onChange={formik.handleChange}
                  />
                  <span>Karta kredytowa</span>
                </label>
              </div>
              {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                <div className="error">{formik.errors.paymentMethod}</div>
              )}
            </form>
          </div>
          <div className="summary-section">
            <div className="products-list-summary">
              <h2>Podsumowanie zamówienia</h2>
              {cart.length === 0 ? (
                <p>Brak produktów w koszyku.</p>
              ) : (
                <ul>
                  {cart.map((item, index) => (
                    <li key={index}>
                      {item.product.name} - {item.quantity} szt. - {item.product.price} zł
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="total-price-summary">
              <span>Do zapłaty</span>
              <span>{cart.reduce((total, item) => total + item.product.price * item.quantity, 0)} zł</span>
            </div>
            <Button className="go-to-summary-button" onClick={handleGoToSummary}>
              Przejdź do podsumowania <ChevronRight />
            </Button>
          </div>
        </div>

      </div>
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