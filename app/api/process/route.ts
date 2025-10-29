import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Camera/voice verification is disabled.' },
    { status: 410 }
  );
}