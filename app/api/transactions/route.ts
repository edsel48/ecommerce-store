import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    let { userId } = auth();

    //   @ts-ignore
    let user = await clerkClient.users.getUser(userId);
    let email = user.emailAddresses[0].emailAddress;

    let response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/members`,
    );

    let members = response.data;
    let selected = null;

    //   @ts-ignore
    members.forEach((e) => {
      if (e.email == email) {
        selected = e;
      }
    });
    if (selected == null) {
      return new NextResponse('No Member Found', { status: 404 });
    }

    //   @ts-ignore
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders/myorder/${selected.id}`;

    response = await axios.get(URL);

    let { data } = response;

    return NextResponse.json(data);
  } catch (e) {
    console.error('ERROR TRANSACTION', e);
    return new NextResponse('Failed to fetch transactions', { status: 500 });
  }
}
