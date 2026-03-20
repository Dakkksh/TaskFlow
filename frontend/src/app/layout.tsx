import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow — Task Management',
  description: 'Manage your tasks efficiently with TaskFlow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a26',
                color: '#e8e8f0',
                border: '1px solid #2a2a3e',
                fontFamily: 'Syne, sans-serif',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#22d3a0', secondary: '#1a1a26' } },
              error: { iconTheme: { primary: '#ff5c5c', secondary: '#1a1a26' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
