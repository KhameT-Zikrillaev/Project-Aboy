import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function CashRegister() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const [filteredData, setFilteredData] = useState([]);
  const { user } = useUserStore();
  const warehouseId = user?.warehouse?.id;
  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };

  const {data:shops, isLoading} = useFetch(
    warehouseId ? `warehouse/${warehouseId}` : null,
    warehouseId ? `warehouse/${warehouseId}` : null,
    {},
    {
      enabled: !!warehouseId
    }
  );

  useEffect(() => {
    if (shops?.data?.shops && Array.isArray(shops?.data?.shops)) {
      setFilteredData(shops?.data?.shops);
    } else {
      setFilteredData([]);
    }
  }, [shops]);

  const handleSearchResults = (results) => {
    if (Array.isArray(results)) {
      setFilteredData(results);
    } else if (results === null || results === undefined) {
      if (shops?.data?.shops && Array.isArray(shops?.data?.shops)) {
        setFilteredData(shops.data.shops);
      } else {
        setFilteredData([]);
      }
    } else {
      setFilteredData([]);
    }
  };

  return (
    <div className="DirectorProduct pt-[150px] p-4">
      <SearchForm 
        data={shops?.data?.shops} 
        name="" 
        title="Сотувчилар" 
        showDatePicker={false} 
        onSearch={handleSearchResults} 
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {Array.isArray(filteredData) && filteredData.length > 0 ? 
            filteredData.slice(0, visibleDistricts).map((district) => (
              <Link
                key={district.id}
                to={`/warehouse/cash-register/${district.name}`}
                state={{ shopId: district?.id }}
                className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
              >
                <h4>{district.name}</h4>
                <p>{district.description}</p>
              </Link>
            ))
          : (
            <div className="col-span-2 text-center text-gray-500">
              Маълумотлар топилмади
            </div>
          )}
        </div>
      )}
      {visibleDistricts < filteredData?.length && (
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