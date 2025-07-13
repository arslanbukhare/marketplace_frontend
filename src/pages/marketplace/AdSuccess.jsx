import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function AdSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 border border-base-200 text-center space-y-6">
        <CheckCircleIcon className="mx-auto text-green-500" size={64} />

        <h2 className="text-3xl font-bold text-success">Ad Posted Successfully!</h2>
        <p className="text-base-content">
          Thank you for posting your ad. It will now be visible to visitors according to your selected plan.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/my-ads')}
          >
            View My Ads
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/post-ad')}
          >
            Post Another Ad
          </button>
        </div>
      </div>
    </div>
  );
}
