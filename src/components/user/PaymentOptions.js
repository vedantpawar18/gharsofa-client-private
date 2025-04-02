import React, {useEffect, useState} from "react";
import {FaStar, FaWallet} from "react-icons/fa";
import {MdPayment} from "react-icons/md";
import {BsCashStack, BsCreditCard2Back} from "react-icons/bs";
import {SiRazorpay} from "react-icons/si";
import {IoMdRefresh} from "react-icons/io";
import {useDispatch, useSelector} from "react-redux";
import toast from "react-hot-toast";
import api from "../../config/axiosConfig";
import {clearCart} from "../../redux/cartSlice";
import SuccessModal from "./SuccessModal";
import FailureModal from "./FailureModal";
import { useNavigate } from "react-router-dom";

const generateCaptcha = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};

const PaymentOptions = ({totalPrice, onSuccess, onFailure}) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("recommended");
  const [openCashOnDel, setOpenCashOnDel] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [upiId, setUpiId] = useState("");
  const cartItems = useSelector((state) => state.cart.cartItems);
  const pricingDetails = useSelector((state) => state.coupons.pricingDetails);
  const address = useSelector((state) => state.address.selectedAddress);
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const options = [
    {id: "recommended", label: "Recommended", icon: <FaStar />},
    {id: "cash", label: "Cash On Delivery", icon: <BsCashStack />},
    {id: "card", label: "Card Payment", icon: <BsCreditCard2Back />},
    {id: "upi", label: "UPI Payment", icon: <MdPayment />},
    {id: "wallet", label: "Wallets", icon: <FaWallet />},
  ];

  const handleCaptchaValidation = () => {
    setIsCaptchaValid(captchaInput === captcha);
  };  

  useEffect(() => {
    handleCaptchaValidation();
  }, [captchaInput]);

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

  const handlePayment = async (paymentMethod) => {
    if (!cartItems || !address) {
      toast.error("Please select an address.");
      return;
    }

    try {
      const orderData = {
        ...createOrderData(),
        payment: {
          method: paymentMethod,
          status: paymentMethod === "Cash on Delivery" ? "Pending" : "Completed",
        },
      };

      const createOrderResponse = await api.post(
        "order/place-order",
        orderData
      );
      
      if (createOrderResponse.status === 200) {
        dispatch(clearCart());
        setCaptchaInput("");
        onSuccess();
      }
    } catch (error) {
      console.log("Error creating order:", error);
      toast.error(error?.response?.data?.message || "Failed to place order. Please try again.");
      onFailure();
    }
  };

  const handleUPIPayment = async () => {
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    if (!cartItems || !address) {
      toast.error("Please select an address.");
      return;
    }

    try {
      const orderData = {
        ...createOrderData(),
        payment: {
          method: "UPI",
          status: "Pending",
          upiId: upiId
        },
      };

      const createOrderResponse = await api.post("order/place-order", orderData);
      
      if (createOrderResponse.status === 200) {
        dispatch(clearCart());
        setUpiId("");
        onSuccess();
      }
    } catch (error) {
      console.log("Error processing UPI payment:", error);
      toast.error(error?.response?.data?.message || "Failed to process UPI payment. Please try again.");
      onFailure();
    }
  };

  const handleCardPayment = async () => {
    if (!cartItems || !address) {
      toast.error("Please select an address.");
      return;
    }
    
    try {
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        toast.error("Payment system is initializing. Please try again in a moment.");
        return;
      }

      const {data} = await api.post("order/create-razorpay-order", {
        totalPrice: pricingDetails.finalPrice,
      });

      if (!data.orderId) {
        toast.error("Failed to create payment order");
        return;
      }

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
              dispatch(clearCart());
              onSuccess();
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed. Please contact support.");
            onFailure();
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
        modal: {
          ondismiss: function () {
            toast.error("Payment was cancelled");
            onFailure();
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      razorpayInstance.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        razorpayInstance.close();
        onFailure();
      });
    } catch (error) {
      console.error("Error processing card payment:", error);
      toast.error(error?.response?.data?.message || "Failed to initiate payment. Please try again.");
      onFailure();
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "recommended":
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedOption("cash")}>
              <label htmlFor="cod" className="flex-1">Cash on Delivery</label>
              <BsCashStack className="text-2xl text-green-600" />
            </div>
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedOption("card")}>
              <label htmlFor="card" className="flex-1">Card Payment</label>
              <BsCreditCard2Back className="text-2xl text-blue-600" />
            </div>
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedOption("upi")}>
              <label htmlFor="upi" className="flex-1">UPI Payment</label>
              <MdPayment className="text-2xl text-purple-600" />
            </div>
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedOption("wallet")}>
              <label htmlFor="wallet" className="flex-1">Wallet</label>
              <FaWallet className="text-2xl text-orange-600" />
            </div>
          </div>
        );
      case "cash":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-green-800">Cash on Delivery</p>
                <p className="text-sm text-green-600">Pay when you receive your order</p>
              </div>
              <BsCashStack className="text-3xl text-green-600" />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter captcha"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-gray-100 p-2 rounded">{captcha}</span>
                <button
                  onClick={() => setCaptcha(generateCaptcha())}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <IoMdRefresh />
                </button>
              </div>
            </div>
            <button
              onClick={() => handlePayment("Cash on Delivery")}
              disabled={!isCaptchaValid}
              className={`w-full py-3 rounded-lg font-semibold ${
                isCaptchaValid
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Place Order
            </button>
          </div>
        );
      case "card":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-blue-800">Card Payment</p>
                <p className="text-sm text-blue-600">Pay securely with your card</p>
              </div>
              <BsCreditCard2Back className="text-3xl text-blue-600" />
            </div>
            <button
              onClick={handleCardPayment}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Pay ₹{pricingDetails.finalPrice}
            </button>
          </div>
        );
      case "upi":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-semibold text-purple-800">UPI Payment</p>
                <p className="text-sm text-purple-600">Pay using UPI</p>
              </div>
              <MdPayment className="text-3xl text-purple-600" />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter your UPI ID (e.g., username@upi)"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button
              onClick={handleUPIPayment}
              disabled={!upiId}
              className={`w-full py-3 rounded-lg font-semibold ${
                upiId
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Pay ₹{pricingDetails.finalPrice}
            </button>
          </div>
        );
      case "wallet":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="font-semibold text-orange-800">Wallet Payment</p>
                <p className="text-sm text-orange-600">Pay using your wallet balance</p>
              </div>
              <FaWallet className="text-3xl text-orange-600" />
            </div>
            <button
              onClick={() => handlePayment("Wallet")}
              className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
            >
              Pay ₹{pricingDetails.finalPrice}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedOption === option.id
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
};

export default PaymentOptions;
