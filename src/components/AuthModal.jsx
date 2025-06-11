import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import OtpInput from './OtpInput';

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'otp'
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [loginValue, setLoginValue] = useState(''); // email or phone

  if (!isOpen) return null;

  // const handleLoginSubmit = async ({ login, password }) => {
  //     try {
  //       const res = await axios.post(
  //         'http://127.0.0.1:8000/api/login/request-otp',
  //         { login, password },
  //         { withCredentials: true }
  //       );
  //       setLoginValue(login);
  //       setView('otp');
  //       toast.success('OTP sent to your login.');
  //     } catch (error) {
  //       if (error.response?.data?.unverified) {
  //         onClose(); // Close the login popup
  //         toast.error('Please verify your email first. A verification link has been sent.');
  //       } else {
  //         toast.error(error.response?.data?.message || 'Login failed');
  //       }
  //     }
  //   };

 const handleLoginSubmit = async ({ login, password }) => {
      try {
        const res = await axios.post(
          'http://127.0.0.1:8000/api/login/request-otp',
          { login, password },
          { withCredentials: true }
        );
        setLoginValue(login);
        setView('otp');
        toast.success('OTP sent to your login.');
      } catch (error) {
        const status = error?.response?.status;
        const data = error?.response?.data;

        if (status === 403 && data?.unverified) {
          toast.error('Your email is not verified. Please verify it before logging in.');
          onClose();
        } else if (data?.message) {
          toast.error(data.message);
        } else {
          toast.error('Something went wrong. Try again.');
        }

        console.error('Login error:', error); // keep this in dev
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

  const handleOtpSubmit = async (otp) => {
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/login/verify-otp',
        {
          login: loginValue,
          otp,
        },
        { withCredentials: true }
      );
      toast.success('Login successful!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">
            {view === 'signup' ? 'Sign Up' : view === 'otp' ? 'Verify OTP' : 'Login'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl font-bold">
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
          <OtpInput login={loginValue} onSubmit={handleOtpSubmit} />
        )}

        <div className="mt-4 text-center">
          {view === 'login' && (
            <p>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setView('signup')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
          {view === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setView('login')}
                className="text-blue-600 font-semibold hover:underline"
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
