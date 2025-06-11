import React, { useState } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <div className="text-xl font-bold">AdMarket</div>

        <nav className="space-x-4">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="text-white font-medium"
          >
            Login / Sign Up
          </button>
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
