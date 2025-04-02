import React from "react";
import ProgressBar from "./ProgressBar";

const BestItemCard = ({ image, bestName, percentage, sales, rank, salePrice }) => {
  const formatValue = (value) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full">
        <span className="text-xs font-semibold text-gray-700">#{rank}</span>
      </div>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={bestName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl">🏷️</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{bestName}</h3>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">{sales} sales</p>
          {salePrice && (
            <p className="text-xs text-gray-500">• {formatValue(salePrice)}</p>
          )}
        </div>
      </div>
      <div className="w-20 flex-shrink-0">
        <ProgressBar percentage={percentage} />
      </div>
    </div>
  );
};

export default BestItemCard;
