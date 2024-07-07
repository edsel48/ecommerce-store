'use client';

import Button from '@/components/ui/button';

import { Banknote, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCart from '@/hooks/use-cart';
import { UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import axios from 'axios';

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    const fetch = async () => {
      try {
        let response = await axios.get(`/api/transactions`);
        let { data } = response;

        setTransactions(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetch();
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button
        onClick={() => router.push('/cart')}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>
      <Button
        onClick={() => router.push('/transactions')}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <Banknote size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {transactions.length}
        </span>
      </Button>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default NavbarActions;
