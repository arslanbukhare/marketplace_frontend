import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import Header from '../../components/shared/Header';
import Footer from '../../components/marketplace/Footer';

export default function MyAdsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAds = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'active' ? '/my-ads/active' : '/my-ads/pending';
      const res = await api.get(endpoint);
      setAds(res.data);
    } catch (err) {
      console.error('❌ Error fetching ads:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [activeTab]);

  const handleDelete = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      await api.delete(`/ads/${adId}`);
      alert('✅ Ad deleted successfully.');
      fetchAds();
    } catch (err) {
      console.error('❌ Failed to delete ad:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error deleting ad.');
    }
  };

  const handleEdit = (adId) => {
    navigate(`/ads/${adId}/edit`);
  };

  const handleMarkAsSold = async (adId) => {
    if (!window.confirm('Are you sure you want to mark this ad as sold?')) return;

    try {
      await api.patch(`/ads/${adId}/status`, { status: 'sold' });
      alert('✅ Ad marked as sold.');
      fetchAds();
    } catch (err) {
      console.error('❌ Failed to mark as sold:', err.response?.data || err.message);
      alert('Error marking ad as sold.');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-4 mt-6">
        <h2 className="text-3xl font-bold text-black mb-6">Manage and view your Ads</h2>

        {/* Tabs */}
        <div className="flex items-center justify-start mb-6">
          <div className="tabs tabs-boxed bg-base-200 p-1 rounded-full w-fit">
            <button
              className={`tab rounded-full px-6 py-2 font-semibold text-sm ${
                activeTab === 'active' ? 'tab-active' : ''
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Ads
            </button>
            <button
              className={`tab rounded-full px-6 py-2 font-semibold text-sm ${
                activeTab === 'pending' ? 'tab-active' : ''
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Ads
            </button>
          </div>
        </div>

        {/* Loader or Ads */}
        {loading ? (
          <div className="text-center text-gray-500">Loading ads...</div>
        ) : ads.length === 0 ? (
          <div className="text-center text-gray-500">No {activeTab} ads found.</div>
        ) : (
          <div className="space-y-6">
            {ads.map((ad) => (
              <Link
                key={ad.id}
                to={`/ads/${ad.id}`}
                className="card card-side bg-base-100 shadow-md border hover:shadow-lg transition group"
              >
                {/* Left: Image with padding */}
                <div className="pl-4 py-4">
                  <figure className="w-48 h-36 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={ad.first_image_url || '/images/no-image.png'}
                      alt={ad.title}
                      className="object-cover w-full h-full"
                    />
                  </figure>
                </div>

                {/* Right: Content */}
                <div className="card-body py-4 pr-4 pl-2 w-full">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black mb-2">{ad.title}</h3>

                  {/* Price + Status */}
                  <div className="text-lg flex items-center gap-3 mb-2">
                    <span className="font-semibold text-base-content">
                      AED: {ad.price || 'N/A'}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className={`badge badge-outline badge-md capitalize ${ad.status === 'sold' ? 'badge-success' : ''}`}>
                      {ad.status}
                    </span>
                  </div>

                  {/* Row 3: Icons + Buttons */}
                  <div className="flex justify-between items-center text-gray-600 text-base">
                    {/* Views & Chats */}
                    <div className="flex gap-6">
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-6 h-6" />
                        <span>{ad.views_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                        <span>{ad.chat_count || 0}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(ad.id);
                        }}
                        className="btn btn-sm btn-outline btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(ad.id);
                        }}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                      {ad.status !== 'sold' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMarkAsSold(ad.id);
                          }}
                          className="btn btn-sm btn-outline btn-success"
                        >
                          Mark as Sold
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
