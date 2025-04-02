import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaWallet, FaMoneyBillWave, FaQrcode } from "react-icons/fa";
import { SiRazorpay, SiGooglepay, SiPhonepe } from "react-icons/si";
import toast from "react-hot-toast";
import api from "../../config/axiosConfig";
import { clearCart } from "../../redux/cartSlice";
import SuccessModal from "../../components/user/SuccessModal";
import FailureModal from "../../components/user/FailureModal";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const address = useSelector((state) => state.address.selectedAddress);
  const pricingDetails = useSelector((state) => state.coupons.pricingDetails);
  const { user } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  const totalPrice = cartItems?.items?.reduce((acc, item) => {
    const price = Number(item?.productId?.salePrice);
    const quantity = item?.quantity;
    return acc + price * quantity;
  }, 0);

  const totalQty = cartItems?.items?.reduce((acc, item) => {
    return acc + item?.quantity;
  }, 0);

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <FaCreditCard className="text-2xl text-blue-600" />,
      description: "Pay using credit or debit card",
      subMethods: [
        { id: "razorpay", name: "Razorpay", icon: <SiRazorpay className="text-2xl" /> },
        { id: "googlepay", name: "Google Pay", icon: <SiGooglepay className="text-2xl" /> }
      ]
    },
    {
      id: "upi",
      name: "UPI",
      icon: <FaQrcode className="text-2xl text-green-600" />,
      description: "Pay using UPI apps",
      subMethods: [
        { id: "phonepe", name: "PhonePe", icon: <SiPhonepe className="text-2xl" /> },
        { id: "googlepay", name: "Google Pay", icon: <SiGooglepay className="text-2xl" /> }
      ]
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <FaMoneyBillWave className="text-2xl text-orange-600" />,
      description: "Pay when you receive your order"
    },
    {
      id: "wallet",
      name: "Wallet",
      icon: <FaWallet className="text-2xl text-purple-600" />,
      description: "Pay using your wallet balance"
    }
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleCardPayment = async () => {
    try {
      const { data } = await api.post("order/create-razorpay-order", {
        totalPrice: pricingDetails.finalPrice,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: pricingDetails.finalPrice * 100,
        currency: "INR",
        name: user?.firstName,
        description: "Card Payment",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const orderData = createOrderData();
            const verifyResponse = await api.post("order/verify-razorpay-order", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderData,
            });

            if (verifyResponse.status === 200) {
              setShowSuccessModal(true);
              dispatch(clearCart());
            }
          } catch (error) {
            setShowFailureModal(true);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.firstName,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      razorpayInstance.on("payment.failed", function (response) {
        setShowFailureModal(true);
        toast.error(`Payment failed: ${response.error.description}`);
      });
    } catch (error) {
      setShowFailureModal(true);
      toast.error("Failed to initiate payment");
    }
  };

  const handleUPIPayment = async () => {
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    try {
      const orderData = createOrderData();
      const response = await api.post("order/place-order", {
        ...orderData,
        payment: {
          method: "UPI",
          status: "Pending",
          upiId: upiId
        }
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        dispatch(clearCart());
        setUpiId("");
      }
    } catch (error) {
      setShowFailureModal(true);
      toast.error("Failed to process UPI payment");
    }
  };

  const handleCODPayment = async () => {
    try {
      const orderData = createOrderData();
      const response = await api.post("order/place-order", {
        ...orderData,
        payment: {
          method: "Cash on Delivery",
          status: "Pending"
        }
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        dispatch(clearCart());
      }
    } catch (error) {
      setShowFailureModal(true);
      toast.error("Failed to place COD order");
    }
  };

  const handleWalletPayment = async () => {
    try {
      const orderData = createOrderData();
      const response = await api.post("order/place-order", {
        ...orderData,
        payment: {
          method: "Wallet",
          status: "Pending"
        }
      });

      if (response.status === 200) {
        setShowSuccessModal(true);
        dispatch(clearCart());
      }
    } catch (error) {
      setShowFailureModal(true);
      toast.error("Failed to process wallet payment");
    }
  };

  const createOrderData = () => ({
    items: cartItems?.items.map((item) => ({
      product: item.productId._id,
      productName: item.productId.productName,
      productBrand: item.productId.brand.brandName,
      description: item.productId.description,
      price: item.productId.salePrice,
      regularPrice: item.productId.regularPrice,
      quantity: item.quantity,
      size: item.size,
      totalPrice: item.quantity * item.productId.salePrice,
      thumbnail: item.productId.thumbnail,
    })),
    address: address,
    totalPrice: totalPrice,
    deliveryCharge: pricingDetails.deliveryCharge,
    originalTotalPrice: pricingDetails.originalTotalPrice,
    totalPriceAfterDiscount: pricingDetails.totalPriceAfterDiscount,
    savedTotal: pricingDetails.savedTotal,
    couponDiscount: pricingDetails.couponDiscount,
    finalPrice: pricingDetails.finalPrice,
  });

  const renderPaymentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method)}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:border-blue-500 transition-colors"
                >
                  {method.icon}
                  <div className="text-left">
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back
              </button>
              <h2 className="text-xl font-semibold">
                {selectedPaymentMethod.name} Payment
              </h2>
            </div>

            {selectedPaymentMethod.id === "card" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedPaymentMethod.subMethods.map((subMethod) => (
                    <button
                      key={subMethod.id}
                      onClick={handleCardPayment}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:border-blue-500 transition-colors"
                    >
                      {subMethod.icon}
                      <span>{subMethod.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedPaymentMethod.id === "upi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {selectedPaymentMethod.subMethods.map((subMethod) => (
                    <button
                      key={subMethod.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:border-blue-500 transition-colors"
                    >
                      {subMethod.icon}
                      <span>{subMethod.name}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@upi"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleUPIPayment}
                    disabled={!upiId}
                    className={`w-full py-2 rounded ${
                      upiId
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Pay ₹{pricingDetails.finalPrice}
                  </button>
                </div>
              </div>
            )}

            {selectedPaymentMethod.id === "cod" && (
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800">
                    Cash on Delivery is available for orders under ₹10,000
                  </p>
                </div>
                <button
                  onClick={handleCODPayment}
                  className="w-full py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Place Order
                </button>
              </div>
            )}

            {selectedPaymentMethod.id === "wallet" && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800">
                    Your wallet balance will be used for this payment
                  </p>
                </div>
                <button
                  onClick={handleWalletPayment}
                  className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Pay ₹{pricingDetails.finalPrice}
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Payment</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>Order Total:</span>
              <span className="font-semibold">₹{pricingDetails.finalPrice}</span>
            </div>
          </div>

          {renderPaymentStep()}
        </div>
      </div>

      <SuccessModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/userProfile/orders");
        }}
      />
      <FailureModal
        show={showFailureModal}
        onClose={() => setShowFailureModal(false)}
      />
    </div>
  );
};

export default PaymentPage;
