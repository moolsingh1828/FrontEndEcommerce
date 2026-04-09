import { Product, Category, Brand, User, Review, ProductVariant } from "../types";

export const MOCK_CATEGORIES: Category[] = [
  { categoryID: 1, Cname: "Electronics", parentCategoryID: null },
  { categoryID: 2, Cname: "Laptops", parentCategoryID: 1 },
  { categoryID: 3, Cname: "Smartphones", parentCategoryID: 1 },
  { categoryID: 4, Cname: "Fashion", parentCategoryID: null },
  { categoryID: 5, Cname: "Men's Wear", parentCategoryID: 4 },
  { categoryID: 6, Cname: "Women's Wear", parentCategoryID: 4 },
  { categoryID: 7, Cname: "Home & Living", parentCategoryID: null },
];

export const MOCK_BRANDS: Brand[] = [
  { brandID: 1, bName: "Apple" },
  { brandID: 2, bName: "Samsung" },
  { brandID: 3, bName: "Nike" },
  { brandID: 4, bName: "Sony" },
  { brandID: 5, bName: "Adidas" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    productID: 1,
    name: "iPhone 15 Pro",
    description: "The latest iPhone with A17 Pro chip and titanium design.",
    basePrice: 999.00,
    brandID: 1,
    categoryID: 3,
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/seed/iphone15/800/800"
  },
  {
    productID: 2,
    name: "MacBook Air M2",
    description: "Supercharged by M2 chip, incredibly thin and fast.",
    basePrice: 1199.00,
    brandID: 1,
    categoryID: 2,
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/seed/macbook/800/800"
  },
  {
    productID: 3,
    name: "Galaxy S24 Ultra",
    description: "The ultimate AI-powered smartphone experience.",
    basePrice: 1299.00,
    brandID: 2,
    categoryID: 3,
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/seed/s24ultra/800/800"
  },
  {
    productID: 4,
    name: "Air Jordan 1 Low",
    description: "Classic style with premium materials.",
    basePrice: 110.00,
    brandID: 3,
    categoryID: 5,
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/seed/jordan1/800/800"
  },
  {
    productID: 5,
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones.",
    basePrice: 399.00,
    brandID: 4,
    categoryID: 1,
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/seed/sonyh/800/800"
  },
  {
    productID: 6,
    name: "Adidas Ultraboost Light",
    description: "The lightest Ultraboost ever made.",
    basePrice: 190.00,
    brandID: 5,
    categoryID: 5,
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/seed/ultraboost/800/800"
  }
];

export const MOCK_VARIANTS: ProductVariant[] = [
  { variantID: 1, productID: 1, sku: "IP15P-128-BL", size: "128GB", color: "Blue Titanium", price: 999.00 },
  { variantID: 2, productID: 1, sku: "IP15P-256-BL", size: "256GB", color: "Blue Titanium", price: 1099.00 },
  { variantID: 3, productID: 4, sku: "AJ1L-10-RED", size: "10", color: "Red/White", price: 110.00 },
  { variantID: 4, productID: 4, sku: "AJ1L-11-RED", size: "11", color: "Red/White", price: 110.00 },
];

export const MOCK_REVIEWS: Review[] = [
  {
    reviewID: 1,
    customerID: 1,
    productID: 1,
    reviewText: "Amazing phone! The camera is incredible.",
    rating: 5,
    createdAt: new Date().toISOString(),
    customerName: "John Doe"
  },
  {
    reviewID: 2,
    customerID: 2,
    productID: 1,
    reviewText: "A bit expensive but worth it for the performance.",
    rating: 4,
    createdAt: new Date().toISOString(),
    customerName: "Jane Smith"
  }
];

export const MOCK_USER: User = {
  userID: 1,
  name: "Mool Singh",
  email: "moolsinghmsimsi@gmail.com",
  phone: "1234567890",
  createdAt: new Date().toISOString(),
  role: "CUSTOMER"
};
