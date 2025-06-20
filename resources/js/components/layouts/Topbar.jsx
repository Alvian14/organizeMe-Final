import React from 'react';

export default function Topbar() {
  return (
    <div 
      className="d-flex justify-content-start align-items-center px-4 py-3 bg-white shadow rounded"
      style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
    >
      <div className="d-flex align-items-center flex-shrink-0">
        <h1 
          className="mb-0 fw-bold" 
          style={{ 
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
            fontSize: '1.7rem',
            color: '#0E2148', 
            userSelect: 'none',
          }}
        >
          <span style={{ color: '#0E2148' }}>Or</span>ganize
          <span style={{ color: '#4ECDC4' }}>Me</span>
        </h1>
      </div>
    </div>
  );
}