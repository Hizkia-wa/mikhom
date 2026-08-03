import { NextResponse } from 'next/server';
import { fetchProfiles } from '@/lib/mikrotik';

export async function GET() {
  const result = await fetchProfiles();
  return NextResponse.json(result);
}
