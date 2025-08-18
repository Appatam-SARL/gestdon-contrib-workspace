export type tMethodPayment =
  | 'BANK_CARD'
  | 'MOBILE_MONEY'
  | 'VISA'
  | 'MASTERCARD'
  | 'CREDIT_CARD'
  | 'PAYPAL'
  | 'APPLE_PAY'
  | 'GOOGLE_PAY';

export type tItemMethodPayment = {
  name: tMethodPayment;
  logo: string | string[];
};

export type tRecordPayment = Record<tMethodPayment, tItemMethodPayment>;

export type payment = {
  contributorId: string;
  packageId: string;
  method: tMethodPayment;
  amount: number;
  currency: string;
};
