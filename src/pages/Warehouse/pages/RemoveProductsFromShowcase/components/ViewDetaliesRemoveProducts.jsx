import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Table, Pagination, Tag, Button, Spin, Checkbox } from 'antd';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import ModalComponent from "@/components/modal/Modal";
import DeleteProductVitrina from "../modules/DeleteProductVitrina/DeleteProductVitrina";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";

export default function ViewDetaliesRemoveProducts() {
  const { name } = useParams();
  const location = useLocation();
  const shopId = location.state?.shopId;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState("");

  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useFetch(
    shopId ? `Storefront-product/${shopId}` : null,
    shopId ? `Storefront-product/${shopId}` : null,
    {},
    {
      enabled: !!shopId,
    }
  );

  useEffect(() => {
    if (productsData?.data) {
      setFilteredData(productsData.data.map(item => ({
        ...item,
        key: item.id
      })));
    } else {
      setFilteredData([]);
    }
  }, [productsData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
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

  const handleSearchResults = (results) => {
    if (Array.isArray(results)) {
      setFilteredData(results);
    } else if (results === null || results === undefined) {
      if (productsData?.data && Array.isArray(productsData.data)) {
        setFilteredData(productsData.data);
      } else {
        setFilteredData([]);
      }
    } else {
      setFilteredData([]);
    }
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
          indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredData.length}
          checked={selectedProducts.length === filteredData.length && filteredData.length > 0}
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
      title: "Artikul",
      dataIndex: "article",
      key: "article",
      render: (text) => <span className="text-gray-100">{text}</span>,
    },
    {
      title: "Partiya",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => (
        <Tag color="blue" className="text-gray-100">
          {text}
        </Tag>
      ),
    },
    {
      title: "Narxi ($)",
      dataIndex: "price",
      key: "price",
      render: (text) => <span className="text-gray-100">{text}</span>,
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
          />
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-cover bg-center p-1 relative" style={{ backgroundImage: `url(${bgsklad})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm 
          data={productsData?.data} 
          onSearch={handleSearchResults} 
          name={name} 
          title={`${name} vitrinasini o'chirish`} 
          showDatePicker={false} 
        />
        
        <div className='w-full flex justify-between mb-4'>
          <div className="flex items-center justify-end w-full gap-2">
            <span className='bg-gray-700 py-1 px-3 text-white text-sm rounded-lg shadow-lg'>
              Tanlangan: {selectedProducts.length}
            </span>
            <Button
              type="primary"
              onClick={showModal}
              disabled={selectedProducts.length === 0}
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
              O'chirish
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
              <div className="text-center text-white text-xl py-10">Malumot topilmadi</div>
            )}
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="my-2 mb-12 md:mb-0 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredData.length}
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
          idWarehouse={warehouseId}
        />

        <ModalComponent
          isOpen={isModalOpen}
          onClose={onClose}
          title={`${name} vitrinasidan o'chirish`}
        >
          <DeleteProductVitrina 
            onClose={onClose} 
            selectedProducts={selectedProducts} 
            onSuccess={handleSuccessSubmit} 
            warehouseName={name}
            shopId={shopId}
          />
        </ModalComponent>
      </div>
    </div>
  );
}