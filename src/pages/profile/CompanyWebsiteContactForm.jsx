// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../api/axios';
// import OtpInput from '../../components/shared/OtpInput';

// export default function CompanyWebsiteContactForm() {
//   const { user, refreshUser } = useAuth();

//   const [phone, setPhone] = useState(user?.phone || '');
//   const [isPhoneVerified, setIsPhoneVerified] = useState(!!user?.is_phone_verified);
//   const [showOtpModal, setShowOtpModal] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setPhone(user.phone || '');
//       setIsPhoneVerified(!!user.is_phone_verified);
//     }
//   }, [user]);

//   const handleRequestOtp = async () => {
//     try {
//       const response = await api.post('/profile/request-phone-otp', {
//         phone,
//         type: 'phone',
//       });

//       if (response?.status === 200 || response?.status === 'ok') {
//         setShowOtpModal(true);
//         return { status: 'ok', message: 'OTP sent successfully' };
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to request OTP';
//       console.warn('❌ OTP request error (to be thrown):', message);
//       throw error; // Let caller handle the toast
//     }
//   };

//   const handleVerifyOtpFromInput = async (code) => {
//     try {
//       await api.post('/profile/verify-phone-otp', {
//         phone,
//         otp: code,
//         type: 'phone',
//       });
//       await refreshUser();
//       setShowOtpModal(false);
//     } catch (error) {
//       console.error('OTP verification failed:', error.response?.data || error.message);
//       toast.error('Invalid or expired OTP');
//     }
//   };

//   return (
//     <>
//       {isPhoneVerified ? (
//         <div className="flex items-center gap-2 mt-1">
//           <span className="text-gray-800">{phone}</span>
//           <span className="text-sm text-green-600">(Verified)</span>
//         </div>
//       ) : (
//         <div className="flex items-center gap-2 mt-1">
//           <input
//             type="tel"
//             className="border p-2 rounded w-full max-w-sm"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />
//           <button
//             type="button"
//             onClick={async () => {
//               try {
//                 const res = await handleRequestOtp();
//                 if (res?.status === 'ok') {
//                   toast.success(res.message || 'OTP sent successfully');
//                 }
//               } catch (err) {
//                 const message = err.response?.data?.message || 'Failed to send OTP';
//                 toast.error(message);
//                 console.error('Initial Verify Now OTP request failed:', err);
//               }
//             }}
//             className="text-blue-600 underline text-sm hover:text-blue-800 hover:underline cursor-pointer"
//           >
//             Verify Now
//           </button>
//         </div>
//       )}

//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4 text-center">Verify Phone</h2>
//             <OtpInput
//               login={phone}
//               onSubmit={handleVerifyOtpFromInput}
//               resendOtp={handleRequestOtp}
//             />
//             <div className="flex justify-center mt-4">
//               <button
//                 onClick={() => setShowOtpModal(false)}
//                 className="text-gray-500 hover:text-gray-800 text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import OtpInput from '../../components/shared/OtpInput';

export default function CompanyWebsiteContactForm() {
  const { user, refreshUser } = useAuth();
  const company = user?.profile || {};

  const [phone, setPhone] = useState(user?.phone || '');
  const [isPhoneVerified, setIsPhoneVerified] = useState(!!user?.is_phone_verified);

  const [contactPhone, setContactPhone] = useState(company.contact_phone || '');
  const [isContactPhoneVerified, setIsContactPhoneVerified] = useState(!!company.is_contact_phone_verified);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpType, setOtpType] = useState(null); // 'phone' or 'contact_phone'

  const [website, setWebsite] = useState(company.website || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setIsPhoneVerified(!!user.is_phone_verified);

      const profile = user.profile || {};
      setContactPhone(profile.contact_phone || '');
      setIsContactPhoneVerified(!!profile.is_contact_phone_verified);
      setWebsite(profile.website || '');
    }
  }, [user]);

  // const handleRequestOtp = async (type, number) => {
  //   try {
  //     const response = await api.post('/profile/request-phone-otp', {
  //       phone: number,
  //       type: type,
  //     });

  //     if (response.status === 200) {
  //       setOtpType(type);
  //       setShowOtpModal(true);
  //       return { status: 'ok', message: 'OTP sent successfully' };
  //     }
  //   } catch (error) {
  //     const message = error.response?.data?.message || 'Failed to request OTP';
  //     throw error;
  //   }
  // };

  const handleRequestOtp = async (type, number) => {
  try {
    const response = await api.post('/profile/request-phone-otp', {
      phone: number,
      type: type,
    });

    if (response.status === 200) {
      // ✅ Handle auto_verified case
      if (response.data?.auto_verified) {
        toast.success(response.data.message || 'Contact phone auto-verified');
        await refreshUser(); // This will re-sync and trigger useEffect to update the state
        return { status: 'ok', message: response.data.message };
      }

      // ✅ Fallback to OTP flow
      setOtpType(type);
      setShowOtpModal(true);
      return { status: 'ok', message: 'OTP sent successfully' };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to request OTP';
    throw error;
  }
};


  const handleVerifyOtpFromInput = async (code) => {
    const number = otpType === 'phone' ? phone : contactPhone;
    try {
      await api.post('/profile/verify-phone-otp', {
        phone: number,
        otp: code,
        type: otpType,
      });
      await refreshUser();
      setShowOtpModal(false);
    } catch (error) {
      toast.error('Invalid or expired OTP');
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      setSaving(true);
      await api.post('/profile/company/contact-info', {
        website,
      });
      toast.success('Website updated successfully');
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Website Input */}
        <div className="mt-2">
          <label className="block font-medium text-gray-700">Company Website</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="url"
              className="border p-2 rounded w-full max-w-md"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
            />
            <button
              onClick={handleSaveContactInfo}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Phone Verification */}
        <div className="mt-4">
          <label className="block font-medium text-gray-700">Primary Phone</label>
          {isPhoneVerified ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-800">{phone}</span>
              <span className="text-sm text-green-600">(Verified)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="tel"
                className="border p-2 rounded w-full max-w-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await handleRequestOtp('phone', phone);
                    if (res?.status === 'ok') {
                      toast.success(res.message);
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to send OTP');
                  }
                }}
                className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
              >
                Verify Now
              </button>
            </div>
          )}
        </div>

        {/* Contact Phone Verification */}
        <div className="mt-4">
          <label className="block font-medium text-gray-700">Company Contact Phone</label>
          {isContactPhoneVerified ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-800">{contactPhone}</span>
              <span className="text-sm text-green-600">(Verified)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="tel"
                className="border p-2 rounded w-full max-w-sm"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await handleRequestOtp('contact_phone', contactPhone);
                    if (res?.status === 'ok') {
                      toast.success(res.message);
                    }
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to send OTP');
                  }
                }}
                className="text-blue-600 underline text-sm hover:text-blue-800 cursor-pointer"
              >
                Verify Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Verify Phone</h2>
            <OtpInput
              login={otpType === 'phone' ? phone : contactPhone}
              onSubmit={handleVerifyOtpFromInput}
              resendOtp={() => handleRequestOtp(otpType, otpType === 'phone' ? phone : contactPhone)}
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-gray-500 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
