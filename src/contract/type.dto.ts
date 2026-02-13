export type ConstantTypeActive = "active" | "inactive";
export type ConstantStatus = "archived" | ConstantTypeActive;

export type ShippingStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type NotificationType = "order" | "review" | "discount" | "other";

export type NotificationPriority = "high" | "medium" | "low";

export type NotificationAction = "view" | "edit" | "delete" | "other";

export type NotificationCategory = "order" | "review" | "discount" | "other";

export type SubCategoryStatus = ConstantStatus;

export type ConstantNotification = "read" | "unread";
export enum NotificationStatusEnum {
  READ = "read",
  UNREAD = "unread",
}
export type ConstantDiscount = "expired" | ConstantTypeActive;
export enum DiscountStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

export type ConstantReview = "pending" | "approved" | "rejected";
export enum ReviewStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
export type ConstantAddress = "home" | "work" | "other";
export enum AddressTypeEnum {
  HOME = "home",
  WORK = "work",
  OTHER = "other",
}
export type ConstantDiscountType = "percentage" | "fixed";
export enum DiscountTypeEnum {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
export type PaymentMethod = "cash" | "card" | "wallet" | "cod";
export enum PaymentMethodEnum {
  PAYPAL = "paypal",
  STRIPE = "stripe",
  COD = "cod",
  WALLET = "wallet",
}
export type ConstantPaymentProvider = "paypal" | "stripe" | "paymob";
export enum PaymentProviderEnum {
  PAYPAL = "paypal",
  STRIPE = "stripe",
  PAYMOB = "paymob",
}
export type ConstantPaymentInstrument = "visa" | "mastercard" | "amex" | "jcb";
export enum PaymentInstrumentEnum {
  VISA = "visa",
  MASTERCARD = "mastercard",
  AMEX = "amex",
  JCB = "jcb",
}
export type OrderPayment = {
  method: PaymentMethodEnum;
  provider: PaymentProviderEnum;
  instrument: PaymentInstrumentEnum;
};
