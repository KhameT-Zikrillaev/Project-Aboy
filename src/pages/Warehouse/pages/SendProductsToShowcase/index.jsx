import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import { Spin } from "antd";


export default function WarehouseProducts() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredBySearch, setFilteredBySearch] = useState([]);
  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };
  const { user } = useUserStore();
  const warehouseId = user?.warehouse?.id;
  console.log(warehouseId)

  const { data, isLoading, refetch } = useFetch(
    warehouseId ? `warehouse/${warehouseId}` : null, 
    warehouseId ? `warehouse/${warehouseId}` : null, 
    {},
    {
      enabled: !! warehouseId, 
    }
  );

  useEffect(() => {
    if (data) {
      console.log("Data from API:", data);
      setFilteredData(data?.data?.shops || []);
      setFilteredBySearch(data?.data?.shops || []);
    }
  }, [data]);
  
  const handleSearch = (searchResults) => {
    setFilteredBySearch(searchResults);
  };


  return (
    <div className="DirectorProduct mt-[150px] p-4">
       <SearchForm data={filteredData} name="" title="Sotuvchilar" showDatePicker={false} onSearch={handleSearch}  />
       {isLoading ? (
  <div className="flex justify-center items-center h-[300px]">
    <Spin size="large" />
  </div> ) : (
      <div className="grid grid-cols-2 gap-4">
        {filteredBySearch?.slice(0, visibleDistricts).map((product) => (
          <Link
            key={product.id}
            to={`/warehouse/send-to-showcase/${product.name}`}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>{product.id}</p>
          </Link>
        ))}
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
