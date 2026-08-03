import { NextResponse } from 'next/server';
import { addHotspotUser } from '@/lib/mikrotik';
import { generateVoucherCode } from '@/lib/utils';

export async function POST(request) {
  try {
    const body = await request.json();
    const { qty = 5, prefix = '', length = 6, type = 'mix', profile = 'default', limitUptime = '', limitBytes = '', commentPrefix = 'gen' } = body;

    const createdVouchers = [];
    const batchComment = `${commentPrefix}-${Date.now().toString().slice(-6)}`;

    for (let i = 0; i < Number(qty); i++) {
      const voucherCode = generateVoucherCode(prefix, Number(length), type);
      const userData = {
        name: voucherCode,
        password: voucherCode,
        profile,
        limitUptime,
        limitBytesTotal: limitBytes,
        comment: batchComment
      };

      const res = await addHotspotUser(userData);
      if (res.success) {
        createdVouchers.push({
          code: voucherCode,
          password: voucherCode,
          profile,
          limitUptime,
          limitBytes,
          comment: batchComment
        });
      }
    }

    return NextResponse.json({
      success: true,
      batchComment,
      count: createdVouchers.length,
      vouchers: createdVouchers
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
