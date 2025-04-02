import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToWishList,
  removeItemFromWishList,
} from "../../redux/wishListSlice";
import { useEffect, useState } from "react";
import { RxDotFilled } from "react-icons/rx";

const FurnitureCard = ({ productData, inUserProfile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishList.items);
  const [isWishListed, setIsWishListed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showColorTooltip, setShowColorTooltip] = useState(false);
  const [showMaterialTooltip, setShowMaterialTooltip] = useState(false);

  // Combine thumbnail and gallery images
  const allImages = productData?.thumbnail 
    ? [productData.thumbnail, ...(productData.gallery || [])]
    : productData?.gallery || [];

  const handleProductDetails = () => {
    navigate(`/productDetials/${productData?._id}`);
  };

  useEffect(() => {
    setIsWishListed(wishlistItems.some((item) => item._id === productData._id));
  }, [wishlistItems, productData]);

  const toggleWishList = (e) => {
    e.stopPropagation();
    if (isWishListed) {
      dispatch(removeItemFromWishList(productData._id));
    } else {
      dispatch(addItemToWishList(productData._id));
    }
    setIsWishListed(!isWishListed);
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className="max-sm:mt-5">
      <div
        className={`relative ${
          inUserProfile
            ? "bg-gray-100 p-3 rounded-md"
            : "lg:w-auto p-4 bg-gray-100 rounded-md md:w-60 max-sm:w-44"
        }`}
        onClick={handleProductDetails}
      >
        <div className="absolute top-2 right-2 z-10">
          <button
            className="bg-white p-2 text-xl rounded-full shadow-md hover:shadow-lg transition-shadow"
            onClick={toggleWishList}
          >
            {isWishListed ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
          </button>
        </div>

        {/* Image carousel */}
        <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg">
          <img
            src={allImages[currentImageIndex]}
            alt={productData?.productName}
            className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
            style={{ aspectRatio: '4/3' }}
          />
          
          {/* Dot indicators - show when there are multiple images */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`transition-colors ${
                    currentImageIndex === index 
                      ? 'text-white scale-125' 
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <RxDotFilled size={24} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-gray-600 font-semibold">
              {productData?.brand?.brandName}
            </h3>
            <h2 className="text-sm text-gray-800">
              {inUserProfile
                ? productData?.productName?.split(" ").slice(0, 2).join(" ")
                : productData?.productName?.split(" ").slice(0, 3).join(" ")}
            </h2>
            <div className="flex gap-3 items-center mt-1">
              <p
                className={`text-green-600 font-semibold ${
                  productData?.discountedPrice ? "line-through" : ""
                }`}
              >
                ₹{productData?.salePrice}
              </p>
              {productData?.discountedPrice && (
                <p className="text-red-600 font-semibold">
                  ₹{productData?.discountedPrice} ({productData?.offerPercentage}% OFF)
                </p>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {productData?.roomType}
          </div>
        </div>

        {/* Colors and Materials */}
        <div className="mt-2 flex items-center gap-4">
          {/* Colors */}
          <div 
            className="relative"
            onMouseEnter={() => setShowColorTooltip(true)}
            onMouseLeave={() => setShowColorTooltip(false)}
          >
            <div className="flex -space-x-1">
              {productData?.colors?.slice(0, 3).map((color, index) => (
                <div
                  key={color}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{
                    backgroundColor: color.toLowerCase(),
                    zIndex: 3 - index
                  }}
                />
              ))}
              {productData?.colors?.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-xs">
                  +{productData.colors.length - 3}
                </div>
              )}
            </div>
            {showColorTooltip && productData?.colors?.length > 0 && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-md p-2 z-20 min-w-max">
                <div className="text-xs font-medium mb-1">Available Colors:</div>
                <div className="flex flex-wrap gap-1">
                  {productData.colors.map(color => (
                    <span key={color} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Materials */}
          <div 
            className="relative"
            onMouseEnter={() => setShowMaterialTooltip(true)}
            onMouseLeave={() => setShowMaterialTooltip(false)}
          >
            <div className="text-sm text-gray-600 cursor-help">
              {productData?.materials?.length} {productData?.materials?.length === 1 ? 'material' : 'materials'}
            </div>
            {showMaterialTooltip && productData?.materials?.length > 0 && (
              <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-md p-2 z-20 min-w-max">
                <div className="text-xs font-medium mb-1">Available Materials:</div>
                <div className="flex flex-wrap gap-1">
                  {productData.materials.map(material => (
                    <span key={material} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureCard; 