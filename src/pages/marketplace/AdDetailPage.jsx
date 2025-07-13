import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

export default function AdDetailPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`/ads/${id}`);
        setAd(res.data);
      } catch (err) {
        console.error('❌ Error loading ad:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading ad...</div>;
  if (!ad) return <div className="text-center mt-10 text-red-500">Ad not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-6">

        {/* Ad Images */}
        {ad.images && ad.images.length > 0 && (
          <div className="bg-white rounded shadow-sm p-2">
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
          </div>
        )}

        {/* Ad Info Card */}
        <div className="bg-white rounded shadow-sm p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-semibold">{ad.title}</h1>
            {ad.is_featured == 1 && (
              <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>

          <div className="text-2xl text-primary font-bold">
            AED {ad.price}
          </div>

          <div className="text-sm text-gray-600">
            {ad.city} · {new Date(ad.created_at).toLocaleDateString()}
          </div>

          {/* Ad Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm mt-4">
            <div><strong>Category:</strong> {ad.category?.name}</div>
            <div><strong>Subcategory:</strong> {ad.subcategory?.name}</div>
            <div><strong>Address:</strong> {ad.address}</div>
            <div><strong>Contact:</strong> {ad.show_contact_number ? ad.contact_number : 'Hidden'}</div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {ad.description}
          </p>
        </div>

        {/* Dynamic Fields */}
        {ad.dynamic_fields && ad.dynamic_fields.length > 0 && (
          <div className="bg-white rounded shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-2">Additional Info</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {ad.dynamic_fields.map((f, i) => (
                <li key={i}>
                  {f.field?.name || f.field_id}: {f.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Posted Date */}
        <div className="text-xs text-gray-500 text-center">
          Posted on {new Date(ad.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
