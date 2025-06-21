import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function IndividualBasicInfoForm() {
  const { user, refreshUser } = useAuth();
  const profile = user?.profile || {};

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
  };

  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    gender: profile.gender || '',
    dob: formatDate(profile.dob),
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    profile.profile_picture
      ? `${import.meta.env.VITE_API_BASE_URL}/storage/${profile.profile_picture}`
      : `https://ui-avatars.com/api/?name=${profile.first_name || 'User'}&background=random`
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Update preview image when user profile changes
  useEffect(() => {
    if (user?.profile) {
      setPreviewImage(
        user.profile.profile_picture
          ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile.profile_picture}`
          : `https://ui-avatars.com/api/?name=${user.profile.first_name || 'User'}&background=random`
      );
      console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview immediately
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append('first_name', formData.first_name);
      payload.append('last_name', formData.last_name);
      payload.append('gender', formData.gender);
      payload.append('dob', formData.dob);
      if (profilePicture) {
        payload.append('profile_picture', profilePicture);
      }

      await api.post('/profile/individual/basic-info', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Profile updated successfully!');
      await refreshUser(); // Refresh user profile after update
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.response?.status === 422 ? 'Validation failed.' : 'Something went wrong.');
      setMessage(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Profile Summary */}
      <div className="mb-6 p-4 border rounded flex items-center space-x-4 bg-gray-50">
        <div className="relative">
          <img
            src={previewImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <input
            type="file"
            name="profile_picture"
            accept="image/*"
            className="absolute top-0 left-0 w-16 h-16 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <div className="text-lg font-semibold">
            {`${formData.first_name} ${formData.last_name}`}
          </div>
          <div className="text-sm text-gray-500">{user?.email || 'No email'}</div>
        </div>
      </div>

      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
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
