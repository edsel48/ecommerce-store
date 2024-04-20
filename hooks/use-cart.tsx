import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product, SizeOnProduct } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface CartItem {
  product: Product;
  productSize: SizeOnProduct;
  size: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Product, size: SizeOnProduct) => void;
  removeItem: (id: string) => void;
  addQuantity: (id: string) => void;
  removeQuantity: (id: string) => void;
  changeSize: (id: string, size: SizeOnProduct) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product, size: SizeOnProduct) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) =>
            item.product.id === data.id && item.productSize.id === size.id,
        );

        if (existingItem) {
          set({
            items: [
              ...get().items.map((item) => {
                return {
                  product: item.product,
                  quantity:
                    item.quantity +
                    (item.product.id === existingItem.product.id &&
                    item.productSize.id === size.id
                      ? 1
                      : 0),
                  size: +size.size.value,
                  productSize: size,
                };
              }),
            ],
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                product: data,
                quantity: 1,
                size: +size.size.value,
                productSize: size,
              },
            ],
          });
        }

        toast.success('Item added to cart.');
      },
      changeSize: (id: string, size: SizeOnProduct) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) => item.product.id === id,
        );

        if (!existingItem) {
          return toast('Item not found');
        }

        set({
          items: [
            ...get().items.map((item) => {
              if (item.product.id === existingItem.product.id) {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  size: +size.size.value,
                  productSize: size,
                };
              } else {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  size: item.size,
                  productSize: item.productSize,
                };
              }
            }),
          ],
        });
      },
      addQuantity: (id: string) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) => item.product.id === id,
        );

        if (!existingItem) {
          return toast('Item not found');
        }

        set({
          items: [
            ...get().items.map((item) => {
              if (item.product.id === existingItem.product.id) {
                return {
                  product: item.product,
                  quantity: (item.quantity += 1),
                  size: item.size,
                  productSize: item.productSize,
                };
              } else {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  size: item.size,
                  productSize: item.productSize,
                };
              }
            }),
          ],
        });
      },
      removeQuantity: (id: string) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) => item.product.id === id,
        );

        if (!existingItem) {
          return toast('Item not found');
        }

        if (existingItem.quantity == 1) {
          set({
            items: [...get().items.filter((item) => item.product.id !== id)],
          });
          toast.success('Item removed from cart.');
        }

        set({
          items: [
            ...get().items.map((item) => {
              if (item.product.id === existingItem.product.id) {
                return {
                  product: item.product,
                  quantity: (item.quantity -= 1),
                  size: item.size,
                  productSize: item.productSize,
                };
              } else {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  size: item.size,
                  productSize: item.productSize,
                };
              }
            }),
          ],
        });
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter((item) => item.product.id !== id)],
        });
        toast.success('Item removed from cart.');
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
