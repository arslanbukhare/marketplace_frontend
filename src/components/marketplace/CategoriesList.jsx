// components/CategoryList.jsx

import {
  BuildingStorefrontIcon,
  HomeModernIcon,
  BriefcaseIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

const categories = [
  {
    icon: <BuildingStorefrontIcon className="w-5 h-5 text-blue-600" />,
    name: "Vehicles",
    subcategories: [
      "Cars",
      "Motorcycles",
      "Trucks",
      "Bicycles",
      "Vehicle Parts",
    ],
  },
  {
    icon: <HomeModernIcon className="w-5 h-5 text-green-600" />,
    name: "Property",
    subcategories: [
      "Houses for Sale",
      "Apartments for Rent",
      "Commercial",
      "Plots & Land",
      "Vacation Rentals",
    ],
  },
  {
    icon: <BriefcaseIcon className="w-5 h-5 text-yellow-600" />,
    name: "Jobs",
    subcategories: [
      "IT & Software",
      "Sales",
      "Customer Service",
      "Construction",
      "Part-time",
    ],
  },
  {
    icon: <DevicePhoneMobileIcon className="w-5 h-5 text-purple-600" />,
    name: "Electronics",
    subcategories: [
      "Mobile Phones",
      "Laptops",
      "Cameras",
      "TVs",
      "Accessories",
    ],
  },
  {
    icon: <ShoppingBagIcon className="w-5 h-5 text-pink-600" />,
    name: "Fashion",
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Shoes",
      "Watches",
      "Bags",
    ],
  },
];

const CategoryList = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-4">
                {category.icon}
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                {category.subcategories.map((sub, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-blue-500 transition">
                      {sub}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  View all →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
