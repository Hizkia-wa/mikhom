import { NextResponse } from 'next/server';
import { fetchUsers, addHotspotUser, deleteHotspotUser } from '@/lib/mikrotik';

export async function GET() {
  const result = await fetchUsers();
  return NextResponse.json(result);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await addHotspotUser(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    const result = await deleteHotspotUser(id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
