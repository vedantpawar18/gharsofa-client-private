import React, {useEffect, useState} from "react";
import PopularBrands from "../../components/user/PopularBrands";
import PopularCategories from "../../components/user/PopularCategories";
import FurnitureCard from "../../components/user/FurnitureCard";
import api from "../../config/axiosConfig";
import {useDispatch} from "react-redux";
import {fetchWishList} from "../../redux/wishListSlice";
import {fetchCartDetails} from "../../redux/cartSlice";
import FurnitureCardShimmer from "../../components/user/FurnitureCardShimmer";
import OfferCarousel from "../../components/user/OfferCarousel";

const HomePage = () => {
  const dispatch = useDispatch();
  const [newArrival, setNewArrival] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);  // state to manage visibility  

  const handleShowAll = () => {
    setShowAll(true);
  };

  useEffect(() => {
    dispatch(fetchWishList());
  }, [dispatch]);

  const fetchNewArrival = async () => {
    try {
      const response = await api.get("product/getProducts");
      setNewArrival(response?.data?.products);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewArrival();
  }, []);

  const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center mb-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Offer Carousel */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <OfferCarousel />
      </section>

      {/* Categories Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <SectionTitle 
          title="Shop by Category" 
          subtitle="Explore our wide range of furniture categories"
        />
        <PopularCategories />
      </section>

      {/* Brands Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-50 to-white">
        <SectionTitle 
          title="Popular Brands" 
          subtitle="Discover quality furniture from top brands"
        />
        <PopularBrands />
      </section>

      {/* New Arrivals Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <SectionTitle 
          title="New Arrivals" 
          subtitle="Check out our latest furniture collections"
        />
          <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => <FurnitureCardShimmer key={index} />)
          : (showAll ? newArrival : newArrival.slice(0, 4)).map((productData) => (
              <FurnitureCard key={productData?._id} productData={productData} />
            ))}
      </div>

      {/* Show "See All" button if there are more than 4 items */}
      {newArrival.length > 4 && !showAll && (
        <button
          onClick={handleShowAll}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
        >
          See All
        </button>
      )}
    </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 opacity-90">Subscribe to our newsletter for exclusive offers and furniture inspiration</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-gray-800 rounded-full font-semibold hover:bg-opacity-90 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
