'use client';
import Button from "@/components/ui/Button/Button";
import { useApp } from "@/context/AppContext";
import "@/styles/summary.scss";
import { OrderDetails } from "@/types/orderDetails";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const emptyOrderDetails: OrderDetails = {
  deliveryMethod: "",
  destination: { name: "", street: "", city: "", zipCode: "", phone: "", email: "" },
  paymentMethod: "",
  shipper: "",
};

export default function SummaryPage() {
  const { getOrderDetails, cart } = useApp();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>(emptyOrderDetails);
  const router = useRouter();

  useEffect(() => {
    setOrderDetails(getOrderDetails() || emptyOrderDetails);
  }, [getOrderDetails]);

  const { deliveryMethod, destination, paymentMethod, shipper } = orderDetails;
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleBuy = () => {
    router.push('/order/summary/payment');
  }

  return (
    <div className="s-summary-page-container">
      <Link href="/"><Image src="/images/shop-icon.png" alt="back-to-home" width={100} height={100} className="back-to-home-icon" /></Link>
      <div className="s-page-title">Podsumowanie</div>
      <div className="s-summary-and-buy-section">
        <div className="s-summary-info">
          <div className="s-shipment-details">
            <h3>Sposób dostawy</h3>
            <div>{deliveryMethod}</div>
            <h3>Przesyłkę dostarczy</h3>
            <div>{shipper}</div>
          </div>
          <div className="s-destination-details">
            <h3>Adres dostawy</h3>
            <div>{destination?.name}</div>
            <div>{destination?.street}</div>
            <div>{destination?.city}, {destination?.zipCode}</div>
            <div>Tel: {destination?.phone}</div>
            <div>Email: {destination?.email}</div>
          </div>
          <div className="s-payment-details">
            <h3>Płatność</h3>
            <div>{paymentMethod}</div>
          </div>
          <div className="s-products-details">
            {cart.map((item, index) => (
              <div key={index} className="s-product-item">
                <Image src={item.product.thumbnail} alt={item.product.name} width={50} height={50} />
                <div className="s-product-title">{item.product.name}</div>
                <div className="s-product-quantity">x{item.quantity}</div>
                <div className="s-product-price">{item.product.price} zł</div>
              </div>
            ))}
          </div>
        </div>
        <div className="s-buy-info">
          <Link href="/order" className="s-summary-back-link"><ChevronLeft />Powrót do zamówienia</Link>
          <div className="s-to-pay">
            <span>Do zapłaty</span>
            <span className="s-total-price-summary">{totalPrice} zł</span>
          </div>

          <Button className="s-buy-button" onClick={handleBuy}>Kupuję i płacę</Button>
        </div>
      </div>

    </div>
  )
}