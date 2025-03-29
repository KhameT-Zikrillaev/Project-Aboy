import React, { useState } from "react";
import { Pagination, Table } from "antd";
import "antd/dist/reset.css";
import { useLocation } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SearchFormCustom from "@/components/SearchForm/SearchFormCustom";
export default function ProductDetalies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 100;
  const location = useLocation();
  const warehouseId = location.state?.warehouseId;
  // Fetch data from API
  const { data, isLoading } = useFetch(
    `warehouse-products/all-Products`,
    `warehouse-products/all-Products`,
    {
      page,
      limit,
      warehouseId,
      article: searchQuery || null,
    },
    {
      enabled: !!warehouseId,
    }
  );

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
  };

  const onSearch = (value) => setSearchQuery(value);

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button
          style={{
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LeftOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button
          style={{
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
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
      width: 70,
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
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Рулон сони",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Нархи",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Расм",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <div
          className="max-h-[80px] max-w-[80px]"
          onClick={() => isOpenModal(text)}
        >
          <img
            className="h-auto w-full"
            src={`${text}`}
            crossOrigin="anonymous"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-5 mt-30">
      <SearchFormCustom onSearch={onSearch} title="Қидириш"></SearchFormCustom>
      <div className="text-gray-100">
        <Table
          columns={columns}
          dataSource={data?.data?.data}
          pagination={false}
          className="custom-table"
          rowClassName={() => "custom-row"}
          bordered
          loading={isLoading}
        />
        <div className="flex justify-center mt-5">
          <Pagination
            className="custom-pagination"
            current={page}
            total={data?.total}
            pageSize={limit}
            onChange={handlePageChange}
            itemRender={itemRender}
          />
        </div>
      </div>
    </div>
  );
}
