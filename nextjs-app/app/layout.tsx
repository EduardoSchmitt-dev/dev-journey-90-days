import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Dev Journey',
  description: '90 days journey to become a fullstack developer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="p-4 bg-white shadow flex items-center justify-between">
          <nav className="flex gap-4">
           <Link href="/" className="font-semibold">
             Home
           </Link>
           <Link href="/about" className="font-semibold">
             About
           </Link>
          </nav>

          <h1 className="text-lg font-semibold">
            Dev Journey — Week 2
          </h1>
        </header>

        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
