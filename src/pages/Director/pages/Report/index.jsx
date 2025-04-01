import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function Report() {
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
  const [allWarehouses, setAllWarehouses] = useState([]); // Храним все загруженные склады

  useEffect(() => {
    if (data?.data?.warehouses) {
      if (page === 1) {
        // Если это первая страница, просто сохраняем данные
        setAllWarehouses(data.data.warehouses);
      } else {
        // Если это не первая страница, добавляем новые данные к существующим
        setAllWarehouses(prev => [...prev, ...data.data.warehouses]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (allWarehouses.length > 0 && user?.name) {
      const userName = user.name.toLowerCase();
      
      const filtered = allWarehouses.filter(warehouse => {
        const warehouseName = warehouse?.name?.toLowerCase().trim();
        const isUserWarehouse = userName.includes(warehouseName);
        return !isUserWarehouse;
      });
      
      setFilteredData(filtered);
    } else {
      setFilteredData(allWarehouses);
    }
  }, [allWarehouses, user?.name]);

  const loadMoreDistricts = () => {
    setPage(prevPage => prevPage + 1);
    setVisibleDistricts(prev => prev + 12); // Увеличиваем количество отображаемых элементов
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.name || "";
    setSearchQuery(searchValue);
    setPage(1);
    setVisibleDistricts(12);
    setAllWarehouses([]); // Очищаем при новом поиске
  };

  return (
    <div className="DirectorProduct mt-[150px] p-4">
      <SearchForm 
        name="" 
        title="Омборлар" 
        showDatePicker={false}
        searchBy="name"
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
              to={`/director/report/${product?.name}`}
              className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
              onClick={() => sessionStorage.setItem("warehouseId", product?.id)}
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