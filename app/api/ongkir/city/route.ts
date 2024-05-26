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

export async function GET(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_RAJAONGKIR_API_KEY || '';
  let provinceResponse = await axios.get(
    'https://api.rajaongkir.com/starter/city',
    {
      headers: {
        key: apiKey,
      },
    },
  );

  return NextResponse.json(provinceResponse.data);
}
