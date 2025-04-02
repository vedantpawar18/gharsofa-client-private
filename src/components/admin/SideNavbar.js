import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdInventory, 
  MdShoppingCart, 
  MdPeople, 
  MdBarChart, 
  MdLocalOffer, 
  MdCategory, 
  MdAdminPanelSettings, 
  MdSettings, 
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';
import { BiSolidOffer } from "react-icons/bi";
import api from '../../config/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/authSlice';

const SideNavbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { icon: <MdDashboard />, text: "DASHBOARD", path: "/dashboard" },
    { icon: <MdInventory />, text: "PRODUCTS", path: "/dashboard/products" },
    { icon: <MdShoppingCart />, text: "ORDERS", path: "/dashboard/orders" },
    { icon: <MdPeople />, text: "CUSTOMERS", path: "/dashboard/customers" },
    { icon: <MdBarChart />, text: "SALES REPORT", path: "/dashboard/sales-report"},
    { icon: <MdLocalOffer />, text: "COUPONS", path: "/dashboard/coupons" },
    { icon: <BiSolidOffer />, text: "OFFERS", path: "/dashboard/offers" },
    { icon: <MdCategory />, text: "CATEGORY", path: "/dashboard/category" },
    { icon: <MdAdminPanelSettings />, text: "BRANDS", path: "/dashboard/brand" },
  ];

  const handleLogout = async () => {
    await api.post("users/logout");
    dispatch(logoutUser());
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-20 lg:hidden bg-white p-2 rounded-md shadow-md"
      >
        {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar */}
      <nav className={`fixed bg-white h-screen shadow-lg flex flex-col justify-between z-10 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-0 lg:w-64'
      }`}>
        <div className='px-2'>
          <div className="p-4 border-b border-gray-200 flex justify-center items-center">
            <h1 className="text-3xl font-bold">GHAR<span className="text-blue-500">SOFA</span></h1>
          </div>
          <ul className="mt-4">
            {navItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <li
                  className={`px-4 py-3 flex items-center space-x-3 cursor-pointer mb-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium whitespace-nowrap">{item.text}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Admin Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {user?.dpImage ? (
                <img
                  src={user.dpImage}
                  alt="Admin Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.firstName || 'Admin') + "&background=0D9488&color=fff";
                  }}
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'Admin')}&background=0D9488&color=fff`}
                  alt="Admin Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{user?.firstName}</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <MdLogout size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default SideNavbar;
