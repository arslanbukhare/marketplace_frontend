import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OtpInput({ login, onSubmit }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(1);
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.every((v) => v.length === 1)) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (code) => {
    onSubmit(code);
  };

  const handleResend = async () => {
    if (!resendEnabled) return;

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/login/request-otp',
        { login, resend: true },
        { withCredentials: true }
      );

      toast.success(res.data.message || 'OTP sent successfully');

      setOtp(['', '', '', '', '', '']);
      setTimer(30);
      setResendEnabled(false);
      inputsRef.current[0].focus();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend OTP';

      if (message.includes('hour')) {
        toast.error(message);
      } else if (message.includes('24')) {
        toast.error(message);
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-base text-center text-gray-700">
        Enter the 6-digit code sent to <strong>{login}</strong>
      </p>

      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="input input-bordered w-12 h-12 text-center text-lg"
          />
        ))}
      </div>

      <button
        onClick={handleResend}
        className={`btn btn-link p-0 text-sm ${
          resendEnabled ? 'text-primary' : 'text-gray-400 pointer-events-none'
        }`}
        disabled={!resendEnabled}
      >
        {resendEnabled ? 'Resend OTP' : `Resend OTP in ${timer}s`}
      </button>
    </div>
  );
}
