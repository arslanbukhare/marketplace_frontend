import React, { useState } from 'react';
import AuthModal from './AuthModal';
import { FaStore, FaTags } from 'react-icons/fa';

const countries = [
  {
    name: 'UAE',
    code: 'ae',
    flagUrl: 'https://flagcdn.com/w40/ae.png',
  },
  {
    name: 'Egypt',
    code: 'eg',
    flagUrl: 'https://flagcdn.com/w40/eg.png',
  },
];

// Selected 7 categories to highlight in nav
const highlightedCategories = [
  {
    name: 'Electronics',
    sub: ['Mobile Phones', 'Laptops', 'Cameras', 'Gaming', 'TVs'],
  },
  {
    name: 'Vehicles',
    sub: ['Cars', 'Motorcycles', 'Trucks', 'Parts', 'Bicycles'],
  },
  {
    name: 'Real Estate',
    sub: ['Apartments', 'Villas', 'Plots', 'Commercial'],
  },
  {
    name: 'Jobs',
    sub: ['Full-time', 'Part-time', 'Freelance', 'Internships'],
  },
  {
    name: 'Fashion',
    sub: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
  },
  {
    name: 'Home & Garden',
    sub: ['Furniture', 'Kitchen', 'Decor', 'Garden'],
  },
  {
    name: 'Pets',
    sub: ['Dogs', 'Cats', 'Birds', 'Fish', 'Pet Supplies'],
  },
];

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  return (
    <>
      {/* Sticky Header */}
      <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
        <div className="container mx-auto px-4 w-full flex justify-between items-center py-4">
          {/* Logo and Country Selector */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">AdMarket</span>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-sm border-base-300 flex items-center gap-2">
                <img
                  src={selectedCountry.flagUrl}
                  alt={`${selectedCountry.name} flag`}
                  className="w-5 h-4 object-cover rounded-sm"
                />
                <span>{selectedCountry.name}</span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
              >
                {countries.map((country) => (
                  <li key={country.code}>
                    <a
                      onClick={() => setSelectedCountry(country)}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={country.flagUrl}
                        alt={`${country.name} flag`}
                        className="w-5 h-4 object-cover rounded-sm"
                      />
                      <span>{country.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation Center */}
          <div className="hidden md:flex gap-4">
            <button className="btn text-base flex items-center gap-2">
              <FaStore /> Marketplace
            </button>
            <button className="btn btn-ghost text-base flex items-center gap-2">
              <FaTags /> Discounts
            </button>
          </div>

          {/* Login and Post Ad */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="link link-hover text-base"
            >
              Login / Sign Up
            </button>
            <button className="btn btn-primary btn-sm text-base">Post Your Ad</button>
          </div>
        </div>
      </header>

      {/* Navigation Below Header */}
      <nav className="bg-base-100 border-b border-base-300 shadow">
        <div className="container mx-auto px-4">
          <ul className="flex justify-between py-3">
            {highlightedCategories.map((cat) => (
              <li key={cat.name} className="dropdown dropdown-hover flex-1 text-center">
                <div
                  tabIndex={0}
                  className="btn btn-sm btn-ghost normal-case text-base w-full justify-center"
                >
                  {cat.name}
                </div>
                <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56">
                  {cat.sub.map((subcat) => (
                    <li key={subcat}>
                      <a className="text-sm">{subcat}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </nav>


      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
