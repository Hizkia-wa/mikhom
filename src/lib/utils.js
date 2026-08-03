export function formatBytes(bytes, decimals = 2) {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatBits(bits, decimals = 2) {
  if (!bits || isNaN(bits) || bits === 0) return '0 bps';
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps'];
  const i = Math.floor(Math.log(bits) / Math.log(k));
  return parseFloat((bits / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatCurrency(amount, symbol = 'Rp') {
  const num = Number(amount) || 0;
  return `${symbol} ${num.toLocaleString('id-ID')}`;
}

export function generateVoucherCode(prefix = '', length = 6, type = 'mix') {
  let chars = '';
  if (type === 'num') chars = '0123456789';
  else if (type === 'alpha') chars = 'abcdefghijklmnopqrstuvwxyz';
  else chars = '23456789abcdefghjkmnpqrstuvwxyz'; // avoids confusing chars like 0, O, 1, l

  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
