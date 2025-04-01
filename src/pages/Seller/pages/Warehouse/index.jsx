import React, { useState, useEffect } from "react";
import { Table, Pagination, Tag, Button, Spin, Checkbox, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import bgsklad from "../../../../assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import ModalComponentContent from "@/components/modal/ModalContent";
import AddProduct from "./modules/AddProduct/AddProduct";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";

export default function Warehouse() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 100;
  const { user } = useUserStore();
  const id = user?.shop?.warehouse_id;

  const { data, isLoading, refetch } = useFetch(
    id ? `warehouse-products/all-products` : null,
    id ? `warehouse-products/all-products` : null,
    { warehouseId: id, page, limit, article: searchQuery || null },
    {
      enabled: !!id,
    }
  );

  const showModal = () => {
    if (selectedProducts.length > 0) {
      setIsModalOpen(true);
    } else {
      message.warning("Hech qanday mahsulot tanlanmagan!");
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSelectedProducts([]);
  };

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

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts([...filteredData]);
    }
  };

  const resetSelection = () => {
    setSelectedProducts([]);
  };

  const handleSuccessSubmit = () => {
    resetSelection();
    refetch();
  };

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.article || "";
    setSearchQuery(searchValue);
    setPage(1);
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
            selectedProducts?.length > 0 &&
            selectedProducts?.length < data?.data?.length
          }
          checked={
            selectedProducts?.length === data?.data?.length &&
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
      title: "Рулон сони",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text} ta</span>
      ),
    },
    {
      title: "Нархи",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text} $</span>
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

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          title="Омборхона"
          showDatePicker={false}
          onSearch={onSearch}
        />

        {user?.role === "seller" && (
          <div className="w-full flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-gray-700 py-1 px-3 text-white text-sm rounded-lg shadow-lg">
                Танланган: {selectedProducts?.length}
              </span>
              <Button
                type="primary"
                onClick={showModal}
                disabled={selectedProducts.length === 0}
                style={{
                  backgroundColor:
                    selectedProducts.length === 0 ? "#888" : "#364153",
                  borderColor: "#364153",
                }}
                onMouseEnter={(e) => {
                  if (selectedProducts.length > 0)
                    e.currentTarget.style.backgroundColor = "#2b3445";
                }}
                onMouseLeave={(e) => {
                  if (selectedProducts.length > 0)
                    e.currentTarget.style.backgroundColor = "#364153";
                }}
              >
                Буюртма бериш
              </Button>
            </div>
          </div>
        )}

        <div className="text-gray-100 w-full">
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
              total={data?.data?.total}
              showSizeChanger={false}
              pageSize={limit}
              onChange={handlePageChange}
              itemRender={itemRender}
            />
          </div>
        </div>

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
        <ModalComponentContent
          isOpen={isModalOpen}
          onClose={onClose}
          title={"Омборга буюртма бериш"}
          width={800}
        >
          <AddProduct
            onClose={onClose}
            selectedProducts={selectedProducts}
            onSuccess={handleSuccessSubmit}
          />
        </ModalComponentContent>
      </div>
    </div>
  );
}
