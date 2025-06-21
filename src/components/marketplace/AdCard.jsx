// src/components/AdCard.jsx
import React from "react";

const AdCard = ({ ad }) => {
  return (
    <div className="card card-compact bg-base-100 shadow-md hover:shadow-lg transition-all duration-300">
      <figure>
        <img src={ad.image} alt={ad.title} className="h-40 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-base">{ad.title}</h2>
        <p className="text-primary font-bold">${ad.price}</p>
        <p className="text-sm text-gray-500">{ad.location} · {ad.date}</p>
        <div className="card-actions justify-between mt-2">
          <button className="btn btn-xs btn-primary">View</button>
          <button className="btn btn-xs btn-outline btn-secondary">Contact</button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
