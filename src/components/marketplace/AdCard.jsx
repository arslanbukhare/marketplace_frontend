import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const AdCard = ({ ad }) => {
  const imageUrl = ad.first_image_url
    ? ad.first_image_url
    : "https://via.placeholder.com/300x200";

  const postedDate = ad.created_at
    ? new Date(ad.created_at).toLocaleDateString()
    : "";

  const isCompany = ad.user_type === "company";
  const isVerified = ad.company_verified === true;
  const isAffiliateAd = ad.is_affiliate === true || ad.is_affiliate === 1;
  const isAdminAd = ad.user_type === "admin";

  const renderBadges = () => (
    <>
      {/* Featured Badge */}
      {ad.is_featured == 1 && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs text-white font-semibold px-2 py-1 rounded">
          Featured
        </span>
      )}

      {/* Company Badge */}
      {isCompany && (
        <span className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600 text-xs text-white font-semibold px-2 py-1 rounded">
          {isVerified ? (
            <>
              Verified Company
              <CheckCircleIcon className="w-4 h-4 text-green-300" />
            </>
          ) : (
            <>Company</>
          )}
        </span>
      )}

      {/* Sponsored Badge for Admin Affiliate Ad */}
      {isAdminAd && isAffiliateAd && (
        <span className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
          Sponsored
        </span>
      )}
    </>
  );

  const cardContent = (
    <div className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
      {/* Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={ad.title}
          className="h-40 w-full object-cover"
        />
        {renderBadges()}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <div className="text-primary font-bold text-sm">AED {ad.price}</div>
        <div className="text-sm font-medium line-clamp-2">{ad.title}</div>
        <div className="text-xs text-gray-500">
          {ad.city} · {postedDate}
        </div>
      </div>
    </div>
  );

  // Click behavior: external URL for affiliate, internal link otherwise
  return isAdminAd && isAffiliateAd ? (
    <a
      href={ad.affiliate_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {cardContent}
    </a>
  ) : (
    <Link to={`/public-ads/${ad.id}`} className="block">
      {cardContent}
    </Link>
  );
};

export default AdCard;
