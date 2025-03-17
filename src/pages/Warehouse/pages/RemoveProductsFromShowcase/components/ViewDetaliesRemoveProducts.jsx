import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Card, Pagination, Tag, Button} from 'antd';
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import ModalComponent from "@/components/modal/Modal";
import AddProductVitrina from "../modules/DeleteProductVitrina/DeleteProductVitrina";
import ImageModal from "@/components/modal/ImageModal";
import CustomCheckbox from "@/components/CustomCheckbox";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
export default function ViewDetaliesRemoveProducts() {
  const { name } = useParams(); // Получаем параметр name из URL
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUserStore();

// ~~~~~~~~~~~~~~~~~~~~~~логика товаров из апи~~~~~~~~~~~~~~~~~~~~~~~~~~
const id = user?.warehouse?.id;
const { data, isLoading, refetch } = useFetch(
  id ? `warehouse-products/${id}` : null, // Если id нет, не создаем ключ запроса
  id ? `warehouse-products/${id}` : null, // Если id нет, не делаем запрос
  {},
  {
    enabled: !! id, // Запрос будет выполнен только если id существует
  }
);
console.log(data)
// Update filteredData when data changes
useEffect(() => {
  if (data) {
    console.log("Data from API:", data);
    setFilteredData(data.map(item => ({
      ...item,
      key: item.product_id // используем product_id как key
    })));
  }
}, [data]);



  // Открытие модального окна
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const onClose = () => {
    setIsModalOpen(false);
  };

  // Изменение количества товаров на странице
  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 4 : 10);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Обработчик выбора товара
  const handleCheckboxChange = (item) => {
    setSelectedProducts((prev) =>
      prev.includes(item.product_id)
        ? prev.filter((id) => id !== item.product_id)
        : [...prev, item.product_id]
    );
  };
  const resetSelection = () => {
    setSelectedProducts([]); // Сбрасываем все выбранные элементы
  };
  
  // Функция для выбора всех товаров
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredData.map(item => item.product_id));
    }
  };

  // Текущие данные для отображения
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="min-h-screen bg-cover bg-center p-1 relative" style={{ backgroundImage: `url(${bgsklad})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm data={data} onSearch={setFilteredData} name={name +" " +'vitrinasiga'} title="Omboridigi mahsulotlarni yuborish" showDatePicker={false} />
        <div className='w-full flex justify-end'>
        <Button
          type=""
          onClick={handleSelectAll}
        
          style={{ marginBottom: '10px',backgroundColor: '#17212b',color: '#fff' }}
        >
          {selectedProducts.length === filteredData.length ? 'Hammasini yechish' : 'Hammasini tanlash'}
        </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full px-4">
          {currentData.map((item) => (
            <Card
            key={item.key}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
            style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            cover={
              <div
              onClick={() => setSelectedImage(item.photo)}
                className="h-28 bg-cover  bg-center rounded-t-lg"
                style={{ backgroundImage: `url(${item.photo})` }}
              />
            }
            bodyStyle={{ padding: '12px', color: 'white' }}
            onClick={() => handleCheckboxChange(item)}
          >
            <div className="flex flex-col gap-2">
              <Tag color="blue">Part: <span className="text-red-500">{item.code}</span></Tag>
              <h4 className="text-sm font-semibold text-white">{item.price + " $"}</h4>
              <div className='mt-[15px]'>
              <CustomCheckbox
  checked={selectedProducts.includes(item.product_id)}
  onChange={() => handleCheckboxChange(item)}
  label="Tanlash"
/>
                </div>
            </div>
          </Card>
          ))}
        </div>

        {filteredData.length > 0 && (
          <div className="my-2 mb-12 md:mb-0 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredData.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="text-white"
            />
          </div>
        )}
          <div className="w-full flex flex-col md:flex-row mt-2 mb-12 gap-2 justify-center items-center">
            <span className='bg-gray-700 py-[7px] max-w-[300px] w-full text-center h-[40px] text-white text-[18px] rounded-lg shadow-lg'>
              Tanlangan: {selectedProducts.length}
            </span>
            <Button
  type="primary"
  className='max-w-[300px] w-full'
  onClick={showModal}
  disabled={selectedProducts.length === 0} // Отключаем кнопку, если нет выбранных товаров
  style={{
    backgroundColor: selectedProducts.length === 0 ? '#888' : '#364153',
    borderColor: '#364153',
    fontSize: '18px',
    height: '40px',
    cursor: selectedProducts.length === 0 ? 'not-allowed' : 'pointer',
    opacity: selectedProducts.length === 0 ? 0.6 : 1,
  }}
  onMouseEnter={(e) => {
    if (selectedProducts.length > 0) e.currentTarget.style.backgroundColor = "#2b3445";
  }}
  onMouseLeave={(e) => {
    if (selectedProducts.length > 0) e.currentTarget.style.backgroundColor = "#364153";
  }}
>
  Yuborish
</Button>
          </div>
    

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />

        <ModalComponent
          isOpen={isModalOpen}
          onClose={onClose}
          title={ name + " " +"Vitrinasiga yuborish"}
        >
          <AddProductVitrina onClose={onClose} selectedProducts={selectedProducts} onSuccess={resetSelection}  />
        </ModalComponent>
      </div>
    </div>
  );
}