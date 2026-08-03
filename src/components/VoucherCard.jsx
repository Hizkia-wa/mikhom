import { Wifi, QrCode } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function VoucherCard({ code, password, profile, price = '5000', dnsName = 'hotspot.net' }) {
  return (
    <div className="w-64 bg-slate-900 border-2 border-dashed border-slate-700 rounded-xl p-4 shadow-lg text-white font-mono relative overflow-hidden flex flex-col justify-between print:border-black print:bg-white print:text-black print:shadow-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-gray-300">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-cyan-400 print:text-black" />
          <span className="font-bold text-xs tracking-wider text-cyan-400 print:text-black">MIKHMON HOTSPOT</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 print:border-gray-400 print:bg-gray-100 print:text-black">
          {profile}
        </span>
      </div>

      {/* Code & Login Details */}
      <div className="my-3 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest print:text-gray-600">Kode Voucher / Login</p>
        <div className="my-1.5 p-2 bg-slate-950 rounded-lg border border-slate-800 print:bg-gray-100 print:border-gray-300">
          <span className="text-xl font-black tracking-widest text-cyan-300 print:text-black">{code}</span>
        </div>
        {password && password !== code && (
          <p className="text-xs text-slate-400 print:text-gray-700">Password: <span className="font-bold text-white print:text-black">{password}</span></p>
        )}
      </div>

      {/* Bottom Info */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] print:border-gray-300">
        <div>
          <p className="text-slate-400 print:text-gray-600">URL: http://{dnsName}</p>
        </div>
        <div className="text-right">
          <span className="font-extrabold text-sm text-emerald-400 print:text-black">
            {formatCurrency(price)}
          </span>
        </div>
      </div>
    </div>
  );
}
