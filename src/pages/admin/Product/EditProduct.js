import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {updateProduct} from "../../../redux/productSlice";
import {fetchCategories} from "../../../redux/categorySlice";
import {fetchBrands} from "../../../redux/brandSlice";
import {toast} from "react-hot-toast";
import api from "../../../config/axiosConfig";

const EditProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {productId} = useParams();
  const {categories} = useSelector((state) => state.category);
  const {brands} = useSelector((state) => state.brand);

  // Add color mapping object
  const colorMap = {
    "Black": "#000000",
    "White": "#FFFFFF",
    "Brown": "#8B4513",
    "Gray": "#808080",
    "Beige": "#F5F5DC",
    "Navy": "#000080",
    "Red": "#FF0000",
    "Green": "#008000",
    "Blue": "#0000FF",
    "Yellow": "#FFFF00",
    "Orange": "#FFA500",
    "Purple": "#800080",
    "Pink": "#FFC0CB",
    "Natural": "#F4E4BC",
    "Walnut": "#773F1A",
    "Oak": "#D4A05A",
    "Mahogany": "#4A0404",
    "Cherry": "#990000",
    "Maple": "#C45B16",
    "Teak": "#A67B5B"
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    images: [],
    material: "",
    roomType: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    warranty: "",
    status: "active",
    colors: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/getProduct/${productId}`);
        setFormData(response.data.productData);
      } catch (error) {
        toast.error("Failed to fetch product details");
        navigate("/dashboard/products");
      }
    };

    fetchProduct();
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch, productId, navigate]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct({id: productId, data: formData})).unwrap();
      toast.success("Product updated successfully");
      navigate("/dashboard/products");
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Brand</option>
              {brands?.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Room Type</option>
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Dining Room">Dining Room</option>
              <option value="Office">Office</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Bathroom">Bathroom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Material
            </label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Material</option>
              <option value="Wood">Wood</option>
              <option value="Metal">Metal</option>
              <option value="Glass">Glass</option>
              <option value="Leather">Leather</option>
              <option value="Fabric">Fabric</option>
              <option value="Plastic">Plastic</option>
              <option value="Marble">Marble</option>
              <option value="Stone">Stone</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Warranty (months)
            </label>
            <input
              type="number"
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dimensions
          </label>
          <div className="grid grid-cols-3 gap-4 mt-1">
            <input
              type="number"
              name="dimensions.length"
              value={formData.dimensions.length}
              onChange={handleChange}
              placeholder="Length"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              name="dimensions.width"
              value={formData.dimensions.width}
              onChange={handleChange}
              placeholder="Width"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              name="dimensions.height"
              value={formData.dimensions.height}
              onChange={handleChange}
              placeholder="Height"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
          {formData.images.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Colors</label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {Object.entries(colorMap).map(([colorName, colorHex]) => (
              <button
                key={colorName}
                type="button"
                onClick={() => {
                  const newColors = formData.colors.includes(colorName)
                    ? formData.colors.filter(c => c !== colorName)
                    : [...formData.colors, colorName];
                  setFormData(prev => ({...prev, colors: newColors}));
                }}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-md
                  ${formData.colors.includes(colorName) 
                    ? 'ring-2 ring-offset-2 ring-blue-500' 
                    : 'ring-1 ring-gray-200'
                  }
                `}
                style={{
                  backgroundColor: colorHex,
                  color: ['White', 'Yellow', 'Beige', 'Natural'].includes(colorName) ? '#000000' : '#FFFFFF'
                }}
              >
                <span>{colorName}</span>
                {formData.colors.includes(colorName) && (
                  <span className="ml-2">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct; 