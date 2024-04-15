import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  addQuantity: (id: string) => void;
  removeQuantity: (id: string) => void;
  changeSize: (id: string, value: number) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;

        const existingItem = currentItems.find(
          (item) => item.product.id === data.id,
        );

        if (existingItem) {
          set({
            items: [
              ...get().items.map((item) => {
                return {
                  product: item.product,
                  quantity:
                    item.quantity +
                    (item.product.id === existingItem.product.id ? 1 : 0),
                  size: item.size,
                };
              }),
            ],
          });
        } else {
          set({
            items: [...get().items, { product: data, quantity: 1, size: 1 }],
          });
        }

        toast.success('Item added to cart.');
      },
      changeSize: (id: string, value: number) => {
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
                  size: value,
                };
              } else {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  size: item.size,
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
                };
              } else {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  size: item.size,
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
                };
              } else {
                return {
                  product: item.product,
                  quantity: item.quantity,
                  size: item.size,
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
