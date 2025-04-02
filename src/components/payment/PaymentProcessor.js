import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axiosConfig';
import toast from 'react-hot-toast';

const PaymentProcessor = ({ orderId, amount, paymentMethod, paymentDetails }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      try {
        switch (paymentMethod) {
          case 'CARD':
            await handleCardPayment();
            break;
          case 'PHONEPE':
            await handlePhonePePayment();
            break;
          case 'UPI':
            await handleUPIPayment();
            break;
          case 'COD':
            await handleCODPayment();
            break;
          default:
            throw new Error('Invalid payment method');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        toast.error(error.response?.data?.message || 'Payment processing failed');
      }
    };

    processPayment();
  }, [orderId, amount, paymentMethod, paymentDetails]);

  const handleCardPayment = async () => {
    try {
      // Create Razorpay order
      const response = await api.post('/payments/create-order', {
        amount,
        orderId
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: response.data.order.amount,
        currency: response.data.order.currency,
        name: 'GharSofa',
        description: 'Payment for your order',
        order_id: response.data.order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await api.post('/payments/verify-card', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success('Payment successful!');
            navigate('/order-confirmation');
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com'
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      throw error;
    }
  };

  const handlePhonePePayment = async () => {
    try {
      const response = await api.post('/payments/phonepe', {
        amount,
        orderId
      });
      
      // Here you would integrate with PhonePe's SDK
      // This is a placeholder for the actual implementation
      toast.success('PhonePe payment initiated!');
      navigate('/order-confirmation');
    } catch (error) {
      throw error;
    }
  };

  const handleUPIPayment = async () => {
    try {
      const response = await api.post('/payments/upi', {
        amount,
        orderId,
        upiId: paymentDetails.upiId
      });
      
      // Here you would integrate with UPI payment gateway
      // This is a placeholder for the actual implementation
      toast.success('UPI payment initiated!');
      navigate('/order-confirmation');
    } catch (error) {
      throw error;
    }
  };

  const handleCODPayment = async () => {
    try {
      const response = await api.post('/payments/cod', {
        amount,
        orderId
      });
      
      toast.success('Order placed successfully! Payment will be collected on delivery.');
      navigate('/order-confirmation');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentProcessor; 