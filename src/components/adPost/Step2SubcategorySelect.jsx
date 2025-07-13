import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '../../api/axios';

export default function Step2SubcategorySelect({ formData, setFormData, next, back }) {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (formData.category_id) {
      api.get(`/categories/${formData.category_id}/subcategories`)
        .then(res => setSubcategories(res.data));
    }
  }, [formData.category_id]);

  const handleSelect = (id) => {
    setFormData({ ...formData, subcategory_id: id });
    next();
  };

  return (
    <div className="mt-8">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-center mb-2">Select a Subcategory</h2>

      {/* Back Arrow */}
      <div className="mb-8">
        <button onClick={back} className="flex items-center text-sm text-gray-600 hover:text-black">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Subcategory List */}
      <ul className="menu w-full">
        {subcategories.map(sub => (
          <li key={sub.id} className="border-b border-base-300">
            <a
              onClick={() => handleSelect(sub.id)}
              className="py-3 px-2 hover:bg-base-200 transition-colors cursor-pointer"
            >
              {sub.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
