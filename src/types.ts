/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'VENDOR';

export interface User {
  userID: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  createdAt: string;
  role: UserRole;
}

export interface Customer extends User {
  role: 'CUSTOMER';
}

export interface Vendor extends User {
  role: 'VENDOR';
  companyName: string;
}

export interface Admin extends User {
  role: 'ADMIN';
}

export interface Address {
  addressID: number;
  customerID: number;
  address_type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface VendorAddress {
  addressID: number;
  vendorID: number;
  address_type: 'warehouse' | 'office' | 'pickup';
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Brand {
  brandID: number;
  bName: string;
}

export interface Category {
  categoryID: number;
  Cname: string;
  parentCategoryID?: number | null;
}

export interface Product {
  productID: number;
  name: string;
  description: string;
  basePrice: number;
  brandID?: number | null;
  categoryID?: number | null;
  createdBy?: number | null;
  createdAt: string;
  imageUrl?: string;
}

export interface ProductVariant {
  variantID: number;
  productID: number;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
}

export interface Inventory {
  inventoryID: number;
  productID: number;
  vendorID: number;
  quantityAvailable: number;
  lastUpdated: string;
}

export interface Review {
  reviewID: number;
  customerID: number;
  productID: number;
  reviewText: string;
  rating: number;
  createdAt: string;
  customerName?: string;
}

export interface Discount {
  discountID: number;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  couponCode?: string;
  minOrderValue: number;
  maxUsageLimit?: number;
  timesUsed: number;
  startDate: string;
  endDate: string;
}

export interface Order {
  order_id: number;
  customerID: number;
  deliveryAddressID?: number | null;
  total_amount: number;
  order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
  discountID?: number | null;
}

export interface OrderItem {
  orderItemID: number;
  orderID: number;
  productID?: number | null;
  variantID?: number | null;
  productName: string;
  sku: string;
  quantity: number;
  unit_price: number;
}

export interface Payment {
  paymentID: number;
  orderID: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'credit_card' | 'debit_card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  amount: number;
  transactionRef?: string;
  isPrimary: boolean;
  date: string;
}

export interface Cart {
  cartID: number;
  customerID: number;
  createdAt: string;
  cartStatus: 'active' | 'saved' | 'ordered' | 'abandoned';
}

export interface CartItem {
  cartItemID: number;
  cartID: number;
  productID: number;
  variantID?: number | null;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}
