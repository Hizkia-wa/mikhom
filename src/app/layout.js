import './globals.css';
import AppLayoutClient from './AppLayoutClient';

export const metadata = {
  title: 'Mikhmon Next.js - MikroTik Hotspot Monitor',
  description: 'A modern, high-performance, mobile-responsive Next.js application for monitoring and managing MikroTik Hotspot users and vouchers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased font-sans min-h-screen">
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}
