import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from "use-debounce";
import api from '../../api/axios';
import Header from '../../components/shared/Header';
import Footer from '../../components/marketplace/Footer';
import Hero from '../../components/marketplace/Hero';
import AdCard from '../../components/marketplace/AdCard';
import CategoryFilters from '../../components/marketplace/CategoryFilters';

export default function AdSearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const keywordParam = queryParams.get("keyword") || "";
  const cityParam = queryParams.get("city") || "";
  const categoryParam = queryParams.get("category_id") || "";

  const [ads, setAds] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [detectedCategoryId, setDetectedCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const [debouncedFilterValues] = useDebounce(filterValues, 400); // Debounce value

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch search results
  const fetchResults = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keywordParam) params.append("keyword", keywordParam);
      if (cityParam) params.append("city", cityParam);
      if (categoryParam) params.append("category_id", categoryParam);
      params.append("page", page);

      // Attach filters
      Object.entries(debouncedFilterValues).forEach(([fieldId, value]) => {
        if (value) params.append(`filters[${fieldId}]`, value);
      });

      const response = await api.get(`/search-results?${params.toString()}`);
      setAds(response.data.ads);
      setTotal(response.data.total);
      setDetectedCategoryId(response.data.detected_category_id);
      setCurrentPage(page);
      setLastPage(response.data.last_page || 1);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch based on keyword/city/category
  useEffect(() => {
    fetchResults(1);
  }, [keywordParam, cityParam, categoryParam]);

  // ✅ Refetch ads when filters change (debounced)
  useEffect(() => {
    fetchResults(1);
  }, [debouncedFilterValues]);

  // ✅ Load dynamic filters for detected or selected category
  useEffect(() => {
    const loadFilters = async (categoryIdToLoad) => {
      try {
        const res = await api.get(`/categories/${categoryIdToLoad}/filters`);
        setFilters(res.data);
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    };

    if (categoryParam) {
      loadFilters(categoryParam);
    } else if (detectedCategoryId) {
      loadFilters(detectedCategoryId);
    }
  }, [categoryParam, detectedCategoryId]);

  const handleFilterChange = (fieldId, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilterValues({});
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) fetchResults(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) fetchResults(currentPage - 1);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 mt-2">

        <Hero
          defaultKeyword={keywordParam}
          defaultCity={cityParam}
          defaultCategory={categoryParam}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

          {/* ✅ Sidebar Filters */}
          <div className="md:col-span-1 bg-gray-100 p-4 rounded space-y-4">
            <h3 className="font-bold text-lg">Filters</h3>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-5 bg-gray-300 rounded w-full" />
                ))}
              </div>
            ) : (
              <CategoryFilters
                filters={filters}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
              />
            )}

            {filters.length > 0 && (
              <div className="flex flex-col gap-2">
                {/* Optional: keep these or hide them */}
                <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* ✅ Ads Section */}
          <div className="md:col-span-3 space-y-4">
            {loading ? (
              <>
                <p className="font-semibold text-gray-600">Loading ads...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-200 rounded shadow p-4 h-48"
                    />
                  ))}
                </div>
              </>
            ) : total === 0 ? (
              <p>No ads found.</p>
            ) : (
              <>
                <p className="font-semibold text-gray-600">Total: {total} ads found</p>

                {/* 🔁 Split ads by user_type */}
                {(() => {
                  const adminAffiliateAds = ads.filter(ad => ad.user_type === 'admin' && (ad.is_affiliate === true || ad.is_affiliate === 1));
                  const companyAds = ads.filter(ad => ad.user_type === 'company');
                  const individualAds = ads.filter(ad => ad.user_type === 'individual');

                  return (
                    <>
                      {/* 🔰 Sponsored Ads by Admin */}
                      {adminAffiliateAds.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold mb-2">Online Ads</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {adminAffiliateAds.map(ad => (
                              <AdCard key={`admin-${ad.id}`} ad={ad} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 🏢 Company Ads */}
                      {companyAds.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold mb-2">Local Business Ads</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {companyAds.map(ad => (
                              <AdCard key={`company-${ad.id}`} ad={ad} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 👤 Individual Ads */}
                      {individualAds.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold mb-2">Used Items</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {individualAds.map(ad => (
                              <AdCard key={`user-${ad.id}`} ad={ad} />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
                {/* Pagination Controls */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`btn btn-sm ${currentPage === 1 ? "btn-disabled" : "btn-outline"}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === lastPage}
                    className={`btn btn-sm ${currentPage === lastPage ? "btn-disabled" : "btn-outline"}`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

