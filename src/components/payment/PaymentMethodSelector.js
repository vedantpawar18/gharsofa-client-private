import React, { useState } from 'react';
import { FaCreditCard, FaMobileAlt, FaQrcode, FaMoneyBillWave } from 'react-icons/fa';

const PaymentMethodSelector = ({ onSelectMethod, amount, orderId }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState('');

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    onSelectMethod(method);
  };

  const handleUPISubmit = (e) => {
    e.preventDefault();
    if (upiId) {
      onSelectMethod('UPI', { upiId });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
      
      <div className="space-y-4">
        {/* Card Payment */}
        <button
          onClick={() => handleMethodSelect('CARD')}
          className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${
            selectedMethod === 'CARD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <FaCreditCard className="text-2xl text-blue-500" />
          <span>Card Payment</span>
        </button>

        {/* PhonePe */}
        <button
          onClick={() => handleMethodSelect('PHONEPE')}
          className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${
            selectedMethod === 'PHONEPE' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <FaMobileAlt className="text-2xl text-purple-500" />
          <span>PhonePe</span>
        </button>

        {/* UPI */}
        <div className={`p-4 border rounded-lg ${
          selectedMethod === 'UPI' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}>
          <button
            onClick={() => handleMethodSelect('UPI')}
            className="w-full flex items-center space-x-3"
          >
            <FaQrcode className="text-2xl text-green-500" />
            <span>UPI Payment</span>
          </button>
          
          {selectedMethod === 'UPI' && (
            <form onSubmit={handleUPISubmit} className="mt-4">
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="mt-2 w-full bg-green-500 text-white py-2 rounded"
              >
                Pay ₹{amount}
              </button>
            </form>
          )}
        </div>

        {/* COD */}
        <button
          onClick={() => handleMethodSelect('COD')}
          className={`w-full p-4 border rounded-lg flex items-center space-x-3 ${
            selectedMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <FaMoneyBillWave className="text-2xl text-orange-500" />
          <span>Cash on Delivery</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector; 