import React from "react";

export default function CategoryFilters({ filters, filterValues, onFilterChange }) {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow p-4 space-y-4">

      <h3 className="text-lg font-bold">Filter By Attributes</h3>

      {filters.map((filter) => {
        const fieldValue = filterValues[filter.id] || "";

        // For dropdown (select fields with options)
        if (filter.field_type === "select" && filter.options.length > 0) {
          return (
            <div key={filter.id} className="form-control">
              <label className="label">
                <span className="label-text">{filter.field_name}</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={fieldValue}
                onChange={(e) => onFilterChange(filter.id, e.target.value)}
              >
                <option value="">All</option>
                {filter.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        // For text/number fields
        return (
          <div key={filter.id} className="form-control">
            <label className="label">
              <span className="label-text">{filter.field_name}</span>
            </label>
            <input
              type="text"
              placeholder={`Enter ${filter.field_name}`}
              value={fieldValue}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>
        );
      })}
    </div>
  );
}
