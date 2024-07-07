'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@/components/ui/container';
import Button from '@/components/ui/button';

import Tabs from '@/components/ui/tabs';

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
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

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="mb-3 text-lg font-bold">My Transactions</h1>
          <Tabs></Tabs>
        </div>
      </Container>
    </div>
  );
};

export default TransactionPage;
