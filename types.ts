export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  isFeatured: boolean;
  description: string;
  sizes: SizeOnProduct[];
  images: Image[];
  promo?: Promo;
}

export interface Promo {
  id: string;
  name: string;
  discount: number;
}

export interface Image {
  id: string;
  url: string;
}

export interface SizeOnProduct {
  id: string;
  productId: string;
  sizeId: string;
  size: Size;
  product: Product;
  price: number;
  priceSilver: number;
  priceGold: number;
  pricePlatinum: number;
  stock: number;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}
