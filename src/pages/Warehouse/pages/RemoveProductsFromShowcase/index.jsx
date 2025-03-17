import React from "react";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Chilanzar", description: "Описание Chilanzar" },
  { id: 2, name: "Yunsabad", description: "Описание Yunsabad" },
  { id: 3, name: "Namangan", description: "Описание Namangan" },
  { id: 4, name: "Samarqand", description: "Описание Samarqand" },
  { id: 5, name: "Mirzo Ulug'bek", description: "Описание Mirzo Ulug'bek" },
  { id: 6, name: "Navoiy", description: "Описание Navoiy" },
];

export default function WarehouseProducts() {
  return (
    <div className="DirectorProduct mt-[150px] p-4">
      <h3 className="text-white mb-4">Список Магазинов</h3>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/warehouse/remove-from-showcase/${product.name}`}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}











// import React, { useState, useEffect } from 'react';
// import { Card, Pagination, Tag, Button } from 'antd';
// import 'antd/dist/reset.css';
// import bgsklad from '../../../../assets/images/bg-sklad.png';
// import SearchForm from './modules/SearchForm';
// import bg from '../../../../assets/images/bg-login.jpg';
// import ModalComponent from "@/components/modal/Modal";
// import DeleteProductVitrina from './modules/AddProductVitrina/DeleteProductVitrina';
// // Данные для магазинов
// const dataSource = [
//   { key: '1', name: 'Магазин "Синий океан"', location: 'Москва', category: 'Обои', photo: bg },
//   { key: '2', name: 'Магазин "Зеленый лес"', location: 'Санкт-Петербург', category: 'Обои', photo: bg },
//   { key: '3', name: 'Магазин "Красный закат"', location: 'Казань', category: 'Обои', photo: bg },
//   { key: '4', name: 'Магазин "Желтый песок"', location: 'Екатеринбург', category: 'Обои', photo: bg },
//   { key: '5', name: 'Магазин "Фиолетовый туман"', location: 'Новосибирск', category: 'Обои', photo: bg },
//   { key: '6', name: 'Магазин "Голубое небо"', location: 'Ростов-на-Дону', category: 'Обои', photo: bg },
//   { key: '7', name: 'Магазин "Розовый рассвет"', location: 'Сочи', category: 'Обои', photo: bg },
//   { key: '8', name: 'Магазин "Серый камень"', location: 'Владивосток', category: 'Обои', photo: bg },
//   { key: '9', name: 'Магазин "Белый снег"', location: 'Красноярск', category: 'Обои', photo: bg },
//   { key: '10', name: 'Магазин "Черная ночь"', location: 'Уфа', category: 'Обои', photo: bg },
//   { key: '11', name: 'Магазин "Оранжевый закат"', location: 'Самара', category: 'Обои', photo: bg },
//   { key: '12', name: 'Магазин "Коричневый дуб"', location: 'Омск', category: 'Обои', photo: bg },
//   { key: '13', name: 'Магазин "Бирюзовый океан"', location: 'Калининград', category: 'Обои', photo: bg },
//   { key: '14', name: 'Магазин "Лавандовый туман"', location: 'Тюмень', category: 'Обои', photo: bg },
//   { key: '15', name: 'Магазин "Мятный бриз"', location: 'Иркутск', category: 'Обои', photo: bg },
// ];

// export default function RemoveProductsFromShowcase() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(8);
//   const [filteredData, setFilteredData] = useState(dataSource);
//   const [selectedProduct, setSelectedProduct] = useState(null);




//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const showModal = (product) => {
//     setSelectedProduct(product); // Устанавливаем выбранный товар
//     setIsModalOpen(true);
//   };

//   const onClose = () => {
//     setIsModalOpen(false);
//     setSelectedProduct(null); // Сбрасываем выбранный товар при закрытии модального окна
//   };

//   // Функция для обновления количества элементов на странице
//   const updateItemsPerPage = () => {
//     setItemsPerPage(window.innerWidth < 768 ? 4 : 10);
//   };

//   useEffect(() => {
//     updateItemsPerPage();
//     window.addEventListener('resize', updateItemsPerPage);
//     return () => window.removeEventListener('resize', updateItemsPerPage);
//   }, []);

//   // Функция для обработки отправки товара в витрину
//   const handleSendToShowcase = (shop) => {
//    showModal(shop);
//   };

//   // Текущие данные для отображения
//   const currentData = filteredData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center p-1 relative"
//       style={{ backgroundImage: `url(${bgsklad})` }}
//     >
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

//       <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
//         <SearchForm data={dataSource} onSearch={setFilteredData} />

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
//           {currentData.map((shop) => (
//             <Card
//               key={shop.key}
//               className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
//               style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
//               cover={
//                 <div
//                   className="h-28 bg-cover bg-center rounded-t-lg"
//                   style={{ backgroundImage: `url(${shop.photo})` }}
//                 />
//               }
//               bodyStyle={{ padding: '12px', color: 'white' }}
//             >
//               <div className="flex flex-col gap-2">
//                 <h4 className="text-sm font-semibold text-white">{shop.name}</h4>
//                 <Tag color="blue">{shop.location}</Tag>
//                 <p className="text-gray-300 text-xs">Категория: {shop.category}</p>
//                 <Button
//               type="primary"
//               onClick={() => handleSendToShowcase(shop)}
//               style={{ backgroundColor: '#364153', borderColor: '#364153' }}
//               onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2b3445")}
//   onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#364153")}
//             >
//              Ochish
//             </Button>
//               </div>
//             </Card>
//           ))}
//         </div>

//         <div className="my-2 mb-12 md:mb-0 flex justify-center">
//           <Pagination
//             current={currentPage}
//             total={filteredData.length}
//             pageSize={itemsPerPage}
//             onChange={(page) => setCurrentPage(page)}
//             showSizeChanger={false}
//             className="text-white"
//           />
//         </div>
//       </div>
//       <ModalComponent
//         isOpen={isModalOpen}
//         onClose={onClose}
//         title={"Vitrinaga jo'natish"}
//       >
//        <DeleteProductVitrina onClose={onClose} product={selectedProduct} />
//       </ModalComponent>
//     </div>
//   );
// }