import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import OtpInput from './OtpInput';

export default function AuthModal({ isOpen, onClose }) {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'otp'
  const [loginMethod, setLoginMethod] = useState('email');
  const [loginValue, setLoginValue] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  
  //   try {
  //     const res = await axios.post(
  //       'http://127.0.0.1:8000/api/login/request-otp',
  //       { login, password },
  //       { withCredentials: true }
  //     );
  //     setLoginValue(login);
  //     setView('otp');
  //     toast.success('OTP sent to your login.');
  //   } catch (error) {
  //     const status = error?.response?.status;
  //     const data = error?.response?.data;

  //     if (status === 403 && data?.unverified) {
  //       toast.error('Your email is not verified. Please verify it before logging in.');
  //     } else if (data?.message) {
  //       toast.error(data.message);
  //     } else {
  //       toast.error('Something went wrong. Try again.');
  //     }
  //     console.error('Login error:', error);
  //   }
  // };


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
    toast.success('OTP sent to your login.');
    return { status: 'ok' };
  } catch (error) {
    console.error('❌ Full Axios error object:', error);

    if (error?.response) {
      console.error('❌ Error status:', error.response.status);
      console.error('❌ Error data:', error.response.data);
      console.error('❌ Error headers:', error.response.headers);
    } else if (error?.request) {
      console.error('❌ Request made but no response received:', error.request);
    } else {
      console.error('❌ Error setting up the request:', error.message);
    }

    const status = error?.response?.status;
    const data = error?.response?.data;

    if (status === 403 && data?.status === 'unverified') {
      toast.error(data.message || 'Your email is not verified. Please verify it before logging in.');
      return { status: 'unverified' };
    } else if (data?.message) {
      toast.error(data.message);
    } else {
      toast.error('Something went wrong. Try again.');
    }
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
  //     const { user, token } = response.data;

  //     localStorage.setItem("user", JSON.stringify(user));
  //     localStorage.setItem("token", token);

  //     // Redirect to dashboard based on role
  //     if (user.role === "company") {
  //       navigate("/dashboard/company");
  //     } else if (user.role === "individual") {
  //       navigate("/dashboard/individual");
  //     }

  //     onClose();
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
        const { user, token } = res.data; // ✅ fix here

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        // Redirect to dashboard based on role
        if (user.role === "company") {
          navigate("/dashboard/company");
        } else if (user.role === "individual") {
          navigate("/dashboard/individual");
        }

        onClose(); // ✅ optional - can also be called before navigate()
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
          <OtpInput login={loginValue} onSubmit={handleOtpSubmit} />
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
