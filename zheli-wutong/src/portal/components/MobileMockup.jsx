import React from 'react';

export default function MobileMockup({ children }) {
  return (
    <div style={{
      width: '375px', height: '812px', margin: '0 auto',
      border: '14px solid #1a1a1a', borderRadius: '40px',
      background: '#fff', position: 'relative', overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      transform: 'scale(0.9)', transformOrigin: 'top center'
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '150px', height: '30px', background: '#1a1a1a',
        borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 50
      }} />
      <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}