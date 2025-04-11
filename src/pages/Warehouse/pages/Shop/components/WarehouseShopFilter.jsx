import React, { useState } from "react";
import { Input, DatePicker } from "antd"; // Импортируем DatePicker из antd
import { FaArchive } from "react-icons/fa";
import dayjs from "dayjs"; // Для работы с датами

const { Search } = Input;

const warehouseShopFilter = ({ data, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dates, setDates] = useState(dayjs()); // Состояние для хранения выбранных дат

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredData = data.filter((item) =>
      item.code.toLowerCase().includes(value.toLowerCase())
    );
    onSearch(filteredData); // Передаем отфильтрованные данные в родительский компонент
  };

  const handleDateChange = (dates) => {
    setDates(dates);
    // Если нужно выполнить фильтрацию по датам, добавьте логику здесь
  };

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
      {/* Логотип и заголовок */}
      <div className="flex justify-center md:justify-start items-center">
        <FaArchive className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">
          Қайтарилган маҳсулотлар
        </span>
      </div>

      {/* Поле для выбора диапазона дат */}
      <div className="flex flex-col md:flex-row gap-3">
        <DatePicker
          onChange={handleDateChange}
          value={dates}
          defaultValue={dayjs()} // Boshlang‘ich vaqtni ko‘rsatish
          format="DD/MM/YYYY"
          className="custom-datepicker"
          style={{
            backgroundColor: "#17212b",
            "--placeholder-color": "white",
          }}
        />

        <Search
          placeholder="Қидириш"
          onChange={(e) => handleSearch(e.target.value)}
          enterButton
          className="custom-search max-w-md"
        />
      </div>
    </div>
  );
};

export default warehouseShopFilter;
