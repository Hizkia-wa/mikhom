import { NextResponse } from 'next/server';
import { fetchSystemResource } from '@/lib/mikrotik';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('host');
  const result = await fetchSystemResource({ host });
  return NextResponse.json(result);
}
