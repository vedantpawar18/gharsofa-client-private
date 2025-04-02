import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {validateRegisterForm} from "../../utils/validateForms";
import api from "../../config/axiosConfig";
import { toast } from 'react-hot-toast';

const RegisterForm = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    cPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateForm = validateRegisterForm(formData);
    setErrors(validateForm);
    
    if (Object.keys(validateForm).length === 0) {
      setIsLoading(true);
      try {
        const response = await api.post("/users/register", formData);
        if(response.status === 200){
          toast.success("Registration successful");
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            CREATE AN ACCOUNT
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {errors.firstName && (
                <p className="text-red-500 text-sm px-2">{errors.firstName}</p>
              )}
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              {errors.lastName && (
                <p className="text-red-500 text-sm px-2">{errors.lastName}</p>
              )}
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              {errors.email && (
                <p className="text-red-500 text-sm px-2">{errors.email}</p>
              )}
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm px-2">{errors.phoneNumber}</p>
              )}
              <input
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              {errors.password && (
                <p className="text-red-500 text-sm px-2">{errors.password}</p>
              )}
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              {errors.cPassword && (
                <p className="text-red-500 text-sm px-2">{errors.cPassword}</p>
              )}
              <input
                type="password"
                placeholder="Confirm Password"
                name="cPassword"
                value={formData.cPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "REGISTER"}
            </button>

            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
