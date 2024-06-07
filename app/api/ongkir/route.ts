import { NextResponse } from 'next/server';
import axios from 'axios';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_RAJAONGKIR_API_KEY || '';

  let body = await req.json();
  let { destination, weight } = body;

  let response = await axios.post(
    'https://api.rajaongkir.com/starter/cost',
    `origin=114&destination=${destination}&weight=${weight}&courier=jne`,
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        key: apiKey,
      },
    },
  );

  return NextResponse.json(response.data);
}
