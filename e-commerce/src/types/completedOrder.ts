export type CompletedOrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
};

export type CompletedOrder = {
  orderId: string;
  username: string;
  email: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'shipped' | 'delivered' | 'cancelled';
  items: CompletedOrderItem[];
  totalAmount: number;
  paymentMethod: 'Blik' | 'Google Pay' | 'Apple Pay' | 'Przy odbiorze' | 'Karta kredytowa' | string;
  deliveryMethod: string;
  shipper?: string;
  destination: {
    name: string;
    street: string;
    city: string;
    zipCode: string;
    phone: string;
    email: string;
  };
};