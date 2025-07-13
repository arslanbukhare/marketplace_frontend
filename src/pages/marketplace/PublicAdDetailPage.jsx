import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { PhoneIcon, ChatBubbleLeftRightIcon, FlagIcon } from '@heroicons/react/24/outline';
import Header from '../../components/shared/Header';
import Footer from '../../components/marketplace/Footer';

export default function PublicAdDetailPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`/public-ads/${id}`);
        setAd(res.data);
      } catch (err) {
        console.error('❌ Error loading public ad:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading ad...</div>;
  if (!ad) return <div className="text-center mt-10 text-error">Ad not found.</div>;

  const profile = ad.user; // Assuming user info is inside ad.user

  return (
    <>
    <Header />
    <div className="bg-base-200 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* First Row: Gallery + Seller Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left: Image Gallery */}
          <div className="md:col-span-2 bg-base-100 rounded-lg shadow p-2">
            {ad.images && ad.images.length > 0 && (
              <ImageGallery
                items={ad.images.map((img) => ({
                  original: img.full_url,
                  thumbnail: img.full_url,
                }))}
                showFullscreenButton={true}
                showPlayButton={false}
                showBullets={true}
                slideOnThumbnailOver={true}
              />
            )}
          </div>

          {/* Right: Seller Info Box */}
          <div className="bg-base-100 rounded-lg shadow p-4 space-y-4">

            {/* Row 1: Seller Profile */}
            <Link to={`/users/${profile?.id}`} className="flex items-center gap-3 hover:bg-base-200 p-2 rounded cursor-pointer">
              <img
                src={profile?.profile_picture || 'https://via.placeholder.com/50'}
                alt={profile?.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-semibold">{profile?.name}</span>
            </Link>

            <div className="divider my-1"></div>

            {/* Row 2: Member Since + Active Ads */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Member since</div>
                <div className="font-medium">{new Date(profile?.created_at).getFullYear()}</div>
              </div>
              <div>
                <div className="text-gray-500">Active Ads</div>
                <div className="font-medium">{profile?.active_ads_count || 0}</div>
              </div>
            </div>

            {/* Row 3: Call Button */}
            <button className="btn btn-primary btn-sm w-full flex items-center gap-2">
              <PhoneIcon className="h-5 w-5" />
              {ad.show_contact_number ? ad.contact_number : 'Number Hidden'}
            </button>

            {/* Row 4: Chat Button */}
            <button className="btn btn-outline btn-secondary btn-sm w-full flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              Chat with Seller
            </button>

            {/* Row 5: Ad ID + Report */}
            <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
              <span>Ad ID: {ad.id}</span>
              <button className="flex items-center gap-1 text-error hover:underline">
                <FlagIcon className="h-4 w-4" />
                Report Ad
              </button>
            </div>
          </div>
        </div>

        {/* Second Row: Price + Title */}
        <div className="bg-base-100 rounded-lg shadow p-4 space-y-2">
          <div className="text-2xl text-primary font-bold">AED {ad.price}</div>
          <h1 className="text-xl font-semibold">{ad.title}</h1>
        </div>

        {/* Third Row: Details (Dynamic Fields) */}
        {ad.dynamic_fields && ad.dynamic_fields.length > 0 && (
          <div className="bg-base-100 rounded-lg shadow p-4 space-y-2">
            <h2 className="text-lg font-semibold">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {ad.dynamic_fields.map((f, i) => (
                <div key={i} className="flex">
                  <span className="font-medium mr-2">{f.field?.field_name || f.field_id}:</span>
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fourth Row: Description */}
        <div className="bg-base-100 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {ad.description}
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
