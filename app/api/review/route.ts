import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import axios from 'axios';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/rating`;

export async function POST(req: Request) {
  let body = await req.json();

  let { orderId, review, starRating } = body;

  let response = await axios.post(URL, {
    orderId,
    review,
    starRating,
  });

  let { data } = response;

  return NextResponse.json(data);
}
