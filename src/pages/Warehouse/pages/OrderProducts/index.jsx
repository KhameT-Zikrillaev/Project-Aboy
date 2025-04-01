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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;
  const { data, isLoading, refetch } = useFetch(
    'warehouse',
    'warehouse',
    {
      page,
      limit,
      ...(searchQuery && { name: searchQuery })
    }
  );

  useEffect(() => {
    if (data?.data?.warehouses && user?.warehouse?.id) {
      const filtered = data.data.warehouses.filter(
        warehouse => warehouse?.id != user?.warehouse?.id
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data?.data?.warehouses || []);
    }
  }, [data, user?.warehouse?.id]);

  // Обработчик поиска
  const handleSearch = (searchResults) => {
    setFilteredBySearch(searchResults);
    setVisibleDistricts(12); // Сбрасываем видимые элементы при новом поиске
  };

  // Функция для кнопки "Yana"
  const loadMoreDistricts = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.name || "";
    setSearchQuery(searchValue);
    setPage(1); // Сброс пагинации при новом поиске
    setVisibleDistricts(12); // Сброс видимых элементов
  };

  return (
    <div className="DirectorProduct mt-[150px] p-4">
      {/* Передаем filteredData в SearchForm для поиска */}
      <SearchForm 
        name="" 
        title="Омборлар" 
        showDatePicker={false}
        searchBy="name" // Указываем, что поиск по названию склада
        onSearch={onSearch}
        placeholder="Омбор номи бўйича қидириш"
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : filteredData?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredData?.slice(0, visibleDistricts)?.map((product) => (
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
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Омбор топилмади
        </div>
      )}
      {/* Кнопка "Yana" */}
      {data?.data?.warehouses?.length >= limit && (
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