'use client'
import { Header } from '@/components/Header';

// `bare` lets a page bring its own header, background and width instead of the shared chrome.
export const AppLayout = ({ children, bare = false }: { children: React.ReactNode; bare?: boolean }) => {
  return (
    <div className={`relative ${bare ? 'bg-[#0B1020]' : 'bg-[#0a192f]'}`}>
      {!bare && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
      )}

      <div className="min-h-screen relative z-10">
        {bare ? children : (
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        )}
      </div>

      {/* Background lines effect */}
      {!bare && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '100% 4px'
          }}
        />
      )}
    </div>
  );
};

export default AppLayout;
