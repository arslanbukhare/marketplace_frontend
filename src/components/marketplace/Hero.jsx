import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import debounce from 'lodash.debounce';

export default function Hero({ defaultKeyword = "", defaultCity = "", defaultCategory = "" }) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [city, setCity] = useState(defaultCity);
  const [category, setCategory] = useState(defaultCategory);
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"];

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

  const fetchSuggestions = debounce(async (value) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await api.get(`/search-suggestions?keyword=${value}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 300);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (city) params.append("city", city);
    if (category) params.append("category_id", category);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative w-full bg-base-100 rounded-lg shadow p-4 space-y-3">

      <form onSubmit={handleSearchSubmit}>

        {/* Search Bar with inline City & Category Dropdowns */}
        <div className="flex gap-2">

          {/* City Dropdown */}
          <div className="dropdown w-1/4">
            <label tabIndex={0} className="btn btn-sm btn-outline w-full text-left">
              {city ? city : "City"}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded w-52 max-h-60 overflow-y-auto">
              <li onClick={() => setCity("")}><a>All Cities</a></li>
              {cities.map((c) => (
                <li key={c} onClick={() => setCity(c)}>
                  <a>{c}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Dropdown */}
          <div className="dropdown w-1/4">
            <label tabIndex={0} className="btn btn-sm btn-outline w-full text-left">
              {category
                ? categories.find((cat) => cat.id == category)?.name || "Category"
                : "Category"}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded w-52 max-h-60 overflow-y-auto">
              <li onClick={() => setCategory("")}><a>All Categories</a></li>
              {categories.map((cat) => (
                <li key={cat.id} onClick={() => setCategory(cat.id)}>
                  <a>{cat.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Search Input */}
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Search ads..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="input input-bordered input-sm w-full"
            />

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute z-20 bg-base-100 border w-full mt-1 shadow rounded max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onClick={() =>
                      navigate(`/search?keyword=${encodeURIComponent(s.title)}&category_id=${s.category_id}`)
                    }
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {s.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search Button */}
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </div>
      </form>

    </div>
  );
}

