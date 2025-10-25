"use client"
import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    // Redirect to external URL
    window.location.href = "http://localhost:18080";
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Redirecting to localhost:18080...
    </div>
  );
}