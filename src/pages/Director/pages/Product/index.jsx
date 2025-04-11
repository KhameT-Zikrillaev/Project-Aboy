import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";


export default function DirectorProduct() {
  const [visibleWarehouses, setVisibleWarehouses] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { user } = useUserStore();

  const { data, isLoading } = useFetch(
    'warehouse',
    'warehouse',
    {
      page,
      limit,
      ...(searchQuery && { name: searchQuery })
    }
  );

  const [filteredWarehouses, setFilteredWarehouses] = useState([]);

  useEffect(() => {
    if (data?.data?.warehouses && user?.name) {
      const userName = user.name.toLowerCase();
      const filtered = data.data.warehouses.filter(warehouse => {
        const warehouseName = warehouse?.name?.toLowerCase().trim();
        return !userName.includes(warehouseName);
      });
      setFilteredWarehouses(filtered);
    } else {
      setFilteredWarehouses(data?.data?.warehouses || []);
    }
  }, [data, user?.name]);

  const loadMoreWarehouses = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.name || "";
    setSearchQuery(searchValue);
    setPage(1);
    setVisibleWarehouses(12);
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
      ) : filteredWarehouses?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredWarehouses.slice(0, visibleWarehouses).map((warehouse) => (
            <Link
              key={warehouse.id}
              to={`/director/product-list/${warehouse.name}`}
              state={{ warehouseId: warehouse.id }}
              className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h4>{warehouse.name}</h4>
              {warehouse.description && <p>{warehouse.description}</p>}
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
            onClick={loadMoreWarehouses}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Яна
          </button>
        </div>
      )}
    </div>
  );
}