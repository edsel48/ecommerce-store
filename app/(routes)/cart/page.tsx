'use client';

import { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import useCart from '@/hooks/use-cart';

import Summary from './components/summary';

import toast from 'react-hot-toast';

import axios from 'axios';

import CartItem from './components/cart-item';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState({});

  const cart = useCart();

  const { items, addItem, removeItem, addQuantity, removeQuantity, removeAll } =
    cart;

  const params = useSearchParams();
  const router = useRouter();

  const updatePayment = async () => {
    if (
      params.get('transaction_status') &&
      params.get('transaction_status') != 'pending'
    ) {
      // update payment here to paid
      try {
        await axios.patch('/api/pay', {
          transactionId: params.get('order_id'),
        });
      } catch (e) {
        toast.error('Update Failed, Please Contact Admin');
      }

      cart.removeAll();
      router.replace('/cart', undefined);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const payment = async () => {
      await updatePayment();
    };

    const fetchUser = async () => {
      let response = await axios.get('/api/user');

      let user = response.data;

      setUser(user);
    };

    const addTraffic = async () => {
      try {
        let response = await axios.get('/api/traffic');

        let traffic = response.data;
      } catch (e) {
        toast.error('SOMETHING WENT WRONG');
      }
    };

    addTraffic();

    fetchUser();

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
          {/* @ts-ignore */}
          <div>{user.tier} MEMBER</div>
          <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              {items.length === 0 && (
                <p className="text-neutral-500">No items added to cart.</p>
              )}
              <ul>
                {items.map((item) => (
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
