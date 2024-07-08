import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    let body = await req.json();

    let { transactionId } = body;

    const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders/${transactionId}/finished`;

    let response = await axios.post(URL);

    let { data } = response;

    return NextResponse.json(data);
  } catch (e) {
    return new NextResponse('Update Failed, Please Contact Admin', {
      status: 500,
    });
  }
}
