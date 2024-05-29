'use client';

import getBillboard from '@/actions/get-billboard';
import getProducts from '@/actions/get-products';
import Billboard from '@/components/ui/billboard';
import ProductList from '@/components/product-list';
import Container from '@/components/ui/container';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// eslint-disable-next-line @next/next/no-async-client-component
const HomePage = async () => {
  const billboards = await getBillboard(`bd13d0d2-7072-410c-9557-bd48fe300dc3`);
  const products = await getProducts({ isFeatured: true });

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboards} />

        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
