import React, { useState, useEffect } from "react";
import { Card, Pagination, Tag, Spin } from "antd";
import "antd/dist/reset.css";
import bgsklad from "../../../../assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
export default function Vitrina() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useUserStore();
  // Fetch data from API
  const id = user?.shop?.id;

  const { data, isLoading  } = useFetch(
    id ? `Storefront-product/${id}` : null, 
    id ? `Storefront-product/${id}` : null, 
    {},
    {
      enabled: !!id, 
    }
  );

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data?.data);
    }
  }, [data?.data]);

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
          data={data?.data}
          name=""
          title="Витрина"
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
                Товар топилмади
              </div>
            ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
            {currentData?.map((item) => (
              <Card
                key={item?.product_id}
                className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                cover={
                  <div/>
                } 
                bodyStyle={{ padding: "12px", color: "white" }}
              >
                 <img  onClick={() => setSelectedImage(item?.image_url)} crossOrigin="anonymous" className="h-48 w-full bg-cover cursor-pointer bg-center rounded-t-lg" src={item?.image_url} alt=""/>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-white">{item?.article}</h3>
                  <Tag color="blue">
                  Парт: <span className="text-red-500">{item?.batch_number}</span>
                  </Tag>
                  <h4 className="text-sm font-semibold text-white">
                    {item?.price +" $" || "No price"}
                  </h4>
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
