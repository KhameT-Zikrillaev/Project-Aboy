import React, { useState } from 'react';
import { Input, DatePicker } from 'antd'; // Импортируем DatePicker из antd
import { FaWarehouse, FaChartLine,FaListAlt, FaBox,FaUserTie} from "react-icons/fa";
import { TbShoppingCartCheck } from "react-icons/tb";
import dayjs from 'dayjs'; // Для работы с датами

const { Search } = Input;

const iconMap = {
  Vitrina: FaListAlt,
  Vitrinasi: FaListAlt,
  Tovarlar: FaBox,
  Tovarlari: FaBox,
  Sotuvchilar: FaUserTie,
  Ombori: FaWarehouse,
  Omborlar: FaWarehouse,
  Omborxona: FaWarehouse,
  Hisobot: FaChartLine,
  Hisobotlar:FaChartLine,
  Hisobotlari: FaChartLine,
  Kassa:TbShoppingCartCheck,
  "Kassa ma'lumotlari":TbShoppingCartCheck,
  'Omboridigi mahsulotlarni yuborish': FaWarehouse,
  "Omborlar ro'yxati": FaWarehouse,
};

const SearchForm = ({ data, onSearch, name, title, showDatePicker = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(null); // Состояние для хранения выбранной даты

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredData = data.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    onSearch(filteredData); // Передаем отфильтрованные данные в родительский компонент
  };

  const handleDateChange = (date) => {
    setDate(date);
    // Если нужно выполнить фильтрацию по дате, добавьте логику здесь
  };

  const IconComponent = iconMap[title] || FaBox; // Если title не найден, используем значок по умолчанию

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
      {/* Логотип и заголовок */}
      <div className="flex justify-center md:justify-start items-center">
        <IconComponent className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">{name} {title}</span>
      </div>

      {/* Поле для выбора одной даты */}
      <div className="flex flex-col md:flex-row gap-3">
        {showDatePicker && (
          <DatePicker
            onChange={handleDateChange}
            value={date}
            format="DD/MM/YYYY"
            className="custom-datepicker"
            style={{
              backgroundColor: "#17212b",
              "--placeholder-color": "white",
            }}
          />
        )}
        {/* Поисковая строка */}
        <Search
          placeholder="Qidirish"
          onChange={(e) => handleSearch(e.target.value)}
          enterButton
          className="custom-search max-w-md"
        />
      </div>
    </div>
  );
};

export default SearchForm;