import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoginForm from '../shared/LoginForm';
import SignupForm from '../shared/SignupForm';
import OtpInput from '../shared/OtpInput';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'otp'
  const [loginMethod, setLoginMethod] = useState('email');
  const [loginValue, setLoginValue] = useState('');

  useEffect(() => {
  if (isOpen) {
    setView('login');
    setLoginMethod('email');
    setLoginValue('');
  }
  }, [isOpen]);

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { login } = useAuth();



  if (!isOpen) return null;

 const handleLoginSubmit = async ({ login, password }) => {
  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/login/request-otp',
      { login, password },
      { withCredentials: true }
    );

    console.log('✅ Login success response:', res?.data);

    setLoginValue(login);
    setView('otp');
    return { status: 'ok', message: 'OTP sent to your login.' };
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    if (status === 403 && data?.status === 'unverified') {
      toast.error(data.message || 'Your email is not verified. Please verify it before logging in.');
      return { status: 'unverified' };
    }

    // 🚨 Add this: allow resendOtp() to catch and handle error properly
    throw error;
  }
};


  const handleSignupSubmit = async (formData) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/register', formData, {
        withCredentials: true,
      });
      setView('login');
      toast.success('Registration successful. Check your email for verification link.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  // const handleOtpSubmit = async (otp) => {
  //   try {
  //     const res = await axios.post(
  //       'http://127.0.0.1:8000/api/login/verify-otp',
  //       { login: loginValue, otp },
  //       { withCredentials: true }
  //     );

  //     toast.success('Login successful!');
  //     const { user, token } = res.data;

  //     localStorage.setItem("user", JSON.stringify(user));
  //     localStorage.setItem("token", token);

  //     setUser(user); // ✅ This will make UI reactive now
  //     onClose();     // ✅ Close the modal — no redirect!
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Invalid OTP. Try again.');
  //   }
  // };

  const handleOtpSubmit = async (otp) => {
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/login/verify-otp',
        { login: loginValue, otp },
        { withCredentials: true }
      );

      toast.success('Login successful!');
      
      const { user, access_token } = res.data;

      login(user, access_token); // ✅ Now the token will be set correctly
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-base-100 w-full max-w-md rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-base-content capitalize">
            {view === 'signup' ? 'Sign Up' : view === 'otp' ? 'Verify OTP' : 'Login'}
          </h2>
          <button
            onClick={onClose}
            className="text-base-content hover:text-error text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {view === 'signup' && (
          <SignupForm onSubmit={handleSignupSubmit} />
        )}

        {view === 'login' && (
          <LoginForm
            loginMethod={loginMethod}
            setLoginMethod={setLoginMethod}
            onSubmit={handleLoginSubmit}
          />
        )}

        {view === 'otp' && (
          <OtpInput
            login={loginValue}
            onSubmit={handleOtpSubmit}
            resendOtp={() => handleLoginSubmit({ login: loginValue })}
          />
        )}

        <div className="mt-4 text-center">
          {view === 'login' && (
            <p className="text-sm text-base-content">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setView('signup')}
                className="text-primary font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
          {view === 'signup' && (
            <p className="text-sm text-base-content">
              Already have an account?{' '}
              <button
                onClick={() => setView('login')}
                className="text-primary font-semibold hover:underline"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
