import type { Metadata } from 'next';
import '../public/styles/globals.css';

export const metadata: Metadata = {
  title: 'K1Ms place',
  description: 'AI-based parental advisor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
