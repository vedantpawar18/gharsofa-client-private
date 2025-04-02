import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StatusCard = ({ cardName, color, progressValueProp, totalAmout, icon, subtitle }) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prevValue) => {
        const maxProgress = Math.min(progressValueProp, 100); 
        if (prevValue < maxProgress) {
          return prevValue + 1;
        } else {
          clearInterval(interval);
          return maxProgress;
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [progressValueProp]);

  const formatValue = (value, type) => {
    if (type === 'currency') {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2 w-full sm:w-auto min-w-0">
          <h3 className="text-gray-500 text-base sm:text-lg font-semibold truncate">{cardName}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl flex-shrink-0">{icon}</span>
            <span className="text-xl sm:text-2xl font-bold truncate">
              {formatValue(totalAmout, cardName === 'Total Revenue' ? 'currency' : 'number')}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        <div className="relative flex flex-col items-center sm:items-end w-full sm:w-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
            <CircularProgressbar
              value={progressValue}
              text={`${Math.round(progressValue)}%`}
              styles={buildStyles({
                textSize: '20px',
                textColor: color,
                pathColor: color,
                trailColor: '#d6d6d6',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">vs Last Month</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
