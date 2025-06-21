import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function CompanyBasicInfoForm() {
  const { user, refreshUser } = useAuth();
  const profile = user?.profile || {};

  const [formData, setFormData] = useState({
    company_name: profile.company_name || '',
    industry: profile.industry || '',
    description: profile.description || '',
  });

  const [previewLogo, setPreviewLogo] = useState(
    profile.logo
      ? `${import.meta.env.VITE_API_BASE_URL}/storage/${profile.logo}`
      : `https://ui-avatars.com/api/?name=${profile.company_name || 'Company'}&background=random`
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        company_name: user.profile.company_name || '',
        industry: user.profile.industry || '',
        description: user.profile.description || '',
      });
      setPreviewLogo(
        user.profile.logo
          ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile.logo}`
          : `https://ui-avatars.com/api/?name=${user.profile.company_name || 'Company'}&background=random`
      );
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewLogo(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('logo', file);

    try {
      await api.post('/profile/company/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await refreshUser();
      setMessage('Logo updated successfully.');
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        (error.response?.status === 422 ? 'Invalid image file.' : 'Something went wrong.');
      setMessage(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/profile/company/basic-info', formData);
      setMessage('Profile updated successfully!');
      await refreshUser();
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        (error.response?.status === 422 ? 'Validation failed.' : 'Something went wrong.');
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Company Profile Card */}
      <div className="mb-6 p-4 border rounded flex items-center space-x-4 bg-gray-50">
        <div className="relative">
          <img
            src={previewLogo}
            alt="Company Logo"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <input
            type="file"
            name="logo"
            accept="image/*"
            className="absolute top-0 left-0 w-16 h-16 opacity-0 cursor-pointer"
            onChange={handleLogoChange}
          />
        </div>
        <div>
          <div className="text-lg font-semibold">
            {formData.company_name || 'Company Name'}
          </div>
          <div className="text-sm text-gray-500">{user?.email || 'No email'}</div>
        </div>
      </div>

      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Industry</label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
