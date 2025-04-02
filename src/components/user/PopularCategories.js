import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../config/axiosConfig";

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category/getCategorys");
      setCategories(response?.data?.categoryData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="mx-auto max-w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
        {categories?.map((category) => (
          <Link
            key={category._id}
            to={`/shop?category=${encodeURIComponent(category.categoryName)}`}
            className="group"
          >
            <div className="relative h-48 sm:h-56 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 p-4 flex flex-col items-center justify-center text-center border border-gray-200 hover:border-blue-200 hover:shadow-lg">
              <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {getCategoryIcon(category.categoryName)}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {category.categoryName}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {category.description || `Explore our ${category.categoryName.toLowerCase()} collection`}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Categories */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories?.slice(0, 2).map((category) => (
          <Link
            key={category._id}
            to={`/shop?category=${encodeURIComponent(category.categoryName)}`}
            className="group"
          >
            <div className="relative h-64 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90 group-hover:opacity-95 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">
                    {getCategoryIcon(category.categoryName)}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {category.categoryName}
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    {category.description || `Explore our exclusive ${category.categoryName.toLowerCase()} collection`}
                  </p>
                  <span className="inline-block px-6 py-2 border-2 border-white rounded-full hover:bg-white hover:text-gray-800 transition-all">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    // Room types
    case "Living Room":
      return "🏠";
    case "Bedroom":
      return "🛏️";
    case "Dining Room":
      return "🍽️";
    case "Home Office":
      return "💼";
    case "Kitchen":
      return "🍳";
    case "Bathroom":
      return "🚿";
    case "Outdoor":
      return "🌳";
    case "Kids Room":
      return "🧸";
    case "Storage":
      return "📦";
    case "Entryway":
      return "🚪";

    // Furniture categories
    case "Sofas & Couches":
      return "🛋️";
    case "Coffee Tables":
      return "☕";
    case "TV Stands":
      return "📺";
    case "Accent Chairs":
      return "💺";
    case "Side Tables":
      return "🛋️"; // Similar to Sofas & Couches
    case "Beds & Mattresses":
      return "🛏️";
    case "Dressers":
      return "👗";
    case "Nightstands":
      return "🛏️"; // Typically beside beds
    case "Wardrobes":
      return "👚";
    case "Vanities":
      return "💄";
    case "Dining Tables":
      return "🍽️";
    case "Dining Chairs":
      return "🍴";
    case "Buffets & Sideboards":
      return "🥂";
    case "Bar Stools":
      return "🍸";
    case "Wine Racks":
      return "🍷";
    case "Desks":
      return "🖥️";
    case "Office Chairs":
      return "🪑";
    case "Bookcases":
      return "📚";
    case "Filing Cabinets":
      return "🗄️";
    case "Desk Lamps":
      return "💡";
    case "Kitchen Islands":
      return "🍽️";
    case "Bar Carts":
      return "🍹";
    case "Kitchen Storage":
      return "🍴";
    case "Breakfast Nooks":
      return "☕";
    case "Bathroom Vanities":
      return "🚿";
    case "Storage Cabinets":
      return "📦";
    case "Mirrors":
      return "🪞";
    case "Shower Benches":
      return "🛁";
    case "Patio Sets":
      return "🪑";
    case "Outdoor Chairs":
      return "🪑";
    case "Garden Benches":
      return "🌳";
    case "Outdoor Tables":
      return "🍽️";
    case "Hammocks":
      return "🌴";
    case "Kids Beds":
      return "🛏️";
    case "Study Tables":
      return "📚";
    case "Storage Units":
      return "📦";
    case "Play Tables":
      return "🎲";
    case "Bean Bags":
      return "🛋️";
    case "Shelving Units":
      return "📚";
    case "Shoe Racks":
      return "👞";
    case "Wall Shelves":
      return "📚";
    case "Coat Racks":
      return "👚";
    case "Console Tables":
      return "🖥️";
    case "Hall Trees":
      return "🌲";
    case "Benches":
      return "💺";
    case "Key Holders":
      return "🔑";
    case "Umbrella Stands":
      return "☂️";

    // Default case for uncategorized
    default:
      return "📦";
  }
};



export default PopularCategories; 