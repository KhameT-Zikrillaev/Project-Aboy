import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Table, Pagination, Tag, Button, Spin, Checkbox } from 'antd';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import ModalComponent from "@/components/modal/Modal";
import ModalComponentContent from "@/components/modal/ModalContent";
import AddProductVitrina from "../modules/AddProductVitrina/AddProductVitrina";
import ViewWareHoustProducts from "../modules/ViewVitrinaProducts/ViewVitrinaProducts";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";

export default function ViewDetaliesSendProducts() {
  const { name } = useParams();
  const location = useLocation();
  const shopId = location.state?.shopId;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUserStore();
  const [isWareHouseOpen, setIsWareHouseOpen] = useState(false);

  const id = user?.warehouse?.id;

  useEffect(() => {
    if (id) {
      setWarehouseId(id);
    }
  }, [id]);

  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useFetch(
    id ? "warehouse-products/all-products" : null,
    id ? "warehouse-products/all-products" : null,
    {
      warehouseId: id,
      page: currentPage,
      limit: itemsPerPage,
      article: searchTerm || undefined
    },
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (productsData?.data?.data) {
      setFilteredData(productsData.data.data.map(item => ({
        ...item,
        key: item.id
      })));
    } else {
      setFilteredData([]);
    }
  }, [productsData]);

  const handleSearchResults = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    refetchProducts();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setIsWareHouseOpen(false);
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 10 : 50);
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
              e.target.src = 'placeholder-image-url';
            }}
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
          onSearch={handleSearchResults} 
          name={name + 'iga'} 
          title="Омборидиги маҳсулотларни витринга юбориш" 
          showDatePicker={false} 
        />
        
        <div className='w-full flex justify-between mb-4'>
          <Button
            style={{ backgroundColor: '#17212b', color: '#fff' }}
            onClick={() => setIsWareHouseOpen(true)}
          >
            Витринани куриш
          </Button>
          
          <div className="flex items-center gap-2">
            <span className='bg-gray-700 py-1 px-3 text-white text-sm rounded-lg shadow-lg'>
              Танланган: {selectedProducts.length}
            </span>
            <Button
              type="primary"
              onClick={showModal}
              disabled={selectedProducts?.length === 0}
              style={{
                backgroundColor: selectedProducts?.length === 0 ? '#888' : '#364153',
                borderColor: '#364153',
              }}
              onMouseEnter={(e) => {
                if (selectedProducts?.length > 0) e.currentTarget.style.backgroundColor = "#2b3445";
              }}
              onMouseLeave={(e) => {
                if (selectedProducts?.length > 0) e.currentTarget.style.backgroundColor = "#364153";
              }}
            >
              Юбориш
            </Button>
          </div>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="w-full px-2">
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
              <div className="text-center text-white text-xl py-10">Малумот топилмади</div>
            )}
          </div>
        )}

        {productsData?.data?.total > 0 && (
          <div className="my-2 mb-12 md:mb-0 flex justify-center">
            <Pagination
              current={currentPage}
              total={productsData?.data?.total || 0}
              pageSize={itemsPerPage}
              onChange={(page) => {
                setCurrentPage(page);
                refetchProducts();
              }}
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

        <ModalComponentContent
          isOpen={isModalOpen}
          onClose={onClose}
          title={name + " " + "Витринасига юбориш"}
        >
          <AddProductVitrina
            onClose={onClose}
            selectedProducts={selectedProducts}
            onSuccess={handleSuccessSubmit}
            warehouseName={name}
            warehouseId={warehouseId}
            shopId={shopId}
          />
        </ModalComponentContent>

        <ModalComponentContent
          isOpen={isWareHouseOpen}
          onClose={onClose}
          title={name + " Витринаси"}
        >
          <ViewWareHoustProducts idwarehouse={shopId} />
        </ModalComponentContent>
      </div>
    </div>
  );
}
