import { Archivo } from 'next/font/google';
import '../styles/colors.css';
import { Toaster } from 'sonner';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-archivo',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body
        style={{
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          fontFamily:
            'var(--font-archivo), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
