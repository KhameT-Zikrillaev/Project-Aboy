import React, { useState, useEffect } from "react";
import { Card, Pagination, Tag, Spin } from "antd";
import "antd/dist/reset.css";
import { useLocation } from "react-router-dom";
import bgsklad from "@/assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
export default function ProductDetalies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useUserStore();
  const location = useLocation();
  const warehouseId = location.state?.warehouseId;
  // Fetch data from API
  const { data, isLoading, refetch } = useFetch(
    warehouseId ? `warehouse-products/byWarehouse/${warehouseId}` : null, 
    warehouseId ? `warehouse-products/byWarehouse/${warehouseId}` : null, 
    {},
    {
      enabled: !!warehouseId, 
    }
  );

  // Отладочный вывод структуры данных

  // Update filteredData when data changes
  useEffect(() => {
    if (data) {
      setFilteredData(data?.data?.products);
    }
  }, [data]);


  // Адаптивность экран разрешение кароточек
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 768 ? 4 : 8);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Логика пагинации
  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Функция для обработки результатов поиска
  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          data={data?.data?.products}
          name=""
          title="Tovarlar"
          showDatePicker={false}
          onSearch={handleSearchResults}
        />
        
        {/* Loader while data is loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <>
              {filteredData?.length === 0 ? (
              <div className="text-white text-lg">
                Tovar topilmadi
              </div>
            ) : (
              <div className="flex justify-center flex-wrap gap-10">
              {currentData?.map((item) => (
                <Card
                  key={item?.product_id}
                  className="shadow-md hover:shadow-lg transition-shadow rounded-md"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: "180px", // Kichraytirilgan width
                    height: "280px", // Kichraytirilgan height
                  }}
                  cover={<div />}
                  bodyStyle={{ padding: "8px", color: "white" }}
                >
                  <img
                    onClick={() => setSelectedImage(item?.image_url)}
                    className="h-32 w-full bg-cover cursor-pointer bg-center rounded-t-md" // Heightni kamaytirdim
                    src={item?.image_url}
                    alt=""
                    crossOrigin="anonymous"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-white">{item?.article}</h3>
            
                    <Tag color="blue" className="text-xs">
                      Part: <span className="text-red-500">{item?.batch_number}</span>
                    </Tag>
                    <h4 className="text-xs font-semibold text-white">
                      {item?.price + " $" || "No price"}
                    </h4>
                    <div className="flex justify-between">
                      <p className="text-gray-300 text-xs">Soni: {item?.quantity}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
          )}
          </>
        )}
        
        {/* Image Modal */}
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
        {/* Pagination */}
        {filteredData?.length > 0 && !isLoading && (
          <div className="my-4 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredData?.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
}
