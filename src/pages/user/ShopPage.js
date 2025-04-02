import React, {useEffect, useState} from "react";
import FurnitureCard from "../../components/user/FurnitureCard";
import {FaFilter} from "react-icons/fa";
import api from "../../config/axiosConfig";
import FilterComponent from "../../components/user/FilterComponent";
import {useDispatch} from "react-redux";
import {fetchWishList} from "../../redux/wishListSlice";
import FurnitureCardShimmer from "../../components/user/FurnitureCardShimmer";
import { useLocation } from "react-router-dom";
import OfferCarousel from "../../components/user/OfferCarousel";
import PopularCategories from "../../components/user/PopularCategories";

const ShopPage = ({gender, showFilter}) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(false);
  const [productDetials, setProductDetials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const categoryParam = searchParams.get("category");

  const [filters, setFilters] = useState({
    brands: [],
    categories: categoryParam ? [categoryParam] : [],
    prices: [],
    sort: "Recommended",
  });

  const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center mb-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );

  const fetchFilteredProducts = async () => {
    try {
      const params = {
        brands: filters.brands.join(","),
        categories: filters.categories.join(","),
        sort: filters.sort,
        search: searchQuery,
      };

      const response = await api.get("product/filter-items", {params});
      setLoading(false);
      setProductDetials(response?.data?.products);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
    dispatch(fetchWishList());
  }, [filters, searchQuery, dispatch]);

  // Update filters when category param changes
  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryParam]
      }));
    }
  }, [categoryParam]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({
      ...prev,
      sort: e.target.value
    }));
  };

  return (
    <div>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
     

      {/* Categories Section */}
     
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-2">

          <div
            className="flex items-center space-x-5 cursor-pointer border-2 border-gray-300 px-8 py-2"
            onClick={() => setFilter(!filter)}
          >
            <FaFilter />
            <span className="font-semibold">FILTER</span>
          </div>
          <div className="flex items-center border-2 border-gray-300 px-8 py-2">
            <span className="mr-2">Sort by :</span>
            <select
              className="form-select block w-full sm:w-auto outline-none"
              onChange={handleSortChange}
              value={filters.sort}
            >
              <option value="Recommended">Recommended</option>
              <option value="Low to High">Low to High</option>
              <option value="High to Low">High to Low</option>
              <option value="aA - zZ">aA - zZ </option>
              <option value="zZ - aA">zZ - aA </option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter Component */}
          {filter && (
            <div className="lg:w-1/4 w-full">
              <FilterComponent
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          )}

          {/* Products Container */}
          <div className={filter ? "lg:w-3/4 w-full" : "w-full"}>
            <div
              className={`grid gap-6 ${
                filter
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {loading
                ? Array(8)
                    .fill(0)
                    .map((_, index) => <FurnitureCardShimmer key={index} />)
                : productDetials?.map((productData) => (
                    <FurnitureCard
                      key={productData?._id}
                      productData={productData}
                    />
                  ))}
            </div>
          </div>
        </div>

        <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <SectionTitle 
          title="Shop by Category" 
          subtitle="Explore our wide range of furniture categories"
        />
        <PopularCategories />
      </section>
      </div>
          <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <OfferCarousel />
      </section>
    </div>
  );
};

export default ShopPage;
