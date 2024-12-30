

export enum OrderStatus {
  FAILED='FAILED',
  PENDING='PENDING',
  COMPLETED='COMPLETED',
  CANCELED='CANCELED'
};

type Order ={
  id: string;
  total: number;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  orderItems?: OrderItem[];
  payments?: PaymentIntent[];
}

type OrderItem ={
  id: string;

  productId: string;

  product: ProductDto;

  quantity: number;

  orderId: string;
}

type PaymentIntent ={
  id: string;
  orderId: string;
  stripePaymentId: string;
  stripeClientSecret: string;
  stripeStatus: string;
  stripeAmount: number;
  stripeCurrency: string;
  stripePaymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
