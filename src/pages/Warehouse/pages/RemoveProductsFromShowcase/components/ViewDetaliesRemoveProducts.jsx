import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Table, Pagination, Tag, Button, Spin, Checkbox } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import bgsklad from "@/assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import ModalComponentContent from "@/components/modal/ModalContent";
import DeleteProductVitrina from "../modules/DeleteProductVitrina/DeleteProductVitrina";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import Total from "@/components/total/Total";
import { RiFileExcel2Line } from "react-icons/ri";
import api from "@/services/api";
export default function ViewDetaliesRemoveProducts() {
  const { name } = useParams();
  const location = useLocation();
  const shopId = location.state?.shopId;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [excelLoading, setExcelLoading] = useState(false);

  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useFetch(
    shopId ? `shop-product/all-products/${shopId}` : null,
    shopId ? `shop-product/all-products/${shopId}` : null,
    {
      page: currentPage,
      limit: itemsPerPage,
      ...(searchQuery && { article: searchQuery }),
    },
    {
      enabled: !!shopId,
    }
  );

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      const response = await api.get(`shop-product/export-excel/${shopId}`, {
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

  useEffect(() => {
    if (productsData?.data?.data) {
      setFilteredData(
        productsData.data.data.map((item) => ({
          ...item,
          key: item.id,
        }))
      );
    } else {
      setFilteredData([]);
    }
  }, [productsData]);

  const onSearch = (searchParams) => {
    const searchValue = searchParams.article || "";
    setSearchQuery(searchValue);
    setCurrentPage(1);
  };

  const showModal = () => {
    if (selectedProducts.length > 0) {
      setIsModalOpen(true);
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 50 : 100);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleCheckboxChange = (item) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((product) => product.id === item.id);
      if (isSelected) {
        return prev.filter((product) => product.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const resetSelection = () => {
    setSelectedProducts([]);
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts([...filteredData]);
    }
  };

  const handleSuccessSubmit = () => {
    resetSelection();
    refetchProducts();
  };

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
      title: (
        <Checkbox
          indeterminate={
            selectedProducts.length > 0 &&
            selectedProducts.length < filteredData.length
          }
          checked={
            selectedProducts.length === filteredData.length &&
            filteredData.length > 0
          }
          onChange={handleSelectAll}
        />
      ),
      key: "selection",
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedProducts.some((item) => item.id === record.id)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
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
      title: "Артикул",
      dataIndex: "article",
      key: "article",
      render: (text) => <span className="text-gray-100">{text}</span>,
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
      render: (text) => <span className="text-gray-100">{text}</span>,
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

  const totalQuantity = productsData?.data?.total;
  const totalPrice = productsData?.data?.total_price;

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          title={`${name} витринасини ўчириш`}
          showDatePicker={false}
          searchBy="article"
          onSearch={onSearch}
          placeholder="Артикул бўйича қидириш"
        />
        <Total totalQuantity={totalQuantity} totalPrice={totalPrice} />
        <div className="w-full flex justify-between mb-4">
          <div className="flex items-center justify-end w-full gap-2">
            <Button
              onClick={handleDownloadExcel}
              loading={excelLoading}
              className="flex self-end mb-3 items-center "
              style={{
                background: "oklch(0.627 0.194 149.214)",
                border: "none",
                color: "white",
                fontSize: "14px",
              }}
            >
              <RiFileExcel2Line size={18} /> Excel орқали юклаб олиш
            </Button>
            <span className="bg-gray-700 py-[6px] px-3 text-white text-sm rounded-lg shadow-lg">
              Танланган: {selectedProducts?.length}
            </span>
            <Button
              type="primary"
              onClick={showModal}
              disabled={selectedProducts?.length === 0}
              style={{
                backgroundColor:
                  selectedProducts?.length === 0 ? "#888" : "#364153",
                borderColor: "#364153",
              }}
              onMouseEnter={(e) => {
                if (selectedProducts?.length > 0)
                  e.currentTarget.style.backgroundColor = "#2b3445";
              }}
              onMouseLeave={(e) => {
                if (selectedProducts.length > 0)
                  e.currentTarget.style.backgroundColor = "#364153";
              }}
            >
              Ўчириш
            </Button>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="w-full px-4">
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

        {productsData?.data?.total > 0 && (
          <div className="my-2 mb-12 md:mb-0 flex justify-center">
            <Pagination
              current={currentPage}
              total={productsData?.data?.total}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="custom-pagination"
              itemRender={itemRender}
            />
          </div>
        )}

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
          idWarehouse={shopId}
        />

        <ModalComponentContent
          isOpen={isModalOpen}
          onClose={onClose}
          title={`${name} витринасидан ўчириш`}
        >
          <DeleteProductVitrina
            onClose={onClose}
            selectedProducts={selectedProducts}
            onSuccess={handleSuccessSubmit}
            warehouseName={name}
            shopId={shopId}
          />
        </ModalComponentContent>
      </div>
    </div>
  );
}
