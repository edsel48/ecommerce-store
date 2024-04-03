'use client';

import { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import useCart from '@/hooks/use-cart';

import Summary from './components/summary';

import toast from 'react-hot-toast';

import axios from 'axios';

import CartItem from './components/cart-item';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  const params = useSearchParams();
  const router = useRouter();

  const updatePayment = async () => {
    if (
      params.get('transaction_status') &&
      params.get('transaction_status') != 'pending'
    ) {
      cart.removeAll();
      router.replace('/cart', undefined);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const payment = async () => {
      await updatePayment();
    };

    payment();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">No items added to cart.</p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <CartItem key={item.product.id} data={item} />
                ))}
              </ul>
            </div>
            <Summary />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
