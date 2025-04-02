import React, { useState, useEffect } from "react";
import bannerImg from "../../assets/images/furniShop.jpg";
import api from "../../config/axiosConfig";
import { Link } from "react-router-dom";

const PopularBrands = () => {
  const [brandDetails, setBrandDetails] = useState([]);

  const fetchingAllBrands = async () => {
    try {
      const response = await api.get("/brand/getAllBrands");
      setBrandDetails(response?.data?.brandData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingAllBrands();
  }, []);

  return (
    <div className="mx-auto max-w-full">
      {/* Popular Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brandDetails?.map((brand) => (
          <Link
            key={brand._id}
            to={`/shop?brands=${encodeURIComponent(brand.brandName)}`}
            className="group"
          >
            {/* Brand Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 p-4 flex flex-col items-center justify-center text-center border border-gray-200 hover:border-blue-200 hover:shadow-lg">
              {/* Brand Logo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-gray-200 p-4 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={brand?.logo}
                  alt={brand.brandName}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Brand Name */}
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {brand.brandName}
              </h3>
              {/* Brand Description */}
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {brand.brandTitle || `Explore our ${brand.brandName.toLowerCase()} collection`}
              </p>
              {/* Hover Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Promotional Banner */}
      <div className="relative overflow-hidden rounded-xl mt-12">
        <img
          src={bannerImg}
          alt="Sneaker"
          className="w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center pl-8 sm:pl-12 md:pl-16 lg:pl-20 text-white">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
            Limited time only
          </p>
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-8xl font-extrabold mb-3 sm:mb-4 md:mb-6 leading-tight">
            Get 30% off
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-md lg:max-w-lg xl:max-w-xl">
            Sneakers made with your comfort in mind so you can put all of your
            focus into your next session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularBrands;
