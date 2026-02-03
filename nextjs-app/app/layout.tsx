import './globals.css';

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
        <header className="p-4 bg-white shadow">
          <h1 className="text-1g font-semibold">
            Dev Journey 🚀
          </h1>
        </header>

        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
