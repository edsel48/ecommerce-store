import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs';
import axios from 'axios';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/members`;

export async function GET(req: Request) {
  let { userId } = auth();

  if (userId == null) {
    return new NextResponse('User not found', { status: 404 });
  }

  let user = await clerkClient.users.getUser(userId);

  let email = user.emailAddresses[0].emailAddress;

  let response = await axios.get(URL);

  let members = response.data;
  let selected = null;

  //   @ts-ignore
  members.forEach((e) => {
    if (e.email == email) {
      selected = e;
    }
  });

  if (selected == null) {
    // create member sequence
    let createMemberResponse = await axios.post(URL, {
      name: user.firstName,
      limit: 0,
      email: email,
      username: email,
      password: '-',
      userId: userId,
    });

    return NextResponse.json(createMemberResponse);
  }

  return NextResponse.json(selected);
}
