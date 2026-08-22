import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'gd_footwear_secret_key_123456789!';

export async function GET(request: Request) {
  const token = request.headers.get('cookie')
    ?.split('; ')
    ?.find(row => row.startsWith('gd_admin_token='))
    ?.split('=')[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.json({ authenticated: true });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
