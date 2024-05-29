import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import axios from 'axios';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export async function GET(req: Request) {
  let body = await req.json();

  let { isFeatured } = body;

  let productResponse = await axios.get(`${URL}`);

  let products = productResponse.data;

  let filtered = products;
  if (isFeatured) {
    filtered = [];

    // @ts-ignore
    products.forEach((e) => {
      if (e.isFeatured) {
        filtered.push(e);
      }
    });
  }

  return NextResponse.json(filtered);
}
