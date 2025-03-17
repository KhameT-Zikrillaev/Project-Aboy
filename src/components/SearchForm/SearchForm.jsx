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
    
    // Если поисковая строка пуста, возвращаем все данные
    if (!value || value.trim() === '') {
      onSearch(data?.products  || data); // Возвращаем все данные
      return;
    }
    
    // Иначе фильтруем данные
    const dataToFilter = data?.products || data;
    
    if (!dataToFilter || !Array.isArray(dataToFilter)) {
      console.warn('No data to filter or data is not an array');
      return;
    }
    
    const filteredData = dataToFilter.filter(item => {
      // Проверяем наличие article и name, и ищем в обоих полях
      const articleMatch = item.article && item.article.toLowerCase().includes(value.toLowerCase());
      const nameMatch = item.name && item.name.toLowerCase().includes(value.toLowerCase());
      // Также проверяем поле description, если оно есть
      const descriptionMatch = item.description && item.description.toLowerCase().includes(value.toLowerCase());
      return articleMatch || nameMatch || descriptionMatch;
    });
    
    onSearch(filteredData); // Передаем отфильтрованные данные в родительский компонент
  };

  const handleDateChange = (date) => {
    setDate(date);
    // Если нужно выполнить фильтрацию по дате, добавьте логику здесь
  };

  const IconComponent = iconMap[title] || FaBox; // Если title не найден, используем значок по умолчанию

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300">
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
          onSearch={handleSearch} // Добавляем обработчик для кнопки поиска при нажатии
        />
      </div>
    </div>
  );
};

export default SearchForm;