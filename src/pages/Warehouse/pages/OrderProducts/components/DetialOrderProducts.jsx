import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Card, Pagination, Tag, Button, Spin } from 'antd';
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import ModalComponent from "@/components/modal/Modal";
import AddProductOrderWarehouse from "../modules/AddProductOrderWarehouse/AddProductOrderWarehouse";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";

export default function ViewDetaliesOrderProducts() {
  const { name } = useParams();
  const location = useLocation();
  const idWarehouse = location.state?.idWarehouse;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useUserStore();

  const id = user?.warehouse?.id;
  const { data, isLoading, refetch } = useFetch(
    id ? `warehouse-products/byWarehouse/${idWarehouse}` : null,
    id ? `warehouse-products/byWarehouse/${idWarehouse}` : null,
    {},
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (data?.data?.products) {
      if (data?.data?.products && Array.isArray(data?.data?.products)) {
        setFilteredData(data?.data?.products?.map(item => ({
          ...item,
          key: item.id
        })));
      } else {
        setFilteredData([]);
      }
    } else {
      setFilteredData([]);
    }
  }, [data]);

  const handleSearchResults = (results) => {
    if (Array.isArray(results)) {
      setFilteredData(results);
    } else if (results === null || results === undefined) {
      if (data?.data?.products && Array.isArray(data?.data?.products)) {
        setFilteredData(data?.data?.products?.map(item => ({
          ...item,
          key: item.id
        })));
      } else {
        setFilteredData([]);
      }
    } else {
      setFilteredData([]);
    }
  };

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 4 : 10);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const currentData = Array.isArray(filteredData) ? filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : [];

  return (
    <div className="min-h-screen bg-cover bg-center p-1 relative" style={{ backgroundImage: `url(${bgsklad})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm 
          data={data?.data?.products} 
          onSearch={handleSearchResults} 
          name={name +" " +'omboriga'} 
          title="zakaz berish" 
          showDatePicker={false} 
        />
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full px-4">
            {Array.isArray(currentData) && currentData.length > 0 ? (
              currentData.map((item) => (
                <Card
                  key={item?.key}
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  cover={<div />}
                  bodyStyle={{ padding: '12px', color: 'white' }}
                >
                  <img onClick={() => setSelectedImage(item?.image_url)} className="h-48 w-full bg-cover cursor-pointer bg-center rounded-t-lg" crossOrigin='anonymous' src={item?.image_url} alt="" />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">{item?.article}</h3>
                    <Tag color="blue">Part: <span className="text-red-500">{item?.batch_number}</span></Tag>
                    <h4 className="text-sm font-semibold text-white">{item?.price + " $"}</h4>
                    <h5 className="text-sm font-semibold text-white">{item?.quantity} dona</h5>
                    <Button
                      type="primary"
                      onClick={() => showModal(item)}
                      style={{ backgroundColor: '#364153', borderColor: '#364153' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2b3445')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#364153')}
                    >
                      Zakaz berish
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-5 text-center text-white text-xl py-10">Malumot topilmadi</div>
            )}
          </div>
        )}
        {filteredData?.length > 0 && (
          <div className="my-2 mb-12 md:mb-0 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredData?.length}
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
        <ModalComponent
          isOpen={isModalOpen}
          onClose={onClose}
          title={name + " " + "Vitrinasiga yuborish"}
        >
          <AddProductOrderWarehouse 
            onClose={onClose} 
            selectedProducts={[selectedProduct]} 
            onSuccess={refetch} 
            warehouseName={name}
            idWarehouse={idWarehouse}
          />
        </ModalComponent>
      </div>
    </div>
  );
}