import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Step1CategorySelect({ formData, setFormData, next }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  const handleCategorySelect = (id) => {
    setFormData({ ...formData, category_id: id, subcategory_id: '' });
    next(); // Move to next step after selection
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Select a Category</h2>
      <p className="text-center text-gray-600 mb-8">Please Choose a category for your ad</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="card bg-base-100 shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="card-body items-center text-center p-4">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${cat.icon_url}`}
                alt={cat.name}
                className="w-16 h-16 object-contain mb-3"
              />
              <h3 className="text-md font-medium">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
