import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, Pagination, Tag, Button, Spin } from 'antd';
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import ModalComponent from "@/components/modal/Modal";
import ModalComponentContent from "@/components/modal/ModalContent";
import AddProductVitrina from "../modules/AddProductVitrina/AddProductVitrina";
import ViewWareHoustProducts from "../modules/ViewVitrinaProducts/ViewVitrinaProducts";
import ImageModal from "@/components/modal/ImageModal";
import CustomCheckbox from "@/components/CustomCheckbox";
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
// ~~~~~~~~~~~~~~~~~~ original ne udalim~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
    setItemsPerPage(window.innerWidth < 768 ? 4 : 50);
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
      setSelectedProducts(filteredData);
    }
  };

  const handleSuccessSubmit = () => {
    resetSelection();
    refetchProducts();
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-1 relative" style={{ backgroundImage: `url(${bgsklad})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm 
          onSearch={handleSearchResults} 
          name={name + 'iga'} 
          title="Omboridigi mahsulotlarni vitringa yuborish" 
          showDatePicker={false} 
        />
        
        <div className='w-full flex justify-between'>
          <Button
            style={{ marginBottom: '10px', backgroundColor: '#17212b', color: '#fff' }}
            onClick={() => setIsWareHouseOpen(true)}
          >
            Vitrinani ko'rish
          </Button>
          
          <Button
            type=""
            onClick={handleSelectAll}
            style={{ marginBottom: '10px', backgroundColor: '#17212b', color: '#fff' }}
          >
            {selectedProducts.length === filteredData.length ? 'Hammasini yechish' : 'Hammasini tanlash'}
          </Button>
        </div>

        {productsLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1 w-full px-2">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <Card
                  key={item.id}
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  bodyStyle={{ padding: '4px', color: 'white' }}
                >
                  <div className="flex flex-col">
                    <img 
                      onClick={() => setSelectedImage(item?.image_url)} 
                      crossOrigin="anonymous" 
                      className="h-12 w-full object-cover cursor-pointer rounded-t-lg mb-1" 
                      src={item?.image_url} 
                      alt={item?.article}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'placeholder-image-url';
                      }}
                    />
                    <h3 className="text-sm font-semibold text-white">{item?.article}</h3>
                    <Tag style={{ width: '100%', fontSize: '12px'}} color="blue">Part: <br/>
                      <span className="text-red-500">{item?.batch_number}</span></Tag>
                    <h4 className="text-sm font-semibold text-white">{item?.price + " $"}</h4>
                    <div className=' flex justify-end'>
                      <CustomCheckbox
                        checked={selectedProducts?.some((product) => product?.id === item?.id)}
                        onChange={() => handleCheckboxChange(item)}
                        label="Tanlash"
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-white text-xl py-10">Malumot topilmadi</div>
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
              className="custom-pagination text-white"
            />
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="w-full flex flex-col md:flex-row mt-2 mb-12 gap-2 justify-center items-center">
            <span className='bg-gray-700 py-[7px] max-w-[300px] w-full text-center h-[32px] text-white text-[16px] rounded-lg shadow-lg'>
              Tanlangan: {selectedProducts.length}
            </span>
            <Button
              type="primary"
              className='max-w-[300px] w-full'
              onClick={showModal}
              disabled={selectedProducts?.length === 0}
              style={{
                backgroundColor: selectedProducts?.length === 0 ? '#888' : '#364153',
                borderColor: '#364153',
                fontSize: '16px',
                height: '32px',
                cursor: selectedProducts?.length === 0 ? 'not-allowed' : 'pointer',
                opacity: selectedProducts?.length === 0 ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (selectedProducts?.length > 0) e.currentTarget.style.backgroundColor = "#2b3445";
              }}
              onMouseLeave={(e) => {
                if (selectedProducts?.length > 0) e.currentTarget.style.backgroundColor = "#364153";
              }}
            >
              Yuborish
            </Button>
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
          title={name + " " + "Vitrinasiga yuborish"}
        >
          <AddProductVitrina 
            onClose={onClose} 
            selectedProducts={selectedProducts} 
            onSuccess={handleSuccessSubmit} 
            warehouseName={name}
            warehouseId={warehouseId}
            shopId={shopId}
          />
        </ModalComponent>

        <ModalComponentContent
          isOpen={isWareHouseOpen}
          onClose={onClose}
          title={name + " Vitrinasi"}
        >
          <ViewWareHoustProducts idwarehouse={shopId} />
        </ModalComponentContent>
      </div>
    </div>
  );
}