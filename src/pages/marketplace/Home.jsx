import Header from '../../components/shared/Header';
import Hero from '../../components/marketplace/Hero';
import CategoriesList from '../../components/marketplace/CategoriesList';
import CTA from '../../components/marketplace/CTA';
import Footer from '../../components/marketplace/Footer';
import AdCard from '../../components/marketplace/AdCard';
import React from 'react';

// Dummy ad data
const dummyAds = {
  mobiles: [
    {
      id: 1,
      title: "iPhone 14 Pro",
      price: 999,
      location: "Dubai",
      date: "June 12",
      image: "https://picsum.photos/seed/mobile1/300/200",
    },
    {
      id: 2,
      title: "Samsung S23 Ultra",
      price: 850,
      location: "Abu Dhabi",
      date: "June 10",
      image: "https://picsum.photos/seed/mobile2/300/200",
    },
    {
      id: 3,
      title: "OnePlus 12",
      price: 700,
      location: "Sharjah",
      date: "June 9",
      image: "https://picsum.photos/seed/mobile3/300/200",
    },
    {
      id: 4,
      title: "Google Pixel 8",
      price: 799,
      location: "Ajman",
      date: "June 8",
      image: "https://picsum.photos/seed/mobile4/300/200",
    },
  ],
  cars: [
    {
      id: 5,
      title: "Toyota Corolla 2020",
      price: 8500,
      location: "Dubai",
      date: "June 12",
      image: "https://picsum.photos/seed/car1/300/200",
    },
    {
      id: 6,
      title: "Honda Civic 2021",
      price: 9000,
      location: "Sharjah",
      date: "June 11",
      image: "https://picsum.photos/seed/car2/300/200",
    },
    {
      id: 7,
      title: "Nissan Patrol 2019",
      price: 15000,
      location: "Abu Dhabi",
      date: "June 10",
      image: "https://picsum.photos/seed/car3/300/200",
    },
    {
      id: 8,
      title: "Kia Sportage 2022",
      price: 12000,
      location: "Ajman",
      date: "June 9",
      image: "https://picsum.photos/seed/car4/300/200",
    },
  ],
};


// Reusable section component
const AdSection = ({ title, ads }) => (
  <section className="my-12">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  </section>
);

const MarketplaceHome = () => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <CategoriesList />
        <AdSection title="Mobiles" ads={dummyAds.mobiles} />
        <AdSection title="Cars" ads={dummyAds.cars} />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default MarketplaceHome;
