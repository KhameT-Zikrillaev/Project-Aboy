import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import { Spin } from "antd";
import useFetch from "@/hooks/useFetch";


export default function WarehouseProducts() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const [filteredData, setFilteredData] = useState([]);
  const { data, isLoading } = useFetch("shop", "shop", {});

  
  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };
  useEffect(() => {
    setFilteredData(data?.data?.shops)
  }, [data])




  return (
    <div className="DirectorProduct mt-[150px] p-4">
       <SearchForm data={data?.data?.shops} name="" title="Sotuvchilar" showDatePicker={false} onSearch={setFilteredData} />

       {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
       ) : (
      <div className="grid grid-cols-2 gap-4">
        {filteredData?.slice(0, visibleDistricts).map((product) => (
          <Link
            key={product.id}
            to={`/warehouse/remove-from-showcase/${product.name}`}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </Link>
        ))}
      </div>
      )}
      {visibleDistricts < filteredData?.length && (
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
