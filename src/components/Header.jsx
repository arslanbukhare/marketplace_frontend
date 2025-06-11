import React, { useState } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <header className="navbar bg-base-100 shadow">
        <div className="container mx-auto px-4 flex justify-between items-center w-full">
          {/* Brand */}
          <div className="text-xl font-bold text-primary">
            AdMarket
          </div>

          {/* Navigation */}
          <nav className="space-x-2">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="btn btn-primary"
            >
              Login / Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
