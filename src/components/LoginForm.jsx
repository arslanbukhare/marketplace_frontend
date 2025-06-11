import { useState } from 'react';

export default function LoginForm({ loginMethod, setLoginMethod, onSubmit }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await onSubmit({ login, password });

      if (response?.status === 'unverified') {
        // Close login popup and show email verification popup
        setShowVerifyPopup(true);
        setMessage('');
        return;
      }
    } catch (error) {
      setMessage(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!showVerifyPopup ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {loginMethod === 'email' ? 'Email' : 'Phone'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'text'}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

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
              'Login'
            )}
          </button>

          <div className="text-center mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() =>
                setLoginMethod(loginMethod === 'email' ? 'phone' : 'email')
              }
            >
              Login with {loginMethod === 'email' ? 'Phone' : 'Email'} instead
            </button>
          </div>

          {message && (
            <div className="text-sm text-center text-green-600 mt-2">
              {message}
            </div>
          )}
        </form>
      ) : (
        <div className="p-4 border rounded-xl bg-yellow-50 text-yellow-700 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Email Not Verified</h2>
          <p>
            Please check your inbox for the verification email. Once verified, you can log in.
          </p>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => setShowVerifyPopup(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
