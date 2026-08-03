import { NextResponse } from 'next/server';
import { fetchActiveUsers, kickActiveUser } from '@/lib/mikrotik';

export async function GET() {
  const result = await fetchActiveUsers();
  return NextResponse.json(result);
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Active user ID is required' }, { status: 400 });
    const result = await kickActiveUser(id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
