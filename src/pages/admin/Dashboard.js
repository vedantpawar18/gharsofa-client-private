import React, {useEffect, useState} from "react";
import BreadCrumbWithButton from "../../components/admin/BreadCrumbWithButton";
import {useLocation} from "react-router-dom";
import StatusCard from "../../components/admin/Dashboard/StatusCard";
import SaleChart from "../../components/admin/Dashboard/SaleChart";
import BestItems from "../../components/admin/Dashboard/BestItems";
import api from "../../config/axiosConfig";
import { FaSpinner } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";

const Dashboard = () => {
  const location = useLocation();
  const [currentMonthData, setCurrentMonthData] = useState({});
  const [lastMonthData, setLastMonthData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/dashboard/status");
        const data = response.data.data;

        // Only set data if it's not zero or undefined
        const currentData = {
          totalSales: data.totalSales || 0,
          totalOrders: data.totalOrders || 0,
          totalProductsSold: data.totalProductsSold || 0,
          totalRevenue: data.totalRevenue || 0,
          totalProducts: data.totalProducts || 0,
        };

        const lastMonthData = {
          lastMonthSales: data.lastMonthSales || 0,
          lastMonthOrders: data.lastMonthOrders || 0,
          lastMonthProductsSold: data.lastMonthProductsSold || 0,
          lastMonthRevenue: data.lastMonthRevenue || 0,
        };

        setCurrentMonthData(currentData);
        setLastMonthData(lastMonthData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculatePercentageChange = (current, last) => {
    if (last === 0) return current === 0 ? 0 : 100;
    return ((current - last) / last) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <IoWarning className="text-6xl text-red-500 mb-4" />
        <p className="text-xl text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <BreadCrumbWithButton
        noButton={false}
        componentLocation={"Dashboard"}
        location={location.pathname}
        showSearch={false}
      />
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatusCard
            cardName="Total Sales"
            color="#3498db"
            totalAmout={currentMonthData.totalSales}
            progressValueProp={calculatePercentageChange(
              currentMonthData.totalSales,
              lastMonthData.lastMonthSales
            )}
            icon="💰"
            subtitle={`${currentMonthData.totalOrders} orders this month`}
          />
          <StatusCard
            cardName="Total Orders"
            color="#E85C0D"
            totalAmout={currentMonthData.totalOrders}
            progressValueProp={calculatePercentageChange(
              currentMonthData.totalOrders,
              lastMonthData.lastMonthOrders
            )}
            icon="📦"
            subtitle={`${currentMonthData.totalProductsSold} products sold`}
          />
          <StatusCard
            cardName="Total Products"
            color="#2ecc71"
            totalAmout={currentMonthData.totalProducts}
            progressValueProp={calculatePercentageChange(
              currentMonthData.totalProductsSold,
              lastMonthData.lastMonthProductsSold
            )}
            icon="🏷️"
            subtitle={`${currentMonthData.totalProductsSold} sold this month`}
          />
          <StatusCard
            cardName="Total Revenue"
            color="#8e44ad"
            totalAmout={currentMonthData.totalRevenue}
            progressValueProp={calculatePercentageChange(
              currentMonthData.totalRevenue,
              lastMonthData.lastMonthRevenue
            )}
            icon="💵"
            subtitle={`₹${(currentMonthData.totalRevenue / currentMonthData.totalOrders).toLocaleString()} avg. order`}
          />
        </div>

        {/* Charts and Best Items Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <SaleChart />
          </div>
          <div className="bg-white shadow rounded-lg h-[400px] overflow-y-auto hide-scrollbar">
            <BestItems />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
