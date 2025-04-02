import React, {useEffect, useState} from "react";
import {FaShoppingBag} from "react-icons/fa";
import ProgressBar from "./ProgressBar";
import api from "../../../config/axiosConfig";
import BestItemCard from "./BestItemCard";

const BestItems = () => {
  const [activeFilter, setActiveFilter] = useState("Product");
  const [topProducts, setTopProducts] = useState(null);
  const [topBrands, setTopBrands] = useState(null);
  const [topCategory, setTopCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBestItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("dashboard/top-most");
      setTopProducts(response?.data?.topProducts);
      setTopBrands(response?.data?.topBrands);
      setTopCategory(response?.data?.topCategories);
    } catch (error) {
      console.error("Error fetching best items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestItems();
  }, []);

  const filters = ["Product", "Brand", "Category"];

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (activeFilter === "Product") {
      return (
        <div className="space-y-3 p-4">
          {topProducts?.map((product, index) => {
            const highestSales = Math.max(
              ...topProducts.map((p) => p.totalSales)
            );
            const percentage = (product.totalSales / highestSales) * 100;

            return (
              <BestItemCard
                key={index}
                image={product?.thumbnail}
                bestName={product?.productName}
                percentage={percentage}
                sales={product.totalSales}
                rank={index + 1}
                salePrice={product.salePrice}
              />
            );
          })}
        </div>
      );
    } else if (activeFilter === "Brand") {
      return (
        <div className="space-y-3 p-4">
          {topBrands?.map((brand, index) => {
            const highestSales = Math.max(
              ...topBrands.map((b) => b.totalSales)
            );
            const percentage = (brand.totalSales / highestSales) * 100;

            return (
              <BestItemCard
                key={index}
                image={brand?.logo}
                bestName={brand?.brandName}
                percentage={percentage}
                sales={brand.totalSales}
                rank={index + 1}
              />
            );
          })}
        </div>
      );
    } else if (activeFilter === "Category") {
      return (
        <div className="space-y-3 p-4">
          {topCategory?.map((category, index) => {
            const highestSales = Math.max(
              ...topCategory.map((c) => c.totalSales)
            );
            const percentage = (category.totalSales / highestSales) * 100;

            return (
              <BestItemCard
                key={index}
                image={false}
                bestName={category?.categoryName}
                percentage={percentage}
                sales={category.totalSales}
                rank={index + 1}
              />
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Top Performing {activeFilter}s</h2>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`text-xs sm:text-sm px-3 py-1 font-medium rounded-full transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {renderTableContent()}
      </div>
    </div>
  );
};

export default BestItems;
