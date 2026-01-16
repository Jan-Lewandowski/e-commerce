export type OrderDetails = {
  deliveryMethod?: string;
  destination?: { name: string, street: string, city: string, zipCode: string, phone: string, email: string };
  shipper?: string;
  paymentMethod?: string;
};
