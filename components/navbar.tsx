'use client';

import Link from 'next/link';
import Container from '@/components/ui/container';
import MainNav from '@/components/main-nav';
import getCategories from '@/actions/get-categories';
import NavbarActions from './navbar-actions';

import { useEffect, useState } from 'react';

export const revalidate = 0;

const Navbar = async () => {
  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   const get = async () => {
  //     let cat = await getCategories();
  //     setCategories(cat);
  //   };

  //   get();
  // }, []);

  let categories = await getCategories();
  return (
    <div className="border-b">
      <Container>
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
            <p className="text-xl font-bold">Mitra Solusi Store</p>
          </Link>
          <MainNav data={categories} />
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
