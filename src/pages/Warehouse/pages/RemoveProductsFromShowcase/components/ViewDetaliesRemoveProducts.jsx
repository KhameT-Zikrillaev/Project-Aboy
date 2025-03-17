import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Card, Pagination, Tag, Button, Checkbox } from 'antd';
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import bg from '@/assets/images/bg-login.jpg';
import ModalComponent from "@/components/modal/Modal";
import DeleteProductVitrina from "../modules/DeleteProductVitrina/DeleteProductVitrina";
import ImageModal from "@/components/modal/ImageModal";
import CustomCheckbox from "@/components/CustomCheckbox";
const products = [
  { id: 1, name: "Chilanzar", description: "Описание Chilanzar" },
  { id: 2, name: "Yunsabad", description: "Описание Yunsabad" },
  { id: 3, name: "Namangan", description: "Описание Namangan" },
  { id: 4, name: "Samarqand", description: "Описание Samarqand" },
  { id: 5, name: "Mirzo Ulug'bek", description: "Описание Mirzo Ulug'bek" },
  { id: 6, name: "Navoiy", description: "Описание Navoiy" },
];

const dataSource = [
  { key: '1', code: 'OB001', name: 'Обои "Синий океан"', color: '#0000FF', price: '1000 руб', stock: 10, photo: bg },
  { key: '2', code: 'OB002', name: 'Обои "Зеленый лес"', color: '#008000', price: '1200 руб', stock: 5, photo: bg },
  { key: '3', code: 'OB003', name: 'Обои "Красный закат"', color: '#FF0000', price: '1100 руб', stock: 8, photo: bg },
  { key: '4', code: 'OB004', name: 'Обои "Желтый песок"', color: '#FFFF00', price: '900 руб', stock: 15, photo: bg },
  { key: '5', code: 'OB005', name: 'Обои "Фиолетовый туман"', color: '#800080', price: '1300 руб', stock: 3, photo: bg },
  { key: '6', code: 'OB006', name: 'Обои "Голубое небо"', color: '#87CEEB', price: '950 руб', stock: 7, photo: bg },
  { key: '7', code: 'OB007', name: 'Обои "Розовый рассвет"', color: '#FFC0CB', price: '1050 руб', stock: 12, photo: bg },
  { key: '8', code: 'OB008', name: 'Обои "Серый камень"', color: '#808080', price: '800 руб', stock: 20, photo: bg },
  { key: '9', code: 'OB009', name: 'Обои "Белый снег"', color: '#FFFFFF', price: '1000 руб', stock: 0, photo: bg },
  { key: '10', code: 'OB010', name: 'Обои "Черная ночь"', color: '#000000', price: '1400 руб', stock: 6, photo: bg },
  { key: '11', code: 'OB011', name: 'Обои "Оранжевый закат"', color: '#FFA500', price: '1150 руб', stock: 9, photo: bg },
  { key: '12', code: 'OB012', name: 'Обои "Коричневый дуб"', color: '#A52A2A', price: '1250 руб', stock: 4, photo: bg },
  { key: '13', code: 'OB013', name: 'Обои "Бирюзовый океан"', color: '#40E0D0', price: '1350 руб', stock: 15, photo: bg },
  { key: '14', code: 'OB014', name: 'Обои "Лавандовый туман"', color: '#E6E6FA', price: '950 руб', stock: 12, photo: bg },
  { key: '15', code: 'OB015', name: 'Обои "Мятный бриз"', color: '#98FF98', price: '1100 руб', stock: 7, photo: bg },
];

export default function ViewDetaliesRemoveProducts() {
  const { name } = useParams(); // Получаем параметр name из URL
  const product = products.find((p) => p.name === name);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState(dataSource);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      prev.includes(item.key)
        ? prev.filter((key) => key !== item.key)
        : [...prev, item.key]
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
      setSelectedProducts(filteredData.map(item => item.key));
    }
  };

  // Текущие данные для отображения
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!product) {
    return <div>Продукт не найден</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center p-1 relative" style={{ backgroundImage: `url(${bgsklad})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm data={dataSource} onSearch={setFilteredData} name={name} title="Vitrinasi" showDatePicker={false} />
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
              <h4 className="text-sm font-semibold text-white">{item.name}</h4>
              <div className='mt-[15px]'>
              <CustomCheckbox
  checked={selectedProducts.includes(item.key)}
  onChange={() => handleCheckboxChange(item)}
  label="Tanlash"
/>
                </div>
            </div>
          </Card>
            // <Card
            //   key={item.key}
            //   className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
            //   style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            //   cover={
            //     <div
            //       onClick={() => setSelectedImage(item.photo)}
            //       className="h-44 bg-cover bg-center rounded-t-lg"
            //       style={{ backgroundImage: `url(${item.photo})` }}
            //     />
            //   }
            //   bodyStyle={{ padding: '12px', color: 'white' }}
            // >
            //   <div className="flex flex-col gap-2">
            //     <Tag color="blue">{item.code}</Tag>
            //     <h4 className="text-sm font-semibold text-white">{item.name}</h4>
            //     <Tag style={{ backgroundColor: item.color, color: '#fff' }}>{item.color}</Tag>
            //     <div className='mt-[15px]'>
            //       <Checkbox
            //         className="absolute bottom-0.5 items-cente"
            //         style={{ color: 'white' }}
            //         checked={selectedProducts.includes(item.key)}
            //         onChange={() => handleCheckboxChange(item)}
            //       >
            //         Tanlash
            //       </Checkbox>
            //     </div>
            //   </div>
            // </Card>
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

        {filteredData.length > 0 && (
          <div className="w-full flex flex-col md:flex-row mt-2 mb-12 gap-2 justify-center items-center">
            <span className='bg-gray-700 py-[7px] max-w-[300px] w-full text-center h-[40px] text-white text-[18px] rounded-lg shadow-lg'>
              Tanlangan: {selectedProducts.length}
            </span>
            <Button
  type="primary"
  danger
  className='max-w-[300px] w-full'
  onClick={showModal}
  disabled={selectedProducts.length === 0} // Отключаем кнопку, если нет выбранных товаров
  style={{
    backgroundColor: selectedProducts.length === 0 ? '#888' : '#364153',

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
  O'chirish
</Button>
          </div>
        )}

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />

        <ModalComponent
          isOpen={isModalOpen}
          onClose={onClose}
          title={ name + " " +"Vitrinadan o'chirish"}
        >
          <DeleteProductVitrina onClose={onClose} selectedProducts={selectedProducts} onSuccess={resetSelection}  />
        </ModalComponent>
      </div>
    </div>
  );
}