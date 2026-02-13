import { Types } from "mongoose";
import { At } from "./global.dto";
export const ORDER_STATUS = [
  "pending",
  "shipped",
  "out_for_delivery",
  "confirmed",
  "processing",
  "delivered",
  "cancelled",
  "refunded",
  "returned",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export type OrderItemDto = {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export type OrderDto = At & {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  orderItems: OrderItemDto[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string; // Stripe Payment Intent ID
    status: string;
    updateTime: Date;
    emailAddress: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  stripeSessionId?: string; // Stripe Checkout Session ID
}
