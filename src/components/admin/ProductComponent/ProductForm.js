import React, {useEffect, useState} from "react";
import BreadCrumbWithButton from "../BreadCrumbWithButton";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {FaImage, FaTimes, FaPlus} from "react-icons/fa";
import ImageUploadSection from "./ImageUploadSection";
import {useDispatch, useSelector} from "react-redux";
import {getCategoryItems} from "../../../redux/categorySlice";
import api from "../../../config/axiosConfig";
import {toast, Toaster} from "react-hot-toast";
import {validateProductForm} from "../../../utils/validateForms";
import {dotPulse} from "ldrs";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  const {productId} = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [errors, setErrors] = useState({});
  const [getBrands, setGetBrands] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    brand: "",
    roomType: "",
    materials: [],
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: "cm"
    },
    colors: [],
    stock: "",
    regularPrice: "",
    salePrice: "",
    assemblyRequired: true,
    warranty: "",
  });

  const availableColors = [
    "Black", "White", "Brown", "Gray", "Beige", 
    "Navy", "Red", "Green", "Blue", "Yellow",
    "Orange", "Purple", "Pink", "Natural", "Walnut",
    "Oak", "Mahogany", "Cherry", "Maple", "Teak"
  ];

  const availableMaterials = [
    "Wood", "Metal", "Glass", "Leather", "Fabric", 
    "Plastic", "Marble", "Stone"
  ];

  const [imageData, setImageData] = useState({
    thumbnail: null,
    galleryImages: [],
  });

  const fetchBrands = async () => {
    const response = await api.get("/brand/getAllBrands");
    setGetBrands(response?.data?.brandData);
  };

  useEffect(() => {
    dispatch(getCategoryItems());
    fetchBrands();

    if (productId) {
      setIsEditing(true);
      fetchProductDetail(productId);
    }
  }, [dispatch, productId]);

  const fetchProductDetail = async (id) => {
    try {
      const response = await api.get(`product/product-detail/${id}`);
      const product = response?.data?.productDetail;
      setFormData({
        productName: product?.productName,
        description: product?.description,
        category: product?.category?._id,
        brand: product?.brand?._id,
        roomType: product?.roomType,
        materials: product?.materials || [],
        dimensions: product?.dimensions,
        colors: product?.colors || [],
        regularPrice: product?.regularPrice,
        salePrice: product?.salePrice,
        stock: product?.stock,
        assemblyRequired: product?.assemblyRequired,
        warranty: product?.warranty,
      });
      setImageData({
        thumbnail: product.thumbnail,
        galleryImages: product?.gallery,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getBrandLogo = (brandId) => {
    const brand = getBrands?.find((brand) => brand?._id === brandId);
    return brand ? brand.logo : null;
  };

  const handleShowProducts = () => {
    navigate("/dashboard/products");
  };

  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target;
    if (name.startsWith('dimensions.')) {
      const dimensionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleMaterialToggle = (material) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const handleImageData = (data) => {
    setImageData(data);
  };

  const {thumbnail, galleryImages} = imageData;

  const submitProductForm = async () => {
    const validateForm = validateProductForm(formData);
    setErrors(validateForm);
    if (Object.keys(validateForm).length === 0) {
      setIsLoading(true);
      setIsError(false);
    }
    try {
      const data = {...formData, ...imageData};
      let response;
      if (isEditing) {
        response = await api.put(`product/product-modify/${productId}`, data);
      } else {
        response = await api.post("product/addProduct", data);
      }
      if (response.status === 200) {
        toast.success(response.data.message);
        setFormData({
          productName: "",
          description: "",
          category: "",
          brand: "",
          roomType: "",
          materials: [],
          dimensions: {
            length: "",
            width: "",
            height: "",
            unit: "cm"
          },
          colors: [],
          stock: "",
          regularPrice: "",
          salePrice: "",
          assemblyRequired: true,
          warranty: "",
        });
        setImageData({
          thumbnail: null,
          galleryImages: [],
        });
        setIsLoading(false);
        navigate("/dashboard/products");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      toast.error(error.response?.data?.message || "Failed to save product. Please try again.");
    }
  };

  const handleRetry = () => {
    setIsError(false);
    setImageData({
      thumbnail: null,
      galleryImages: [],
    });
  };

  useEffect(() => {
    dotPulse.register();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <BreadCrumbWithButton
        componentLocation={isEditing ? "Edit Product" : "Add New Product"}
        location={location.pathname}
        goback={"/dashboard/products"}
        buttonName={"Show Products"}
        buttonNavigate={handleShowProducts}
      />
      <div className="px-10 mt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-white py-10 px-5 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <form>
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className={`text-sm font-medium flex ${errors.productName ? "text-red-500" : "text-gray-700"}`}>
                  Product Name
                  {errors.productName && <p className="text-red-500 text-sm px-2">{errors.productName}</p>}
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className={`text-sm font-medium flex ${errors.description ? "text-red-500" : "text-gray-700"}`}>
                  Description
                  {errors.description && <p className="text-red-500 text-sm px-2">{errors.description}</p>}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              {/* Category */}
              <div>
                <label className={`text-sm font-medium flex ${errors.category ? "text-red-500" : "text-gray-700"}`}>
                  Category
                  {errors.category && <p className="text-red-500 text-sm px-2">{errors.category}</p>}
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category) => (
                    <option key={category?._id} value={category?._id}>
                      {category?.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                  {getBrandLogo(formData.brand) ? (
                    <img
                      src={getBrandLogo(formData.brand)}
                      alt={`${formData.brand} logo`}
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <FaImage className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <label className={`text-sm font-medium flex ${errors.brand ? "text-red-500" : "text-gray-700"}`}>
                    Brand Name
                    {errors.brand && <p className="text-red-500 text-sm px-2">{errors.brand}</p>}
                  </label>
                  <select
                    id="brandName"
                    name="brand"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.brand}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Brand</option>
                    {getBrands?.map((brand) => (
                      <option key={brand._id} value={brand?._id}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className={`text-sm font-medium flex ${errors.roomType ? "text-red-500" : "text-gray-700"}`}>
                  Room Type
                  {errors.roomType && <p className="text-red-500 text-sm px-2">{errors.roomType}</p>}
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Room Type</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Office">Office</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Dining Room">Dining Room</option>
                </select>
              </div>

              {/* Materials */}
              <div className="mb-4">
                <label className={`text-sm font-medium flex ${errors.materials ? "text-red-500" : "text-gray-700"}`}>
                  Materials (Select all that apply)
                  {errors.materials && <p className="text-red-500 text-sm px-2">{errors.materials}</p>}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {availableMaterials.map((material) => (
                    <button
                      key={material}
                      type="button"
                      onClick={() => handleMaterialToggle(material)}
                      className={`px-4 py-2 rounded ${
                        formData.materials.includes(material)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors Selection */}
              <div className="mb-4">
                <label className={`text-sm font-medium flex ${errors.colors ? "text-red-500" : "text-gray-700"}`}>
                  Colors (Select all that apply)
                  {errors.colors && <p className="text-red-500 text-sm px-2">{errors.colors}</p>}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorToggle(color)}
                      className={`px-4 py-2 rounded ${
                        formData.colors.includes(color)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className={`text-sm font-medium flex ${errors.dimensions ? "text-red-500" : "text-gray-700"}`}>
                  Dimensions
                  {errors.dimensions && <p className="text-red-500 text-sm px-2">{errors.dimensions}</p>}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="dimensions.length"
                    placeholder="Length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    placeholder="Width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  <input
                    type="number"
                    name="dimensions.height"
                    placeholder="Height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <select
                  name="dimensions.unit"
                  value={formData.dimensions.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="inches">Inches</option>
                </select>
              </div>

              {/* Stock */}
              <div>
                <label className={`text-sm font-medium flex ${errors.stock ? "text-red-500" : "text-gray-700"}`}>
                  Stock
                  {errors.stock && <p className="text-red-500 text-sm px-2">{errors.stock}</p>}
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              {/* Prices */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className={`text-sm font-medium flex ${errors.regularPrice ? "text-red-500" : "text-gray-700"}`}>
                    Regular Price
                    {errors.regularPrice && <p className="text-red-500 text-sm px-2">{errors.regularPrice}</p>}
                  </label>
                  <input
                    type="number"
                    id="regularPrice"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="w-1/2">
                  <label className={`text-sm font-medium flex ${errors.salePrice ? "text-red-500" : "text-gray-700"}`}>
                    Sale Price
                    {errors.salePrice && <p className="text-red-500 text-sm px-2">{errors.salePrice}</p>}
                  </label>
                  <input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              {/* Assembly Required */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="assemblyRequired"
                    checked={formData.assemblyRequired}
                    onChange={(e) => setFormData(prev => ({...prev, assemblyRequired: e.target.checked}))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Assembly Required</span>
                </label>
              </div>

              {/* Warranty */}
              <div>
                <label className={`text-sm font-medium flex ${errors.warranty ? "text-red-500" : "text-gray-700"}`}>
                  Warranty
                  {errors.warranty && <p className="text-red-500 text-sm px-2">{errors.warranty}</p>}
                </label>
                <input
                  type="text"
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., 1 Year Limited Warranty"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/2">
          <ImageUploadSection
            onImageData={handleImageData}
            editingImage={imageData}
          />
        </div>
      </div>

      <div className="mt-6 px-20">
        <div className="flex justify-end space-x-3">
          {isLoading ? (
            <button disabled className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900">
              <l-dot-pulse size="43" speed="1.3" color="white"></l-dot-pulse>
            </button>
          ) : isError ? (
            <div className="flex space-x-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Retry with New Images
              </button>
              <button
                onClick={submitProductForm}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
              >
                Try Again
              </button>
            </div>
          ) : (
            <button onClick={submitProductForm} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900">
              {isEditing ? "Update" : "Save"}
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <Link to="/dashboard/products">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

