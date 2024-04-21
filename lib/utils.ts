import { SizeOnProduct } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
});

export const sortPrices = (data: SizeOnProduct[]) => {
  return data.sort((a, b) => {
    return a.price - b.price;
  });
};
