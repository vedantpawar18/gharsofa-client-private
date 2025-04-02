import React, { useEffect, useState } from "react";
import ImageGallery from "../../components/user/ImageGallery";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import { FaRegHeart } from "react-icons/fa";
import RelatedProducts from "../../components/user/RelatedProducts";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartDetails } from "../../redux/cartSlice";
import { addItemToWishList, fetchWishList, removeItemFromWishList } from "../../redux/wishListSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishList.items);
  const [product, setProduct] = useState(null);
  const [priceDiscount, setPriceDiscount] = useState(null)
  const [isInCart, setIsInCart] = useState(false);
  const [isWishList, setIsWishList] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [assemblyRequired, setAssemblyRequired] = useState(false);
  const [error, setError] = useState("");

  const fetchProdctDetial = async () => {
    try {
      const response = await api.get(`/product/product-detail/${id}`);
      setProduct(response?.data?.productDetail);
      setPriceDiscount(response?.data)
      // Set default values for color and material if available
      if (response.data.productDetail.colors && response.data.productDetail.colors.length > 0) {
        setSelectedColor(response.data.productDetail.colors[0]);
      }
      if (response.data.productDetail.materials && response.data.productDetail.materials.length > 0) {
        setSelectedMaterial(response.data.productDetail.materials[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProdctDetial();
    dispatch(fetchWishList())
  }, [id, dispatch]);

  // cart functions
  const checkIfInCart = () => {
    return cartItems.items?.some((item) => item.productId._id === product?._id);
  };

  useEffect(() => {
    if (product && cartItems.items) {
      setIsInCart(checkIfInCart());
    }
  }, [product, cartItems]);

  const handleAddToCart = async () => {
    // Validate required fields
    if (!selectedColor) {
      setError("Please select a color");
      return;
    }
    if (!selectedMaterial) {
      setError("Please select a material");
      return;
    }

    setError(""); // Clear any previous errors
    
    dispatch(
      addToCart({
        productId: product._id,
        color: selectedColor,
        material: selectedMaterial,
        assemblyRequired
      })
    ).then((response) => {
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success("Added to cart successfully");
        setIsInCart(!isInCart);
        dispatch(fetchCartDetails());
      } else {
        toast.error(response.payload || "Failed to add to cart");
      }
    });
  };

  useEffect(() => {
    if (product) {
      const isInWishList = wishlistItems.some(item => item._id === product._id);
      setIsWishList(isInWishList);
    }
  }, []);

  const toggleWishList = () => {
    if (isWishList) {
      dispatch(removeItemFromWishList(id));
    } else {
      dispatch(addItemToWishList(id));
    }
    setIsWishList(!isWishList)
  };

  return (
    <div className="px-10">
      <div className="mb-8">
        <span className="text-gray-600 font-semibold">
          Home / {product?.category?.categoryName} / {product?.productName}
        </span>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-14">
        <div className="md:w-2/3">
          <ImageGallery thumbnail={product?.thumbnail} galleryImg={product?.gallery} />
        </div>

        {/* product details */}
        <div className="md:w-1/3 mt-4 md:mt-0">
          <div className="flex justify-between items-center">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
              {product?.category?.categoryName}
            </span>
            <button className="mr-2" onClick={toggleWishList}>
              {isWishList ? <AiFillHeart color="red" size={24} /> : <AiOutlineHeart size={24} />}
            </button>
          </div>
          <h1 className="text-2xl font-bold mt-2">{product?.productName}</h1>

          <div className="flex items-center gap-2 mt-2">
            <p className={`text-blue-500 text-2xl font-semibold ${priceDiscount?.discountedPrice ? "line-through" : ""}`}>
              ₹ {product?.salePrice}   
            </p>  
            {priceDiscount?.discountedPrice && (
              <p className="text-red-600 text-2xl font-semibold">
                {priceDiscount?.discountedPrice} ({priceDiscount?.offerPercentage}% OFF)
              </p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-lg">Product Details</h2>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span>{product?.dimensions?.length} x {product?.dimensions?.width} x {product?.dimensions?.height} {product?.dimensions?.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Material:</span>
                <span>{product?.material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <span>{product?.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span>{product?.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assembly Required:</span>
                <span>{product?.assemblyRequired ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warranty:</span>
                <span>{product?.warranty} Year(s)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <h1 className="font-semibold text-xl text-gray-600">
              Availability:
            </h1>
            <p className={`text-xl font-semibold ${product?.status ? "text-green-800" : "text-red-600"}`}>
              {product?.stock > 0 ? `${product?.stock} in stock` : "Out of stock"}
            </p>
          </div>

          {/* Add color selection */}
          {product?.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Select Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded ${
                      selectedColor === color
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add material selection */}
          {product?.materials && product.materials.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Select Material</h3>
              <div className="flex gap-2">
                {product.materials.map((material) => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`px-4 py-2 rounded ${
                      selectedMaterial === material
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add assembly option */}
          <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={assemblyRequired}
                onChange={(e) => setAssemblyRequired(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="text-gray-700">Assembly Required</span>
            </label>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          {!isInCart ? (
            <div className="mt-4 flex items-center gap-2">
              <button
                className={`flex-1 py-2 rounded-lg mb-2 ${
                  product?.status && product?.stock > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-800 cursor-not-allowed"
                }`}
                disabled={!product?.status || product?.stock === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <Link to="/cart">
              <div className="mt-4 flex items-center gap-2">
                <button className="flex-1 py-2 rounded-lg mb-2 bg-black text-white hover:bg-gray-800">
                  Go to Cart
                </button>
              </div>
            </Link>
          )}

          <button
            className={`w-full ${
              product?.status && product?.stock > 0 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-blue-400 cursor-not-allowed"
            } text-white py-2 rounded-lg`}
            disabled={!product?.status || product?.stock === 0}
          >
            Buy It Now
          </button>

          <div className="mt-6">
            <h2 className="font-bold text-lg">Description</h2>
            <p className="mt-2 text-gray-700">{product?.description}</p>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-lg">Brand Details</h2>
            <div className="flex items-center gap-6 mt-4">
              <img
                src={product?.brand?.logo}
                alt={product?.brand?.brandName}
                className="w-24 h-24 object-contain"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {product?.brand?.brandName}
                </h3>
                <p className="text-gray-600 mt-1">{product?.brand?.brandTitle}</p>
                <p className="text-sm text-gray-500 mt-1">Est. {product?.brand?.yearEstablished}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-lg">Shipping Information</h2>
            <ul className="list-disc list-inside mt-2 text-sm space-y-2">
              <li>Free standard shipping on orders above ₹999</li>
              <li>Express delivery available (2-3 business days)</li>
              <li>Assembly service available in select cities</li>
              <li>Easy returns within 7 days of delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
