import React from 'react';

export default function MacbookMockup({ children }) {
  return (
    <div style={{
      width: '100%', maxWidth: '1200px', margin: '0 auto',
      background: '#e0e0e0', padding: '12px 12px 0 12px',
      borderRadius: '16px 16px 0 0', border: '2px solid #ccc',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', height: '800px'
    }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
      </div>
      <div style={{
        flex: 1, background: '#fff', borderRadius: '8px 8px 0 0',
        overflow: 'hidden', position: 'relative'
      }}>
        {children}
      </div>
    </div>
  );
}