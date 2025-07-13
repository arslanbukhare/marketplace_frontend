import React, { useState, useRef } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Step4Images({ formData, setFormData, next, back }) {
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();

  const handleImageSelect = (files) => {
    const fileArray = Array.from(files);
    setFormData({ ...formData, images: fileArray });

    const previewUrls = fileArray.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelect(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-2">Upload Images</h2>

      {/* Back Arrow */}
            <div className="mb-8">
                    <button onClick={back} className="flex items-center text-sm text-gray-600 hover:text-black">
                      <ArrowLeftIcon className="h-5 w-5 mr-1" />
                      Back
                    </button>
                  </div>

      {/* Upload Area */}
      <div className="form-control mb-6">
        <label className="label mb-2 font-semibold">Choose Images</label>

        <div
          className={`border-2 border-dashed rounded-xl p-6 transition bg-base-100 shadow-sm ${
            isDragging ? 'border-primary bg-primary/10' : 'border-neutral'
          } cursor-pointer text-center`}
          onClick={() => inputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            ref={inputRef}
            onChange={(e) => handleImageSelect(e.target.files)}
            className="hidden"
          />

          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4M7 10l5 5m0 0l5-5m-5 5V4" />
          </svg>
          <p className="text-sm text-base-content">
            Click or drag & drop images here to upload
          </p>
        </div>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {previews.map((src, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden shadow">
              <img src={src} alt={`Preview ${index}`} className="w-full h-40 object-cover" />
              <button
                onClick={() => {
                  const updatedPreviews = previews.filter((_, i) => i !== index);
                  const updatedImages = formData.images.filter((_, i) => i !== index);
                  setPreviews(updatedPreviews);
                  setFormData({ ...formData, images: updatedImages });
                }}
                className="absolute top-1 right-1 bg-white/80 text-red-600 hover:text-red-800 rounded-full btn btn-xs btn-circle"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <button onClick={next} className="btn btn-primary">Continue</button>
      </div>
    </div>
  );
}
