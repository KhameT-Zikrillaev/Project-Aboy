import React, { useState, useEffect } from "react";
import { Table, Pagination, Tag, Spin } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
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
  const { data, isLoading } = useFetch(
    id ? `Storefront-product/${id}` : null, 
    id ? `Storefront-product/${id}` : null, 
    {},
    { enabled: !!id }
  );

  // Update filteredData when data changes
  useEffect(() => {
    if (data?.data) {
      setFilteredData(data?.data);
    }
  }, [data?.data]);

  // Адаптивность количества элементов на странице
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 768 ? 4 : 8);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Функция для обработки результатов поиска
  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  // Кастомный рендер пагинации
  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
          <LeftOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
          <RightOutlined />
        </button>
      );
    }
    return originalElement;
  };

  const columns = [
    {
      title: "№",
      render: (_, __, index) => (
        <span className="text-gray-100 font-semibold">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      ),
      width: 50,
    },
    {
      title: "Артикул",
      dataIndex: "article",
      key: "article",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Партия",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => (
        <Tag color="blue" className="text-gray-100">
          {text}
        </Tag>
      ),
    },
    {
      title: "Нархи",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text || "No price"} $</span>
      ),
    },
    {
      title: "Расм",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <div 
          className="max-h-[60px] max-w-[60px] cursor-pointer"
          onClick={() => setSelectedImage(text)}
        >
          <img
            className="h-auto w-full object-cover"
            src={text}
            crossOrigin="anonymous"
            alt="product"
          />
        </div>
      ),
      width: 100,
    },
  ];

  // Логика пагинации
  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <div className="text-white text-lg">Товари топилмади</div>
            ) : (
              <div className="w-full px-2">
                <Table
                  columns={columns}
                  dataSource={currentData}
                  pagination={false}
                  className="custom-table"
                  rowClassName={() => "custom-row"}
                  bordered
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                />
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
              itemRender={itemRender}
            />
          </div>
        )}
      </div>
    </div>
  );
}