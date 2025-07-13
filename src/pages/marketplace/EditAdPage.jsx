import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditAdPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [form, setForm] = useState({
    category_id: '',
    subcategory_id: '',
    title: '',
    description: '',
    price: '',
    city: '',
    address: '',
    show_contact_number: false,
    dynamic_fields: [],
  });
  const [contactNumber, setContactNumber] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/ads/${id}`)
      .then(({ data }) => {
        setAd(data);
        setForm({
          category_id: data.category_id,
          subcategory_id: data.subcategory_id || '',
          title: data.title,
          description: data.description || '',
          price: data.price || '',
          city: data.city,
          address: data.address || '',
          show_contact_number: data.show_contact_number,
          dynamic_fields: data.dynamic_fields.map(field => ({
            field_id: field.field.id,
            value: field.value
          })),
        });
        setContactNumber(data.contact_number);
        setExistingImages(data.images || []);
      })
      .catch(error => console.error('Error loading ad:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDynamicFieldChange = (index, value) => {
    const updatedFields = [...form.dynamic_fields];
    updatedFields[index].value = value;
    setForm(prev => ({
      ...prev,
      dynamic_fields: updatedFields
    }));
  };

  const handleImageRemove = (imgId) => {
    setImagesToRemove(prev => [...prev, imgId]);
    setExistingImages(prev => prev.filter(img => img.id !== imgId));
  };

  const handleNewImages = (e) => {
    setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'dynamic_fields') {
        value.forEach((item, index) => {
          formData.append(`dynamic_fields[${index}][field_id]`, item.field_id);
          formData.append(`dynamic_fields[${index}][value]`, item.value);
        });
      } else {
        formData.append(key, value);
      }
    });

    newImages.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    imagesToRemove.forEach((id, index) => {
      formData.append(`remove_image_ids[${index}]`, id);
    });

    try {
      await api.post(`/ads/${id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/ads/${id}`);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error updating ad:', error);
      }
    }
  };

  if (!ad) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-4">Edit Ad</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

        {/* Title */}
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && <p className="text-red-500">{errors.title[0]}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block font-semibold">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block font-semibold">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Show Contact Number */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="show_contact_number"
            checked={form.show_contact_number}
            onChange={handleInputChange}
          />
          <label className="font-medium">Show Contact Number Publicly</label>
        </div>

        {/* Dynamic Fields */}
        <div>
          <label className="block font-semibold mb-1">Dynamic Fields</label>
          {form.dynamic_fields.map((field, index) => (
            <input
              key={index}
              type="text"
              value={field.value}
              onChange={(e) => handleDynamicFieldChange(index, e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder={`Field ${index + 1}`}
            />
          ))}
        </div>

        {/* Unified Images Section */}
        <div>
          <label className="block font-semibold">Images</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {/* Existing Images */}
            {existingImages.map(img => (
              <div key={img.id} className="relative">
                <img
                  src={img.full_url || `/storage/${img.image_path}`}
                  alt="Ad"
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(img.id)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                >
                  X
                </button>
              </div>
            ))}

            {/* New Image Previews */}
            {newImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  alt="New"
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <input
            type="file"
            multiple
            onChange={handleNewImages}
            className="mt-2 w-full border rounded px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Ad
        </button>
      </form>
    </div>
  );
};

export default EditAdPage;
