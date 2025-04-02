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
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUserStore();
  const [page, setPage] = useState(1);
  const limit = 100;

  // Fetch data from API
  const id = user?.shop?.id;
  const { data, isLoading } = useFetch(
    id ? `shop-product/all-products/${id}` : null,
    id ? `shop-product/all-products/${id}` : null,
    { page, limit, article: searchQuery || null },
    { enabled: !!id }
  );

  console.log(data?.data);

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
          {(page - 1) * limit + index + 1}
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
        <span className="text-gray-100 font-semibold">
          {text || "No price"} $
        </span>
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

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.article || "";
    setSearchQuery(searchValue);
    setPage(1);
  };
  
  
  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          name=""
          title="Витрина"
          showDatePicker={false}
          onSearch={onSearch}
        />
        <>
          <div className="w-full px-2">
            <Table
              columns={columns}
              dataSource={data?.data?.data}
              pagination={false}
              className="custom-table"
              rowClassName={() => "custom-row"}
              bordered
              loading={isLoading}
              // style={{
              //   background: "rgba(255, 255, 255, 0.1)",
              //   backdropFilter: "blur(10px)",
              // }}
            />
              <div className="my-4 flex justify-center">
                <Pagination
                  current={page}
                  total={data?.data.length}
                  pageSize={limit}
                  onChange={handlePageChange}
                  itemRender={itemRender}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
          </div>
        </>

        {/* Image Modal */}
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
      </div>
    </div>
  );
}
