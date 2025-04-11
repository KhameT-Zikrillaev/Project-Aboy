import React, { useState } from "react";
import { Pagination, Table, Spin, Button } from "antd";
import { useLocation } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SearchForm from "@/components/SearchForm/SearchForm";
import api from "@/services/api";
import { RiFileExcel2Line } from "react-icons/ri";

export default function ProductDetalies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [excelLoading, setExcelLoading] = useState(false);
  const limit = 10;
  const location = useLocation();
  const warehouseId = location.state?.warehouseId;

  const { data, isLoading } = useFetch(
    `warehouse-products/all-Products`,
    `warehouse-products/all-Products`,
    {
      page,
      limit,
      warehouseId,
      ...(searchQuery && { article: searchQuery }),
    },
    {
      enabled: !!warehouseId,
    }
  );

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      const response = await api.get(
        `warehouse-products/export-excel/${warehouseId}`,
        {
          responseType: "blob", // Fayl sifatida yuklab olish
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx"); // Fayl nomi
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Excel yuklab olishda xatolik:", error);
    } finally {
      setExcelLoading(false);
    }
  };

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
    <div className="p-5 mt-[120px] flex flex-col">
      <SearchForm
        title="Маҳсулотлар"
        showDatePicker={false}
        searchBy="article"
        onSearch={onSearch}
        placeholder="Артикул бўйича қидириш"
      />
      <Button
        onClick={handleDownloadExcel}
        loading={excelLoading}
        className="flex self-end items-center "
        style={{
          background: "oklch(0.627 0.194 149.214)",
          border: "none",
          color: "white",
          fontSize: "18px",
          marginBottom: "15px",
        }}
      >
        <RiFileExcel2Line size={18} /> Excel орқали юклаб олиш
      </Button>

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
            <div className="text-gray-400 py-10">Маҳсулотлар топилмади</div>
          ),
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
    </div>
  );
}
