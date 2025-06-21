import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function CompanyTradeLicenseForm() {
  const { user, refreshUser } = useAuth();
  const profile = user?.profile || {};

  const [formData, setFormData] = useState({
    registration_number: '',
    registration_expiry_date: '',
  });

  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const tradeLicenseStatus = profile.registration_document_status ?? null;
  const isDisabled = tradeLicenseStatus === 'pending' || tradeLicenseStatus === 'verified';

  useEffect(() => {
    if (profile) {
      setFormData({
        registration_number: profile.registration_number || '',
        registration_expiry_date: profile.registration_expiry_date
          ? profile.registration_expiry_date.slice(0, 10)
          : '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append('registration_number', formData.registration_number);
      payload.append('registration_expiry_date', formData.registration_expiry_date);
      if (documentFile) {
        payload.append('registration_document', documentFile);
      }

      await api.post('/profile/company/trade-license', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await refreshUser();
      setMessage('Verification request sent successfully!');
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
  <div className="space-y-6">
    {message && <div className="text-sm text-blue-600">{message}</div>}

    {/* Trade License Status Display */}
    <div>
      <span className="text-sm font-medium">Verification Status: </span>
      <span
        className={`inline-block px-2 py-1 text-xs rounded ${
          tradeLicenseStatus === 'verified'
            ? 'bg-green-100 text-green-800'
            : tradeLicenseStatus === 'rejected'
            ? 'bg-red-100 text-red-800'
            : tradeLicenseStatus === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {tradeLicenseStatus
          ? tradeLicenseStatus.charAt(0).toUpperCase() + tradeLicenseStatus.slice(1)
          : 'Not Requested'}
      </span>
    </div>

    {/* IF NOT REQUESTED - SHOW FORM */}
    {tradeLicenseStatus === null || tradeLicenseStatus === 'rejected' ? (
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Registration Number</label>
          <input
            type="text"
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Registration Expiry Date</label>
          <input
            type="date"
            name="registration_expiry_date"
            value={formData.registration_expiry_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Registration Document</label>
          <input
            type="file"
            name="registration_document"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepted: pdf, jpg, jpeg, png. Max size: 5MB
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Request Verification'}
        </button>
      </form>
    ) : (
      // IF STATUS IS PENDING OR VERIFIED - SHOW READONLY DETAILS
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Registration Number</label>
          <div className="text-sm text-gray-700">
            {formData.registration_number || 'N/A'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Registration Expiry Date</label>
          <div className="text-sm text-gray-700">
            {formData.registration_expiry_date || 'N/A'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Registration Document</label>
          {profile.registration_document ? (
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/storage/${profile.registration_document}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600 text-sm"
            >
              View Document
            </a>
          ) : (
            <div className="text-sm text-gray-500">No document uploaded.</div>
          )}
        </div>
      </div>
    )}
  </div>
);

}
