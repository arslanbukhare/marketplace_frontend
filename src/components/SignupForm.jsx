import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Icons for password toggle
import { UserIcon, BuildingOffice2Icon } from '@heroicons/react/24/solid'; // Import icons (Tailwind Heroicons)

export default function SignupForm() {
  const [form, setForm] = useState({
    role: 'individual',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    company_name: ''
  });

  const [message, setMessage] = useState('');
  const [verificationScreen, setVerificationScreen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password) => {
    if (!password) return '';
    if (password.length < 6) return 'Too short';
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;
    if (strongRegex.test(password)) return 'Strong';
    if (mediumRegex.test(password)) return 'Medium';
    return 'Weak';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!form.email.includes('@') || !form.email.includes('.')) {
      setMessage('Please enter a valid email.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/register',
        form,
        { withCredentials: true }
      );
      setRegisteredEmail(form.email);
      setVerificationScreen(true);
    } catch (error) {
      const msg =
        error.response?.data?.errors?.email?.[0] ||
        error.response?.data?.errors?.password?.[0] ||
        error.response?.data?.message ||
        'Signup failed. Please try again.';
      if (msg.includes('already') && msg.includes('not verified')) {
        setRegisteredEmail(form.email);
        setVerificationScreen(true);
      } else {
        setMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/email/resend-verification',
        { email: registeredEmail },
        { withCredentials: true }
      );
      setMessage('Verification email resent successfully.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Failed to resend email. Try again later.');
    }
  };

  if (verificationScreen) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold">Verify Your Email</h2>
        <p>
          We've sent a verification link to <strong>{registeredEmail}</strong>.<br />
          Please check your inbox and verify your email to login.
        </p>
        <button
          onClick={handleResend}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700"
        >
          Resend Verification Email
        </button>
        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-xl">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

     {/* Account Type Selection */}
      <div>
        <label className="block text-sm mb-2 font-medium text-gray-700">Account Type</label>
        <div className="flex space-x-4">
          {/* Individual Option */}
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'individual' })}
            className={`flex-1 flex flex-col items-center justify-center border rounded-xl px-4 py-3 transition-all ${
              form.role === 'individual'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
          >
            <UserIcon className="h-6 w-6 mb-1" />
            <span className="text-sm font-semibold">Individual</span>
          </button>

          {/* Company Option */}
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'company' })}
            className={`flex-1 flex flex-col items-center justify-center border rounded-xl px-4 py-3 transition-all ${
              form.role === 'company'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
          >
            <BuildingOffice2Icon className="h-6 w-6 mb-1" />
            <span className="text-sm font-semibold">Company</span>
          </button>
        </div>
      </div>

      {/* Name Fields */}
      {form.role === 'company' ? (
        <div>
          <label htmlFor="company_name" className="block text-sm mb-1">Company Name</label>
          <input
            id="company_name"
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2"
            required
          />
        </div>
      ) : (
        <div>
          <label htmlFor="first_name" className="block text-sm mb-1">First Name</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2"
            required
          />
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm mb-1">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-2"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm mb-1">Phone</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^\d+]/g, '');
            setForm({ ...form, phone: cleaned });
          }}
          className="w-full border rounded-xl px-4 py-2"
          required
        />
      </div>


      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm mb-1">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {form.password && (
          <p className="text-xs mt-1">
            Strength:{" "}
            <span
              className={
                passwordStrength === 'Strong'
                  ? 'text-green-600'
                  : passwordStrength === 'Medium'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }
            >
              {passwordStrength}
            </span>
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="password_confirmation" className="block text-sm mb-1">Confirm Password</label>
        <div className="relative">
          <input
            id="password_confirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 pr-10"
            required
          />
          <span
            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 flex justify-center items-center"
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          'Sign Up'
        )}
      </button>

      {/* Message */}
      {message && (
        <div className={`text-sm mt-2 text-center ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
    </form>
  );
}
