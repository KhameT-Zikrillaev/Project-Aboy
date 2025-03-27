import React, { useState, useEffect } from "react";
import "antd/dist/reset.css";
import bgsklad from "@/assets/images/bg-sklad.png";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import SearchForm from "@/components/SearchForm/SearchForm";
import { Link } from "react-router-dom";
import { Spin } from "antd";

export default function ReportSellerSend() {
  const { user } = useUserStore();
  const warehouseId = user?.warehouse?.id;
  const [filteredData, setFilteredData] = useState([]);
  const [filteredBySearch, setFilteredBySearch] = useState([]);
  const [visibleDistricts, setVisibleDistricts] = useState(12);

  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };

  const { data, isLoading } = useFetch(
    warehouseId ? `warehouse/${warehouseId}` : null,
    `warehouse/${warehouseId}`,
    {},
    { enabled: !!warehouseId }
  );

  const handleShopClick = (shopId) => {
    sessionStorage.setItem("shopId", shopId);
  };

  useEffect(() => {
    if (data) {
      setFilteredData(data?.data?.shops || []);
      setFilteredBySearch(data?.data?.shops || []);
    }
  }, [data]);

  const handleSearch = (searchResults) => {
    setFilteredBySearch(searchResults);
    setVisibleDistricts(12); // Сброс видимых элементов при новом поиске
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          data={filteredData}
          name=""
          title="Sotuvchilar"
          showDatePicker={false}
          onSearch={handleSearch}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {filteredBySearch?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {filteredBySearch.slice(0, visibleDistricts).map((district) => (
                  <Link
                    key={district.id}
                    to={`/warehouse/report-seller-send/${district.name}`}
                    onClick={() => handleShopClick(district.id)}
                    className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
                  >
                    <h4>{district.name}</h4>
                    {district.description && <p>{district.description}</p>}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                Hech narsa yo'q
              </div>
            )}
          </>
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
    </div>
  );
}