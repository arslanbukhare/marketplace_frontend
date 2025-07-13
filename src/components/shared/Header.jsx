import React, { useState } from 'react';
import AuthModal from '../shared/AuthModal';
import { FaStore, FaTags, FaBell, FaCommentDots, FaUserCircle,
  FaEnvelope,
  FaHeart,
  FaCog,
  FaBriefcase,
  FaFileAlt,
  FaBullhorn,
  FaUsers,
  FaBuilding,
  FaMoneyCheckAlt,
  FaSignOutAlt,
  FaBoxOpen, } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const countries = [
  { name: 'UAE', code: 'ae', flagUrl: 'https://flagcdn.com/w40/ae.png' },
  { name: 'Egypt', code: 'eg', flagUrl: 'https://flagcdn.com/w40/eg.png' },
];

const highlightedCategories = [
  { name: 'Electronics', sub: ['Mobile Phones', 'Laptops', 'Cameras', 'Gaming', 'TVs'] },
  { name: 'Vehicles', sub: ['Cars', 'Motorcycles', 'Trucks', 'Parts', 'Bicycles'] },
  { name: 'Real Estate', sub: ['Apartments', 'Villas', 'Plots', 'Commercial'] },
  { name: 'Jobs', sub: ['Full-time', 'Part-time', 'Freelance', 'Internships'] },
  { name: 'Fashion', sub: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'] },
  { name: 'Home & Garden', sub: ['Furniture', 'Kitchen', 'Decor', 'Garden'] },
  { name: 'Pets', sub: ['Dogs', 'Cats', 'Birds', 'Fish', 'Pet Supplies'] },
];

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isMarketplace = location.pathname === '/';
  const isDiscounts = location.pathname === '/discounts';

  return (
    <>
      <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50">
        <div className="container mx-auto px-4 w-full flex justify-between items-center py-4">
          {/* Logo and Country Selector */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">AdMarket</span>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-sm border-base-300 flex items-center gap-2">
                <img src={selectedCountry.flagUrl} alt={`${selectedCountry.name} flag`} className="w-5 h-4 object-cover rounded-sm" />
                <span>{selectedCountry.name}</span>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                {countries.map((country) => (
                  <li key={country.code}>
                    <a onClick={() => setSelectedCountry(country)} className="flex items-center gap-2">
                      <img src={country.flagUrl} alt={`${country.name} flag`} className="w-5 h-4 object-cover rounded-sm" />
                      <span>{country.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Navigation Center */}
          <div className="hidden md:flex gap-4">
            <Link to="/" className={`text-base flex items-center gap-2 ${isMarketplace ? 'btn' : 'btn-ghost'}`}>
              <FaStore /> Marketplace
            </Link>
            <Link to="/discounts" className={`text-base flex items-center gap-2 ${isDiscounts ? 'btn' : 'btn-ghost'}`}>
              <FaTags /> Discounts
            </Link>
          </div>

          {/* Login and User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button className="btn btn-ghost btn-circle text-xl">
                  <FaBell />
                </button>
                <button className="btn btn-ghost btn-circle text-xl">
                  <FaCommentDots />
                </button>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-sm btn-ghost flex items-center gap-2">
                    <FaUserCircle className="text-2xl" />
                    <span>{user.name}</span>
                  </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-72 p-3 space-y-1 text-[16px]">
                        {/* Profile Info */}
                        <li className="px-2 py-3 border-b border-base-300">
                            <div className="flex items-center gap-3">
                            <FaUserCircle className="text-4xl text-primary" />
                            <div>
                                <p className="font-semibold text-base">
                                    {user.role === 'company'
                                        ? user.profile?.company_name
                                        : user.profile?.first_name}
                                    </p>
                                <Link to="/profile" className="text-sm text-primary hover:underline">View Profile</Link>
                            </div>
                            </div>
                        </li>

                        {/* Common Items */}
                        <li>
                            <Link to="/my-ads" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                            <FaBoxOpen /> My Ads
                            </Link>
                        </li>
                        <li>
                            <Link to="/messages" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                            <FaEnvelope /> Messages
                            </Link>
                        </li>
                        <li>
                            <Link to="/saved-ads" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                            <FaHeart /> Saved Ads
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                            <FaCog /> Account Settings
                            </Link>
                        </li>

                        {/* Role: Individual */}
                        {user?.role === 'individual' && (
                            <>
                            <li>
                                <Link to="/jobs" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaBriefcase /> Apply for Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/applications" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaFileAlt /> My Applications
                                </Link>
                            </li>
                            </>
                        )}

                        {/* Role: Company */}
                        {user?.role === 'company' && (
                            <>
                            <li>
                                <Link to="/post-ad" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaBullhorn /> Post New Ad
                                </Link>
                            </li>
                            {/* <li>
                                <Link to="/manage-ads" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaBoxOpen /> Manage Ads
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link to="/post-job" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaBriefcase /> Post Job Offer
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link to="/applicants" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaUsers /> Manage Applications
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link to="/company-profile" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaBuilding /> Company Profile
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link to="/billing" className="py-2 px-2 flex items-center gap-2 hover:bg-base-200 rounded">
                                <FaMoneyCheckAlt /> Billing / Invoices
                                </Link>
                            </li> */}
                            </>
                        )}

                        {/* Logout */}
                        <li>
                            <button onClick={logout} className="py-2 px-2 flex items-center gap-2 hover:bg-red-100 text-red-500 font-medium rounded">
                            <FaSignOutAlt /> Logout
                            </button>
                        </li>
                        </ul>



                </div>

                {/* ❌ Hide "Post Your Ad" on /discounts */}
                {!isDiscounts && (
                  <Link to="/post-ad" className="btn btn-primary btn-sm text-base">
                            + Post New Ad
                                </Link>
                )}
              </>
            ) : (
              <>
                <button onClick={() => setIsAuthOpen(true)} className="link link-hover text-base">
                  Login / Sign Up
                </button>
                {!isDiscounts && (
                  <button className="btn btn-primary btn-sm text-base">Post Your Ad</button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* ❌ Hide Category Nav on /discounts */}
      {!isDiscounts && (
        <nav className="bg-base-100 border-b border-base-300 shadow">
          <div className="container mx-auto px-4">
            <ul className="flex justify-between py-3">
              {highlightedCategories.map((cat) => (
                <li key={cat.name} className="dropdown dropdown-hover flex-1 text-center">
                  <div tabIndex={0} className="btn btn-sm btn-ghost normal-case text-base w-full justify-center">
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
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
