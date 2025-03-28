import React, { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { Card, Spin, Empty, Tag, Pagination, Button } from "antd";
import SearchForm from "@/components/SearchForm/SearchForm";

export default function ViewVitrinaProducts({ idwarehouse }) {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const { data, isLoading, refetch } = useFetch(
    `Storefront-product/${idwarehouse}`,
    `Storefront-product/${idwarehouse}`,
    {},
    {
      enabled: !!idwarehouse,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (idwarehouse) {
      setFilteredData([]);
      setCurrentPage(1);
      refetch();
    }
  }, [idwarehouse, refetch]);

  useEffect(() => {
    if (data?.data) {
      setFilteredData(data.data);
    } else {
      setFilteredData([]);
    }
  }, [data]);

  const handleSearchResults = (results) => {
    setSearchLoading(true);
    setTimeout(() => {
      if (Array.isArray(results)) {
        setFilteredData(results);
      } else if (results === null || results === undefined) {
        if (data?.data && Array.isArray(data.data)) {
          setFilteredData(data.data);
        } else {
          setFilteredData([]);
        }
      } else {
        setFilteredData([]);
      }
      setSearchLoading(false);
    }, 500);
  };

  const currentData = Array.isArray(filteredData) 
    ? filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ) 
    : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetSearch = () => {
    if (data?.data) {
      setFilteredData(data.data);
    } else {
      setFilteredData([]);
    }
    setCurrentPage(1);
  };

  return (
    <div className="p-4 w-full">
      <SearchForm
        data={data?.data} 
        onSearch={handleSearchResults}
        title="Vitrina" 
        showDatePicker={false}
        placeholder="Поиск по названию, артикулу, партии"
        loading={searchLoading}
      />
      
      {(isLoading || searchLoading) ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {currentData.length === 0 ? (
            <div className="flex flex-col items-center text-white justify-center h-64">
              <Empty style={{ color: 'white' }} description="Tovar topilmadi" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full px-4">
              {currentData?.map((item) => (
                <Card
                  key={item?.id}
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(10px)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)' 
                  }}
                  bodyStyle={{ padding: '12px', color: 'white' }}
                >
                  <img 
                    onClick={() => setSelectedImage(item?.image_url)} 
                    className="h-28 w-full bg-cover cursor-pointer bg-center rounded-t-lg" 
                    crossOrigin='anonymous' 
                    src={item?.image_url} 
                    alt=""
                  />
                  <div className="flex flex-col mt-[6px] gap-1">
                    <h3 className="text-md font-semibold text-white">
                      {item?.article || item?.name || 'Без названия'}
                    </h3>
                    <Tag color="blue">Part: <span className="text-red-500">{item?.batch_number || 'N/A'}</span></Tag>
                    <h4 className="text-sm font-semibold text-white">{(item?.price || 0) + " $"}</h4>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {!isLoading && !searchLoading && filteredData.length > pageSize && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="custom-pagination"
          />
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[80vh] overflow-auto bg-white rounded-lg shadow-xl">
            <img 
              src={selectedImage} 
              crossOrigin='anonymous' 
              alt="Увеличенное изображение" 
              className="w-full h-full" 
            />
          </div>
          <button 
            className="absolute top-3 right-2 bg-white/50 cursor-pointer text-white w-8 h-8 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}