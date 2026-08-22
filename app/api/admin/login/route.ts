import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'gd_footwear_secret_key_123456789!';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Create a JWT token that expires in 7 days
      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(new TextEncoder().encode(JWT_SECRET));

      const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
      
      // Set the token in an HTTP-only cookie
      response.cookies.set({
        name: 'gd_admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid admin password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
