import React, { useState } from 'react';
import { DatePicker } from 'antd'; 
import { FaChartLine} from "react-icons/fa";
import { CloseCircleOutlined } from '@ant-design/icons'; 
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SearchFormStartEnd = ({ onSearch, title, showDatePicker = true }) => {
  const [dateRange, setDateRange] = useState([null, null]); 

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (typeof onSearch === 'function') {
      // Передаем обе даты в формате 'YYYY-MM-DD'
      const startDate = dates && dates[0] ? dayjs(dates[0]).format('YYYY-MM-DD') : null;
      const endDate = dates && dates[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : null;
      onSearch(startDate, endDate); // Передаем searchTerm как null, если он не используется
    }
  };

  const handleClear = () => {
    setDateRange([null, null]);   
    if (typeof onSearch === 'function') {
      onSearch(null, null, null); // Очищаем фильтрацию
    }
  };

  const shouldShowClearButton = dateRange.some(date => date !== null);

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300">
      <div className="flex justify-center md:justify-start items-center">
        <FaChartLine className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">{title}</span>
      </div>
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {showDatePicker && (
          <RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            format="DD/MM/YYYY"
            className="custom-datepicker"
            placeholder={["Бошланиш санаси", "Тугаш санаси"]}
            style={{ backgroundColor: "#17212b" }}
          />
        )}
        {shouldShowClearButton && (
          <button 
            onClick={handleClear} 
            className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg"
            title="Тозалаш"
          >
            <CloseCircleOutlined />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFormStartEnd;