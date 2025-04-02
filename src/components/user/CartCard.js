import React from "react";
import {MdDeleteForever} from "react-icons/md";
import {useDispatch} from "react-redux";
import {removeFromCart} from "../../redux/cartSlice";
import {FaTools} from "react-icons/fa";
import {motion} from "framer-motion";

const CartCard = ({cartItem, stockStatus}) => {
  const dispatch = useDispatch();

  const handleRemoveCartItem = () => {
    const productId = cartItem?.productId?._id;
    dispatch(removeFromCart(productId));
  };

  const itemPrice = cartItem?.discountedPrice || cartItem?.productId?.salePrice;
  const finalPrice = itemPrice * cartItem.quantity;

  // Color display with actual color background
  const ColorDisplay = ({color}) => (
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-700">Color:</span>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full border-2 border-gray-200"
          style={{backgroundColor: color.toLowerCase()}}
        />
        <span className="text-gray-600 capitalize">{color}</span>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: -20}}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 h-64 md:h-full relative group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
          <img
            src={cartItem?.productId?.thumbnail}
            alt={cartItem?.productId?.productName}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {cartItem?.productId?.brand?.brandName}
                </h2>
                <p className="text-gray-600 text-lg">
                  {cartItem?.productId?.productName}
                </p>
              </div>
              <button
                onClick={handleRemoveCartItem}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <MdDeleteForever size={24} />
              </button>
            </div>

            {/* Product Details */}
            <div className="space-y-4 mb-6">
              <ColorDisplay color={cartItem?.color} />
              
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Material:</span>
                <span className="px-3 py-1.5 bg-gray-50 rounded-lg text-gray-600 capitalize">
                  {cartItem?.material}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Quantity:</span>
                <span className="px-3 py-1.5 bg-gray-50 rounded-lg text-gray-600">
                  {cartItem?.quantity}
                </span>
              </div>

              {cartItem?.assemblyRequired && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                  <FaTools className="text-blue-500" />
                  <span className="font-medium">Assembly Required</span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="mt-auto">
              {stockStatus && !stockStatus.inStock && (
                <p className="text-red-500 font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {stockStatus.message}
                </p>
              )}

              <div className="flex flex-col items-end">
                {cartItem?.discountedPrice && (
                  <p className="text-lg text-gray-400 line-through">
                    ₹{cartItem?.originalPrice}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{finalPrice}
                  </p>
                  {cartItem?.offerPercentage && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-medium">
                      {cartItem?.offerPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartCard;
