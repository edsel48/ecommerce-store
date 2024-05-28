import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import axios from 'axios';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export async function POST(req: Request) {
  let body = await req.json();

  let { productId, type } = body;

  let productResponse = await axios.get(`${URL}/${productId}`);

  let product = productResponse.data;

  let { sizes } = product;

  //   @ts-ignore
  let sorted = sizes.sort((a, b) => {
    return b.price - a.price;
  });

  let highest = sorted[0].price;
  let lowest = sorted[sorted.length - 1].price;

  if (product.promo != null) {
    highest = highest * (1 - product.promo.discount * 0.01);
    lowest = lowest * (1 - product.promo.discount * 0.01);
  }

  return NextResponse.json({
    highest,
    lowest,
  });
}
