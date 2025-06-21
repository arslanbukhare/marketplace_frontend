import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



export default function LoginForm({ loginMethod, setLoginMethod, onSubmit }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setLoading(true);

  try {
    const response = await onSubmit({ login, password });

    if (response?.status === 'unverified') {
      setShowVerifyPopup(true);
      return;
    }

  } catch (error) {
    const statusCode = error?.response?.status;
    const data = error?.response?.data;

    // Show toast and optionally message for common errors
    if (statusCode === 429 || data?.status === 'rate_limited') {
      toast.error(data?.message || 'Too many attempts. Please try again later.');
      setMessage(''); // Don't show ugly raw message inline
    } else if (data?.message) {
      toast.error(data.message);
      setMessage(data.message);
    } else {
      toast.error('Unexpected error. Please try again.');
      setMessage('');
    }

  } finally {
    setLoading(false);
  }
};



  const handleResendVerification = async () => {
    try {
      setResendStatus('Sending...');
      await axios.post('http://127.0.0.1:8000/api/email/resend-verification', {
        email: login,
      });
      setResendStatus('Verification email sent!');
    } catch (error) {
      setResendStatus('Failed to resend email. Please try again.');
    }
  };

  // Regex patterns
  const phonePattern = '^(+9715\\d{8}|05\\d{8})$'; // UAE format: 9715xxxxxxxx or 05xxxxxxxx

  return (
    <>
      {!showVerifyPopup ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {loginMethod === 'email' ? 'Email' : 'Phone'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'} // 👈 Use 'tel' for phone input
              className="input input-bordered w-full"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              placeholder={
                loginMethod === 'email'
                  ? 'example@domain.com'
                  : '05XXXXXXXX or +9715XXXXXXXX' // 👈 UAE format hint
              }
              pattern={loginMethod === 'phone' ? phonePattern : undefined} // 👈 Validation pattern for phone
              title={
                loginMethod === 'phone'
                  ? 'Enter UAE number (05XXXXXXXX or +9715XXXXXXXX)'
                  : ''
              }
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input input-bordered w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Login'}
          </button>

          <div className="text-center mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() =>{
                setLogin('');
                setPassword('');
                setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
              }}
            >
              Login with {loginMethod === 'email' ? 'Phone' : 'Email'} instead
            </button>
          </div>

          {message && (
            <div className="alert alert-warning text-sm mt-2 justify-center">
              {message}
            </div>
          )}
        </form>
      ) : (
        <div className="p-6 rounded-xl bg-yellow-100 border border-yellow-300 shadow">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Email Not Verified
          </h2>
          <p className="text-yellow-700">
            Please check your inbox for the verification email. Once verified,
            you can log in.
          </p>

          <button
            className="btn btn-outline btn-warning mt-4"
            onClick={handleResendVerification}
          >
            Resend Verification Email
          </button>

          {resendStatus && (
            <p className="text-sm text-green-600 mt-2">{resendStatus}</p>
          )}

          <button
            className="btn btn-sm btn-link mt-2 text-gray-600"
            onClick={() => setShowVerifyPopup(false)}
          >
            Back to Login
          </button>
        </div>
      )}
    </>
  );
}
