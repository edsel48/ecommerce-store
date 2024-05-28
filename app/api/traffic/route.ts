import { auth } from '@clerk/nextjs';
import axios from 'axios';
import { NextResponse } from 'next/server';

const URL = `${process.env.NEXT_PUBLIC_API_URL_BASE}/reports/traffic`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    let ip = req.headers.get('X-Forwarded-For');

    if (ip == null) {
      return new NextResponse('Error ip not found', { status: 404 });
    }

    let response = await axios.post(URL, {
      ip,
    });

    let traffic = response.data;

    return NextResponse.json(traffic);
  } catch (e) {
    console.log(e);
    return new NextResponse('Something Went Wrong', { status: 500 });
  }
}
