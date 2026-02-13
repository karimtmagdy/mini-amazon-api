export const PAYMENT_STATUS = ["pending", "completed", "failed"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];
export const METHOD_STATUS = ["paypal", "stripe", "cod"] as const;
export type MethodStatus = (typeof METHOD_STATUS)[number];

export const CURRENCY_STATUS = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "EGP",
  "SAR",
] as const;

export type CurrencyStatus = (typeof CURRENCY_STATUS)[number];