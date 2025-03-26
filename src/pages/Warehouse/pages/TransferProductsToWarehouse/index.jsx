import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function WarehouseTransferProducts() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const { user } = useUserStore();
  const { data, isLoading  } = useFetch('warehouse', 'warehouse', {});
  const [filteredData, setFilteredData] = useState([]);
  const [filteredBySearch, setFilteredBySearch] = useState([]);

  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };
  
  useEffect(() => {
    if (data?.data?.warehouses && user?.warehouse?.id) {
      const filtered = data?.data?.warehouses?.filter(warehouse => warehouse?.id != user?.warehouse?.id);
      setFilteredData(filtered);
      setFilteredBySearch(filtered); 
    } else {
      setFilteredData(data?.data?.warehouses || []);
      setFilteredBySearch(data?.data?.warehouses || []);
    }
  }, [data, user?.name]);

  const handleSearch = (searchResults) => {
    setFilteredBySearch(searchResults);
  };

  return (
    <div className="WarehouseTransferProduct mt-[150px] p-4">
      {/* Передаем отфильтрованные данные в компонент поиска */}
      <SearchForm 
        data={filteredData} 
        name="" 
        title="Omborlar" 
        showDatePicker={false} 
        onSearch={handleSearch} 
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : filteredBySearch?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredBySearch?.slice(0, visibleDistricts)?.map((product) => (
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
          Ombor topilmadi
        </div>
      )}
      
      {visibleDistricts < filteredBySearch?.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreDistricts}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Yana
          </button>
        </div>
      )}
    </div>
  );
}
