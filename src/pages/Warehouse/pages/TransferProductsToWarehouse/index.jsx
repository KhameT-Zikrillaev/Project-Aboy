import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function WarehouseTransferProducts() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
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

  const [filteredData, setFilteredData] = useState([]);

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
    <div className="WarehouseTransferProduct mt-[150px] p-4">
      <SearchForm 
        name="" 
        title="Омборлар" 
        showDatePicker={false}
        searchBy="name" // Указываем, что поиск по названию склада
        onSearch={onSearch}
        placeholder="Омбор номи бўйича қидириш"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : filteredData?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredData.slice(0, visibleDistricts).map((product) => (
            <Link
              key={product?.id}
              state={{ shopId: product?.id }} 
              to={`/warehouse/transfer-to-warehouse/${product?.name}`}
              className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h4>{product?.name}</h4>
              <p>{product?.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Омбор топилмади
        </div>
      )}
      
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