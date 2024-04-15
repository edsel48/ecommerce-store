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
  price: string;
  priceSilver: string;
  priceGold: string;
  pricePlatinum: string;
  isFeatured: boolean;
  sizes: SizeOnProduct[];
  images: Image[];
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
}

export interface Size {
  id: string;
  name: string;
  value: string;
}
