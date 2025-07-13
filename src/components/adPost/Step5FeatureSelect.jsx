import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Step4FeatureSelect({ formData, setFormData, back }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState([]);
  

  useEffect(() => {
    api.get('/featured-plans')
      .then(res => setPlans(res.data))
      .catch(err => console.error('Failed to load plans:', err));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);

    if (formData.feature_type === 'free') {
      const adForm = new FormData();
      adForm.append('category_id', formData.category_id);
      adForm.append('subcategory_id', formData.subcategory_id);
      adForm.append('title', formData.title);
      adForm.append('description', formData.description);
      adForm.append('price', formData.price);
      adForm.append('city', formData.city);
      adForm.append('address', formData.address);
      adForm.append('contact_number', formData.contact_number);
      adForm.append('show_contact_number', formData.show_contact_number ? 1 : 0);
      adForm.append('feature_type', 'free');

      formData.dynamic_fields.forEach((f, i) => {
        adForm.append(`dynamic_fields[${i}][field_id]`, f.field_id);
        adForm.append(`dynamic_fields[${i}][value]`, f.value);
      });

      formData.images.forEach((file, i) => {
        adForm.append(`images[${i}]`, file);
      });

      try {
          const res = await api.post('/post-ad', adForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true, // if using Sanctum
          });

          const { success, message } = res.data;

          if (success) {
            toast.success(message || 'Ad posted successfully!');
            navigate(`/ad-success?success=1&message=${encodeURIComponent(message)}`);
          } else {
            toast.error('Something went wrong posting the ad.');
          }
        } catch (err) {
          console.error('❌ Error posting ad:', err.response?.data || err.message);
          toast.error(err.response?.data?.message || 'Something went wrong.');
        } finally {
          setSubmitting(false);
        }

    } else if (formData.feature_type === 'featured' && formData.featured_plan_id) {
      try {
        const pendingForm = new FormData();
        pendingForm.append('category_id', formData.category_id);
        pendingForm.append('subcategory_id', formData.subcategory_id);
        pendingForm.append('title', formData.title);
        pendingForm.append('description', formData.description);
        pendingForm.append('price', formData.price);
        pendingForm.append('city', formData.city);
        pendingForm.append('address', formData.address);
        pendingForm.append('contact_number', formData.contact_number);
        pendingForm.append('show_contact_number', formData.show_contact_number ? 1 : 0);
        pendingForm.append('featured_plan_id', formData.featured_plan_id);

        formData.dynamic_fields.forEach((f, i) => {
          pendingForm.append(`dynamic_fields[${i}][field_id]`, f.field_id);
          pendingForm.append(`dynamic_fields[${i}][value]`, f.value);
        });

        formData.images.forEach((file, i) => {
          pendingForm.append(`images[${i}]`, file);
        });

        const pendingRes = await api.post('/pending-ad', pendingForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const pendingAdId = pendingRes.data.pending_ad_id;

        const checkoutRes = await api.post('/create-checkout-session', {
          featured_plan_id: formData.featured_plan_id,
          pending_ad_id: pendingAdId,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        window.location.href = checkoutRes.data.url;

      } catch (err) {
        console.error('❌ Featured Ad Error:', err.response?.data || err.message);
        alert(err.response?.data?.message || 'Something went wrong creating featured ad.');
        setSubmitting(false);
      }
    } else {
      alert('Please select a featured plan.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-2">Choose Your Ad Plan</h2>

            {/* Back Arrow */}
            <div className="mb-8">
                    <button onClick={back} className="flex items-center text-sm text-gray-600 hover:text-black">
                      <ArrowLeftIcon className="h-5 w-5 mr-1" />
                      Back
                    </button>
                  </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {/* Free Ad Card */}
        <label
          className={`card cursor-pointer border transition-all hover:shadow-md ${
            formData.feature_type === 'free' ? 'border-primary ring-2 ring-primary' : 'border-base-200'
          }`}
        >
          <div className="card-body">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="feature_type"
                value="free"
                className="radio radio-primary mt-1"
                checked={formData.feature_type === 'free'}
                onChange={() => setFormData({ ...formData, feature_type: 'free', featured_plan_id: null })}
              />
              <div>
                <h3 className="text-lg font-semibold">Free Ad</h3>
                <p className="text-sm text-gray-500">Your ad will appear in regular listings without extra visibility.</p>
              </div>
            </div>
          </div>
        </label>

        {/* Featured Plan Cards */}
        {plans.map((plan) => (
          <label
            key={plan.id}
            className={`card cursor-pointer border transition-all hover:shadow-md ${
              formData.feature_type === 'featured' && formData.featured_plan_id === plan.id
                ? 'border-primary ring-2 ring-primary'
                : 'border-base-200'
            }`}
          >
            <div className="card-body">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="feature_type"
                  value="featured"
                  className="radio radio-primary mt-1"
                  checked={
                    formData.feature_type === 'featured' &&
                    formData.featured_plan_id === plan.id
                  }
                  onChange={() =>
                    setFormData({
                      ...formData,
                      feature_type: 'featured',
                      featured_plan_id: plan.id,
                    })
                  }
                />
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-500">
                    Featured for <strong>{plan.duration_days} days</strong><br />
                    <span className="text-base font-bold text-primary">{plan.currency} {plan.price}</span>
                  </p>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post My Ad'}
        </button>
      </div>
    </div>
  );
}
