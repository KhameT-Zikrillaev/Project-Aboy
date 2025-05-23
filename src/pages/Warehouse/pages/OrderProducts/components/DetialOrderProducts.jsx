import React, { useState } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Table, Pagination, Tag, Button, Spin, Checkbox } from 'antd';
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import ModalComponentContent from "@/components/modal/ModalContent";
import AddProductOrderWarehouse from "../modules/AddProductOrderWarehouse/AddProductOrderWarehouse";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import Total from "@/components/total/Total";

export default function ViewDetaliesOrderProducts() {
  const { name } = useParams();
  const location = useLocation();
  const idWarehouse = location.state?.idWarehouse;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUserStore();

  const id = user?.warehouse?.id;
  const { data, isLoading, refetch } = useFetch(
    "warehouse-products/all-products",
    "warehouse-products/all-products",
    {
      page: currentPage,
      limit: itemsPerPage,
      warehouseId: idWarehouse,
      ...(searchQuery && { article: searchQuery })
    },
    {
      enabled: !!idWarehouse,
    }
  );

  const onSearch = (searchParams) => {
    setSearchQuery(searchParams.article || "");
    setCurrentPage(1);
  };

  const handleCheckboxChange = (item) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((product) => product.id === item.id);
      return isSelected ? prev.filter((product) => product.id !== item.id) : [...prev, item];
    });
  };

  const handleSelectAll = () => {
    setSelectedProducts(selectedProducts.length === data?.data?.data?.length ? [] : [...data?.data?.data]);
  };

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedProducts.length > 0 && selectedProducts.length < data?.data?.data.length}
          checked={selectedProducts.length === data?.data?.data.length && data?.data?.data.length > 0}
          onChange={handleSelectAll}
        />
      ),
      key: 'selection',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedProducts.some(item => item.id === record.id)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
    {
      title: "№",
      key: 'index',
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
      title: "Рулон сони",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <span className="text-gray-100">{text} ta</span>,
    },
    {
      title: "Нархи",
      dataIndex: "price",
      key: "price",
      render: (text) => <span className="text-gray-100">{text} $</span>,
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
              e.target.src = 'placeholder-image-url';
            }}
          />
        </div>
      ),
      width: 100,
    },
  ];

  const totalPrice = data?.data?.total_price
  const totalQuantity = data?.data?.total_quantity

  return (
    <div className="min-h-screen bg-cover bg-center p-1 relative" style={{ backgroundImage: `url(${bgsklad})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          onSearch={onSearch}
          name={`${name}ига`}
          title="заказ бериш"
          showDatePicker={false}
        />
        <Total totalPrice={totalPrice} totalQuantity={totalQuantity} />

        <div className='w-full flex justify-end mb-4'>
          <div className="flex items-center gap-2">
            <span className='bg-gray-700 py-1 px-3 text-white text-sm rounded-lg shadow-lg'>
              Танланган: {selectedProducts.length}
            </span>
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedProducts.length}
              style={{
                backgroundColor: selectedProducts.length === 0 ? '#888' : '#364153',
                borderColor: '#364153',
              }}
              onMouseEnter={(e) => {
                if (selectedProducts.length > 0) e.currentTarget.style.backgroundColor = "#2b3445";
              }}
              onMouseLeave={(e) => {
                if (selectedProducts.length > 0) e.currentTarget.style.backgroundColor = "#364153";
              }}
            >
              Заказ бериш
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="w-full px-2">
            {data?.data?.data?.length > 0 ? (
              <Table
                columns={columns}
                dataSource={data?.data?.data}
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
              <div className="text-center text-white text-xl py-10">Маҳсулот топилмади</div>
            )}
          </div>
        )}

        {data?.data?.data?.length > 0 && (
          <div className="my-2 mb-12 md:mb-0 flex justify-center">
            <Pagination
              current={currentPage}
              total={data?.data?.total}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        )}

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
          idWarehouse={idWarehouse}
        />

        <ModalComponentContent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${name} обморига заказ бериш`}
        >
          <AddProductOrderWarehouse
            onClose={() => setIsModalOpen(false)}
            selectedProducts={selectedProducts}
            onSuccess={refetch}
            warehouseName={name}
            idWarehouse={idWarehouse}
          />
        </ModalComponentContent>
      </div>
    </div>
  );
}
