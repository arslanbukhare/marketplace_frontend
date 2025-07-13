import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import Hero from '../../components/marketplace/Hero';
import CategoriesList from '../../components/marketplace/CategoriesList';
import CTA from '../../components/marketplace/CTA';
import Footer from '../../components/marketplace/Footer';
import AdCard from '../../components/marketplace/AdCard';
import api from '../../api/axios';

// ✅ Reusable Section Component
const AdSection = ({ title, ads }) => (
  <section className="my-12">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ads.length === 0 ? (
          <p className="text-gray-500">No ads available.</p>
        ) : (
          ads.map((ad) => <AdCard key={ad.id} ad={ad} />)
        )}
      </div>
    </div>
  </section>
);

const MarketplaceHome = () => {
  const [featuredAds, setFeaturedAds] = useState([]);
  const [carsAds, setCarsAds] = useState([]);

  useEffect(() => {
    const fetchFeaturedAds = async () => {
      try {
        const res = await api.get('/ads/featured');
        setFeaturedAds(res.data);
      } catch (err) {
        console.error('❌ Error fetching featured ads:', err);
      }
    };

    const fetchCarsAds = async () => {
      try {
        const res = await api.get('/ads/subcategory/7');
        setCarsAds(res.data);
      } catch (err) {
        console.error('❌ Error fetching cars ads:', err);
      }
    };

    fetchFeaturedAds();
    fetchCarsAds();
  }, []);

  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <CategoriesList />

        {/* ✅ Featured Ads Section */}
        <AdSection title="Featured" ads={featuredAds} />

        {/* ✅ Cars for Sale Section */}
        <AdSection title="Cars for Sale" ads={carsAds} />

        {/* ✅ Call to Action */}
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default MarketplaceHome;
