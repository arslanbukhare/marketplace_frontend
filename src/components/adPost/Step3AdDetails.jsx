import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Step2AdDetails({ formData, setFormData, next, back }) {
  const { user } = useAuth();
  const [dynamicFields, setDynamicFields] = useState([]);
  const [search, setSearch] = useState({});

  useEffect(() => {
    if (formData.category_id) {
      api.get(`/categories/${formData.category_id}/fields`)
        .then(res => setDynamicFields(res.data));
    }
  }, [formData.category_id]);

  useEffect(() => {
    if (user?.phone && !formData.contact_number) {
      setFormData(prev => ({ ...prev, contact_number: user.phone }));
    }
  }, [user]);

  const handleDynamicFieldChange = (fieldId, value) => {
    const updatedFields = formData.dynamic_fields.filter(f => f.field_id !== fieldId);
    updatedFields.push({ field_id: fieldId, value });
    setFormData({ ...formData, dynamic_fields: updatedFields });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-2">Ad Details</h2>

      <div className="mb-8">
        <button onClick={back} className="flex items-center text-sm text-gray-600 hover:text-black">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Title */}
      <div className="form-control mb-4">
        <label className="label">Title</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="form-control mb-4">
        <label className="label">Description</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows="4"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Price */}
      <div className="form-control mb-4">
        <label className="label">Price</label>
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="e.g. 2000 AED"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
        />
      </div>

      {/* City */}
      <div className="form-control mb-4 relative">
        <label className="label">City</label>
        <select
          className="input input-bordered w-full appearance-none pr-10"
          value={formData.city || ''}
          onChange={e => setFormData({ ...formData, city: e.target.value })}
        >
          <option value="">Select City</option>
          <option value="Abu Dhabi">Abu Dhabi</option>
          <option value="Dubai">Dubai</option>
          <option value="Sharjah">Sharjah</option>
          <option value="Ajman">Ajman</option>
          <option value="Umm Al Quwain">Umm Al Quwain</option>
          <option value="Ras Al Khaimah">Ras Al Khaimah</option>
          <option value="Fujairah">Fujairah</option>
        </select>
        <ChevronDownIcon className="w-5 h-5 absolute right-3 top-10 pointer-events-none text-gray-500" />
      </div>

      {/* Address */}
      <div className="form-control mb-4">
        <label className="label">Address</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formData.address || ''}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      {/* Contact Number */}
      <div className="form-control mb-4">
        <label className="label">Contact Number</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formData.contact_number || ''}
          onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
        />
      </div>

      {/* Show Contact Toggle */}
      <div className="form-control mb-6">
        <label className="label flex justify-between">
          <span>Show Contact Number?</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={formData.show_contact_number === true}
            onChange={() =>
              setFormData({ ...formData, show_contact_number: !formData.show_contact_number })
            }
          />
        </label>
      </div>

      {/* Dynamic Fields */}
      {dynamicFields.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4">Additional Information</h3>
          {dynamicFields.map(field => {
            const value = formData.dynamic_fields.find(f => f.field_id === field.id)?.value || '';

            return (
              <div key={field.id} className="form-control mb-4">
                <label className="label">{field.field_name}</label>

                {/* Text/Number */}
                {field.field_type === 'text' || field.field_type === 'number' ? (
                  <input
                    type={field.field_type}
                    className="input input-bordered"
                    value={value}
                    onChange={e => handleDynamicFieldChange(field.id, e.target.value)}
                  />

                ) : field.field_type === 'select' ? (
                  // Custom searchable dropdown
                  <div className="relative">
                    <input
                      type="text"
                      className="input input-bordered w-full pr-10"
                      placeholder="Search and select..."
                      value={search[field.id] !== undefined ? search[field.id] : value}
                      onFocus={() => setSearch(prev => ({ ...prev, [field.id]: '' }))}
                      onChange={e =>
                        setSearch(prev => ({ ...prev, [field.id]: e.target.value }))
                      }
                    />
                    <ChevronDownIcon className="w-5 h-5 absolute right-3 top-3.5 pointer-events-none text-gray-500" />
                    {search[field.id] !== undefined && (
                      <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow">
                        {(field.options || [])
                          .filter(opt =>
                            opt.value.toLowerCase().includes((search[field.id] || '').toLowerCase())
                          )
                          .map((opt, i) => (
                            <li
                              key={i}
                              className="cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white"
                              onMouseDown={() => {
                                handleDynamicFieldChange(field.id, opt.value);
                                setSearch(prev => {
                                  const updated = { ...prev };
                                  delete updated[field.id];
                                  return updated;
                                });
                              }}
                            >
                              {opt.value}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                ) : field.field_type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={value === 'Yes'}
                    onChange={e =>
                      handleDynamicFieldChange(field.id, e.target.checked ? 'Yes' : 'No')
                    }
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end">
        <button onClick={next} className="btn btn-primary">Continue</button>
      </div>
    </div>
  );
}
