import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { UserIcon, BuildingOffice2Icon } from '@heroicons/react/24/solid';

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
          className="btn btn-primary"
        >
          Resend Verification Email
        </button>
        {message && <p className="text-sm text-success mt-2">{message}</p>}
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative bg-base-100 p-6 rounded-xl shadow">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-75 z-10 rounded-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* Account Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Account Type</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'individual' })}
            className={`btn flex-1 ${form.role === 'individual' ? 'btn-primary text-white' : 'btn-outline'}`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Individual
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: 'company' })}
            className={`btn flex-1 ${form.role === 'company' ? 'btn-primary text-white' : 'btn-outline'}`}
          >
            <BuildingOffice2Icon className="h-5 w-5 mr-2" />
            Company
          </button>
        </div>
      </div>

      {/* Company or Individual Name */}
      {form.role === 'company' ? (
        <div className="form-control">
          <label className="label">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      ) : (
        <div className="form-control">
          <label className="label">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
      )}

      {/* Email */}
      <div className="form-control">
        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Phone */}
      <div className="form-control">
        <label className="label">Phone</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^\d+]/g, '');
            setForm({ ...form, phone: cleaned });
          }}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Password */}
      <div className="form-control">
        <label className="label">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {form.password && (
          <p className="text-xs mt-1">
            Strength:{" "}
            <span className={
              passwordStrength === 'Strong'
                ? 'text-success'
                : passwordStrength === 'Medium'
                ? 'text-warning'
                : 'text-error'
            }>
              {passwordStrength}
            </span>
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-control">
        <label className="label">Confirm Password</label>
        <div className="relative">
          <input
            type={showPasswordConfirmation ? 'text' : 'password'}
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            className="input input-bordered w-full pr-10"
            required
          />
          <span
            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          'Sign Up'
        )}
      </button>

      {/* Message */}
      {message && (
        <div className={`text-sm text-center mt-2 ${message.toLowerCase().includes('success') ? 'text-success' : 'text-error'}`}>
          {message}
        </div>
      )}
    </form>
  );
}
