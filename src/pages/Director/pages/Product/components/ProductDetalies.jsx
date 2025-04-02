import React, { useState } from "react";
import { Pagination, Table, Spin } from "antd";
import { useLocation } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SearchForm from "@/components/SearchForm/SearchForm";

export default function ProductDetalies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const location = useLocation();
  const warehouseId = location.state?.warehouseId;

  const { data, isLoading, refetch } = useFetch(
    `warehouse-products/all-Products`,
    `warehouse-products/all-Products`,
    {
      page,
      limit,
      warehouseId,
      ...(searchQuery && { article: searchQuery })
    },
    {
      enabled: !!warehouseId,
    }
  );

  const handlePageChange = (page) => {
    setPage(page);
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.article || "";
    setSearchQuery(searchValue);
    setPage(1);
  };

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button className="text-white border-none cursor-pointer bg-transparent">
          <LeftOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button className="text-white border-none cursor-pointer bg-transparent">
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
        <span className="text-gray-100 font-semibold">{text || "-"}</span>
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
        <span className="text-gray-100 font-semibold">
          {text ? `${text} $` : "-"}
        </span>
      ),
    },
    {
      title: "Расм",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <div className="max-h-[80px] max-w-[80px]">
          {text ? (
            <img
              className="h-auto w-full object-cover"
              src={text}
              alt="product"
              crossOrigin="anonymous"
            />
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-5 mt-[120px]">
      <SearchForm
        title="Маҳсулотлар"
        showDatePicker={false}
        searchBy="article"
        onSearch={onSearch}
        placeholder="Артикул бўйича қидириш"
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data?.data?.data || []}
            pagination={false}
            className="custom-table bg-gray-800 rounded-lg overflow-hidden"
            rowClassName={() => "bg-gray-700 hover:bg-gray-600"}
            bordered
            loading={isLoading}
            locale={{
              emptyText: (
                <div className="text-gray-400 py-10">
                  Маҳсулотлар топилмади
                </div>
              )
            }}
          />
          
          {data?.data?.total > 0 && (
            <div className="flex justify-center mt-5">
              <Pagination
                current={page}
                total={data?.data?.total}
                pageSize={limit}
                onChange={handlePageChange}
                itemRender={itemRender}
                className="custom-pagination"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}