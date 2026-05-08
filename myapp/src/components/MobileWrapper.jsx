// MobileWrapper.jsx
// Wrap this around your sidebar + main content in Home.jsx
// Usage: import MobileWrapper from './MobileWrapper';

import React, { useState, useEffect } from 'react';

function MobileWrapper({ sidebar, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside (overlay)
  const handleOverlayClick = () => setSidebarOpen(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5', position: 'relative' }}>
      
      {/* ===== HAMBURGER BUTTON (mobile only) ===== */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '12px',
            left: sidebarOpen ? '268px' : '12px',
            zIndex: 10001,
            background: '#1a3a52',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'left 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* ===== OVERLAY (mobile only, when sidebar open) ===== */}
      {isMobile && sidebarOpen && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
          transform: isMobile
            ? sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
            : 'translateX(0)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}
      >
        {sidebar}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? '0' : '0',
          width: isMobile ? '100%' : 'calc(100% - 280px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: isMobile ? '0' : '0',
        }}
      >
        {/* Top padding on mobile so content isn't behind hamburger */}
        {isMobile && <div style={{ height: '56px' }} />}
        {children}
      </div>
    </div>
  );
}

export default MobileWrapper;