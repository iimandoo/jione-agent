import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav style={{ backgroundColor: 'white', padding: '1rem 1.5rem', borderBottom: '1px solid #e5e8eb' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Dashboard</h1>
      </nav>
      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}
