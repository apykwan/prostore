export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Powered by Next.js 15 and React 19';
export const SERVER_URL = process.env.NEXT_PUBLIC_APP_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const signInDefaultValues = {
  email: '',
  password: ''
};
export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export const shippingAddressDefaultValues = {
  fullName: 'John Doe',
  streetAddress: '123 Main St',
  city: 'La Sierra',
  postalCode: '12345',
  country: 'UAA'
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;