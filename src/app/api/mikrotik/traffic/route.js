import { NextResponse } from 'next/server';
import { fetchTraffic } from '@/lib/mikrotik';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const interfaceName = searchParams.get('interface') || 'ether1-WAN';
  const result = await fetchTraffic(interfaceName);
  return NextResponse.json(result);
}
