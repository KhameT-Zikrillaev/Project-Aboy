import React, { useState, useEffect } from "react";
import "antd/dist/reset.css";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function WarehouseOrderProducts() {
  const { user } = useUserStore();
  const [visibleDistricts, setVisibleDistricts] = useState(12); // Добавили состояние для кнопки "Yana"
  const [filteredData, setFilteredData] = useState([]); // Данные после фильтрации
  const [filteredBySearch, setFilteredBySearch] = useState([]); // Данные после поиска
  const { data, isLoading } = useFetch('warehouse', 'warehouse', {});

  useEffect(() => {
    if (data) {
      // Фильтруем данные, исключая текущий склад пользователя
      const newData = data?.data?.warehouses?.filter(item => item?.id !== user?.warehouse?.id);
      setFilteredData(newData || []);
      setFilteredBySearch(newData || []); // Инициализируем filteredBySearch
    }
  }, [data, user?.warehouse?.id]);

  // Обработчик поиска
  const handleSearch = (searchResults) => {
    setFilteredBySearch(searchResults);
    setVisibleDistricts(12); // Сбрасываем видимые элементы при новом поиске
  };

  // Функция для кнопки "Yana"
  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };

  return (
    <div className="DirectorProduct mt-[150px] p-4">
      {/* Передаем filteredData в SearchForm для поиска */}
      <SearchForm
        data={filteredData}
        name=""
        title="Омборлар рўйхати"
        showDatePicker={false}
        onSearch={handleSearch}
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredBySearch?.slice(0, visibleDistricts)?.map((product) => (
            <Link
              key={product.id}
              to={`/warehouse/order-products/${product.name}`}
              state={{ idWarehouse: product.id }}
              className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h4>{product.name}</h4>
            </Link>
          ))}
        </div>
      )}
      {/* Кнопка "Yana" */}
      {visibleDistricts < filteredBySearch?.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreDistricts}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Яна
          </button>
        </div>
      )}
    </div>
  );
}