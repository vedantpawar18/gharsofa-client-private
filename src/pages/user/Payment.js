import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import PaymentOptions from "../../components/user/PaymentOptions";
import SuccessModal from "../../components/user/SuccessModal";
import FailureModal from "../../components/user/FailureModal";
import toast from "react-hot-toast";
import api from "../../config/axiosConfig";

const Payment = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const pricingDetails = useSelector((state) => state.coupons.pricingDetails);
  const address = useSelector((state) => state.address.selectedAddress);

  useEffect(() => {
    if (!cartItems?.items?.length) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (!address) {
      toast.error("Please select a delivery address");
      navigate("/userProfile/address");
    }
  }, [address, navigate]);

  const handlePaymentSuccess = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      navigate("/userProfile/orders");
    }, 2000);
  };

  const handlePaymentFailure = () => {
    setShowFailureModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Delivery Address</h3>
            <p className="text-gray-600">
              {address?.fullName}, {address?.addressLine1}, {address?.city}, {address?.state} - {address?.pincode}
            </p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Order Items</h3>
            {cartItems?.items?.map((item) => (
              <div key={item.productId._id} className="flex justify-between mb-2">
                <span>
                  {item.productId.productName} ({item.size}) x {item.quantity}
                </span>
                <span>₹{item.quantity * item.productId.salePrice}</span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{pricingDetails.originalTotalPrice}</span>
            </div>
            {pricingDetails.couponDiscount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Coupon Discount</span>
                <span>-₹{pricingDetails.couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between mb-2">
              <span>Delivery Charge</span>
              <span>₹{pricingDetails.deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span>₹{pricingDetails.finalPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <PaymentOptions 
          totalPrice={pricingDetails.finalPrice}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      </div>

      {/* Modals */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <FailureModal
        show={showFailureModal}
        onClose={() => setShowFailureModal(false)}
      />
    </div>
  );
};

export default Payment; 