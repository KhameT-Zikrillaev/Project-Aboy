import React, { useState } from 'react';
import { DatePicker } from 'antd'; 
import { FaBox } from "react-icons/fa";
import { CloseCircleOutlined } from '@ant-design/icons'; 
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SearchFormStartEnd = ({ onSearch, title, showDatePicker = true }) => {
  const [dateRange, setDateRange] = useState([null, null]); 

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (typeof onSearch === 'function') {
      onSearch(dates[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : null, dates[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : null);
    }
  };

  const handleClear = () => {
    setDateRange([null, null]);   
    if (typeof onSearch === 'function') {
      onSearch(null, null);
    }
  };

  const shouldShowClearButton = dateRange.some(date => date !== null);

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300">
      <div className="flex justify-center md:justify-start items-center">
        <FaBox className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">{title}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {showDatePicker && (
          <RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            format="DD/MM/YYYY"
            className="custom-datepicker"
            placeholder={["Boshlanish sanasi", "Tugash sanasi"]}
            style={{ backgroundColor: "#17212b" }}
          />
        )}
        {shouldShowClearButton && (
          <button 
            onClick={handleClear} 
            className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg"
            title="Tozalash"
          >
            <CloseCircleOutlined />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFormStartEnd;
