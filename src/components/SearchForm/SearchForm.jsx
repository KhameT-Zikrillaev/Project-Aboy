import React, { useState } from 'react';
import { Input, DatePicker, Button } from 'antd';
import { FaWarehouse, FaChartLine, FaListAlt, FaBox, FaUserTie } from "react-icons/fa";
import { TbShoppingCartCheck } from "react-icons/tb";
import { CloseCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const iconMap = {
  Витрина: FaListAlt,
  Витринаси: FaListAlt,
  Товарлар: FaBox,
  Товарлари: FaBox,
  Махсулотлари: FaBox,
  Сотувчилар: FaUserTie,
  Омбори: FaWarehouse,
  Омборлар: FaWarehouse,
  Омборхона: FaWarehouse,
  Ҳисобот: FaChartLine,
  Ҳисоботлар: FaChartLine,
  Ҳисоботлари: FaChartLine,
  Касса: TbShoppingCartCheck,
  "Касса маълумотлари": TbShoppingCartCheck,
  'Омборидиги маҳсулотларни юбориш': FaWarehouse,
  'Омборидиги маҳсулотларни витринга юбориш': FaWarehouse,
  'Ҳисоботлар омборлар': FaWarehouse,
  'Ҳисоботлар сотувчилар': FaUserTie,
  "Омборлар рўйхати": FaWarehouse,
  "заказ бериш": FaWarehouse,
};

const SearchForm = ({ 
  name = '',
  title = '',
  showDatePicker = true,
  onDateChange,
  onSearch,
  searchBy = 'article', // 'article' | 'name'
  placeholder = "Кидириш",
  showClearButton = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch({ [searchBy]: value || null });
    }
  };

  const handleDateChange = (dateValue) => {
    setDate(dateValue);
    if (onDateChange) onDateChange(dateValue);
  };

  const handleClear = () => {
    setSearchTerm('');
    setDate(null);
    if (onSearch) onSearch({ [searchBy]: null });
    if (onDateChange) onDateChange(null);
  };

  const shouldShowClearButton = showClearButton && (searchTerm.length > 0 || date !== null);
  const IconComponent = iconMap[title] || FaBox;

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300">
      <div className="flex justify-center md:justify-start items-center">
        <IconComponent className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">
          {name} {title}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        {showDatePicker && (
          <DatePicker
            onChange={handleDateChange}
            value={date}
            format="DD/MM/YYYY"
            className="custom-datepicker"
            placeholder="Сана танланг"
            style={{
              backgroundColor: "#17212b",
              "--placeholder-color": "white",
            }}
          />
        )}
        
        <div className="flex items-center gap-2 w-full">
          <Search
            placeholder={placeholder}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            enterButton
            className="custom-search max-w-md"
            onSearch={handleSearch}
            onPressEnter={(e) => handleSearch(e.target.value)}
          />
          
          {shouldShowClearButton && (
            <Button 
              type="primary" 
              icon={<CloseCircleOutlined />} 
              onClick={handleClear}
              className="flex items-center justify-center"
              style={{
                backgroundColor: "#17212b"
              }}
              title="Тозалаш"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;