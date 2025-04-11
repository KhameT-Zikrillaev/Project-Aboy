import React, { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { Table, Spin, Empty, Tag, Pagination, Button } from "antd";
import SearchForm from "@/components/SearchForm/SearchForm";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import api from "@/services/api";
import { RiFileExcel2Line } from "react-icons/ri";

export default function ViewVitrinaProducts({ idshop }) {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [excelLoading, setExcelLoading] = useState(false);

  const { data, isLoading } = useFetch(
    `shop-product/all-products/${idshop}`,
    `shop-product/all-products/${idshop}`,
    {
      page: currentPage,
      limit: itemsPerPage,
      ...(searchQuery && { article: searchQuery }),
    },
    {
      enabled: !!idshop,
    }
  );

  useEffect(() => {
    if (data?.data?.data) {
      setFilteredData(
        data.data.data.map((item) => ({
          ...item,
          key: item.id,
        }))
      );
    } else {
      setFilteredData([]);
    }
  }, [data]);

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      const response = await api.get(`shop-product/export-excel/${idshop}`, {
        responseType: "blob", // Fayl sifatida yuklab olish
      });
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

  const onSearch = (searchParams) => {
    const searchValue = searchParams.article || "";
    setSearchQuery(searchValue);
    setCurrentPage(1);
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

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
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <span className="text-gray-100">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      ),
    },
    {
      title: "Artikul/Nomi",
      dataIndex: "article",
      key: "article",
      render: (text, record) => (
        <span className="text-gray-100">
          {text || record?.name || "Без названия"}
        </span>
      ),
    },
    {
      title: "Partiya",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => (
        <Tag color="blue" className="text-gray-100">
          {text || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Narxi ($)",
      dataIndex: "price",
      key: "price",
      render: (text) => <span className="text-gray-100">{text || 0} $</span>,
    },
    {
      title: "Rasm",
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
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "placeholder-image-url";
            }}
          />
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <div className="p-4 w-full">
      <SearchForm
        title="Витринаси"
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
        <div className="w-full px-4 flex flex-col gap-4">
          <Button
            onClick={handleDownloadExcel}
            loading={excelLoading}
            className="flex self-end mb-3 items-center "
            style={{
              background: "oklch(0.627 0.194 149.214)",
              border: "none",
              color: "white",
              fontSize: "18px",
            }}
          >
            <RiFileExcel2Line size={18} /> Excel орқали юклаб олиш
          </Button>
          {filteredData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={false}
              className="custom-table"
              rowClassName={() => "custom-row"}
              bordered
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            />
          ) : (
            <div className="text-center text-white text-xl py-10">
              Маълумот топилмади
            </div>
          )}
        </div>
      )}

      {data?.data?.total > 0 && (
        <div className="my-2 mb-12 md:mb-0 flex justify-center">
          <Pagination
            current={currentPage}
            total={data?.data?.total}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            className="custom-pagination"
            itemRender={itemRender}
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
              crossOrigin="anonymous"
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
