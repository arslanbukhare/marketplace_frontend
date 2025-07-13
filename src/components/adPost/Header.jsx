import React, { useState } from 'react';
import AuthModal from '../shared/AuthModal';


export default function Header() {
  return (
    <>
      <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
        <div className="container mx-auto px-4 w-full flex justify-center items-center py-4">
          {/* Navigation Center */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">AdMarket</span>
          </div>
        </div>
      </header>
    </>
  );
}
