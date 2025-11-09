import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      backgroundColor: '#f9fafb'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#16a34a' }}>
        PaieFacile
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', color: '#6b7280' }}>
        La paie de vos salariés, enfin simple et 100% conforme à la loi marocaine
      </p>
      <Link 
        href="/fr"
        style={{
          padding: '12px 24px',
          backgroundColor: '#16a34a',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Accéder à PaieFacile
        </Link>
    </div>
  );
}
