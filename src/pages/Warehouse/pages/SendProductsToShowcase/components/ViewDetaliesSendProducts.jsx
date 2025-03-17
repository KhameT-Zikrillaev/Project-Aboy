import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, Pagination, Tag, Button, Spin} from 'antd';
import 'antd/dist/reset.css';
import bgsklad from '@/assets/images/bg-sklad.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import ModalComponent from "@/components/modal/Modal";
import AddProductVitrina from "../modules/AddProductVitrina/AddProductVitrina";
import ViewWareHoustProducts from "../modules/ViewWareHouseProducts/ViewWareHoustProducts";
import ImageModal from "@/components/modal/ImageModal";
import CustomCheckbox from "@/components/CustomCheckbox";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";


export default function ViewDetaliesSendProducts() {
  const { name, shopId } = useParams(); // Получаем параметр name и shopId из URL
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState(""); // Для хранения ID склада
  const [shopIdState, setShopId] = useState(shopId); // Для хранения ID магазина
  const { user } = useUserStore();
  const [isWareHouseOpen, setIsWareHouseOpen] = useState(false);

  ///// ~~~~~~~~~~~~~~~ вот ~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Запрос на получение списка складов
  const { data: warehousesData, isLoading: warehousesLoading } = useFetch('warehouse', 'warehouse', {});

  // Находим ID склада по имени
  useEffect(() => {
    if (warehousesData?.data?.warehouses && name) {
      const foundWarehouse = warehousesData.data.warehouses.find(warehouse => warehouse.name === name);
      if (foundWarehouse) {
        setWarehouseId(foundWarehouse.id);
        console.log("Найден склад с ID:", foundWarehouse.id);
      } else {
        // Если не нашли склад по имени, используем ID склада пользователя
        if (user?.warehouse?.id) {
          setWarehouseId(user.warehouse.id);
          console.log("Используем ID склада пользователя:", user.warehouse.id);
        } else {
          console.error("Не удалось найти ID склада ни по имени, ни из данных пользователя");
        }
      }
    } else if (user?.warehouse?.id) {
      // Если нет данных о складах или имени, используем ID склада пользователя
      setWarehouseId(user.warehouse.id);
      console.log("Используем ID склада пользователя (запасной вариант):", user.warehouse.id);
    }
  }, [warehousesData, name, user]);

// ~~~~~~~~~~~~~~~~~~~~~~логика товаров из апи~~~~~~~~~~~~~~~~~~~~~~~~~~
const id = user?.warehouse?.id;
const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useFetch(
  id ? `warehouse-products/${id}` : null, // Если id нет, не создаем ключ запроса
  id ? `warehouse-products/${id}` : null, // Если id нет, не делаем запрос
  {},
  {
    enabled: !! id, // Запрос будет выполнен только если id существует
  }
);

//~~~~~~~~~~~~~~~~~~~~ логика шопах из апи~~~~~~~~~~~~~~~~~~~~~~~~~~
const userWarehouseId = user?.warehouse?.id;
console.log("ID склада пользователя:", userWarehouseId);

const { data: shopsData, isLoading: shopsLoading, refetch: refetchShops } = useFetch(
  userWarehouseId ? `warehouse/${userWarehouseId}` : null, // Если id нет, не создаем ключ запроса
  userWarehouseId ? `warehouse/${userWarehouseId}` : null, // Если id нет, не делаем запрос
  {},
  {
    enabled: !!userWarehouseId, // Запрос будет выполнен только если id существует
  }
);

// Выводим в консоль данные о магазинах (shops) и находим нужный shopId по имени
useEffect(() => {
  if (shopsData) {
    console.log("Shops Data from API:", shopsData);
    console.log("Shops:", shopsData?.data?.shops);
    
    // Ищем магазин по имени из URL-параметров
    if (shopsData?.data?.shops && shopsData.data.shops.length > 0 && name) {
      const foundShop = shopsData.data.shops.find(shop => shop.name === name);
      if (foundShop) {
        setShopId(foundShop.id);
        console.log("Найден магазин с именем", name, "и ID:", foundShop.id);
      } else {
        // Если не нашли магазин по имени, берем первый из списка (запасной вариант)
        if (shopsData.data.shops[0]) {
          setShopId(shopsData.data.shops[0].id);
          console.log("Не найден магазин с именем", name, ", используем первый из списка с ID:", shopsData.data.shops[0].id);
        } else {
          console.error("Не найдены магазины");
        }
      }
      
      // Выводим ID всех магазинов для отладки
      console.log("Shops IDs:", shopsData.data.shops.map(shop => shop.id));
      console.log("Shops Names:", shopsData.data.shops.map(shop => shop.name));
    }
  }
}, [shopsData, name]);

// Update filteredData when products data changes
useEffect(() => {
  if (productsData) {
    console.log("Products Data from API:", productsData);
    setFilteredData(productsData?.products?.map(item => ({
      ...item,
      key: item.id // используем id как key
    })));
  }
}, [productsData]);



  // Открытие модального окна
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const onClose = () => {
    setIsModalOpen(false);
    setIsWareHouseOpen(false);
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
    setSelectedProducts((prev) => {
      const isSelected = prev.some((product) => product.id === item.id);
      if (isSelected) {
        return prev.filter((product) => product.id !== item.id);
      } else {
        return [...prev, item]; // Добавляем весь объект товара
      }
    });
  };
  
  const resetSelection = () => {
    setSelectedProducts([]); // Сбрасываем все выбранные элементы
  };
  
  // Функция для выбора всех товаров
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredData); // Передаём массив объектов
    }
  };

  // Обработчик успешной отправки товаров
  const handleSuccessSubmit = () => {
    resetSelection(); // Сбрасываем выбранные товары
    refetchProducts(); // Обновляем данные с сервера
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
        <SearchForm data={productsData} onSearch={setFilteredData} name={name +" " +'omboriga'} title="Omboridigi mahsulotlarni yuborish" showDatePicker={false} />
        <div className='w-full flex justify-between'>


          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~view products~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Button
           style={{ marginBottom: '10px',backgroundColor: '#17212b',color: '#fff' }}
            onClick={() => setIsWareHouseOpen(true)}
            >Ombordigi mahsulotni ko'rish</Button>


             {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~select all~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Button
          type=""
          onClick={handleSelectAll}
        
          style={{ marginBottom: '10px',backgroundColor: '#17212b',color: '#fff' }}
        >
          {selectedProducts.length === filteredData.length ? 'Hammasini yechish' : 'Hammasini tanlash'}
        </Button>
        </div>
        {productsLoading ? (
  <div className="flex justify-center items-center h-[300px]">
    <Spin size="large" />
  </div>
      ):(
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full px-4">
  {currentData.map((item) => (
    <Card
      key={item.key}
      className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
      style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
      cover={
        <div
          onClick={() => setSelectedImage(item.photo)}
          className="h-28 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${item.photo})` }}
        />
      }
      bodyStyle={{ padding: '12px', color: 'white' }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">{item.article}</h3>
        <Tag color="blue">Part: <span className="text-red-500">{item.code}</span></Tag>
        <h4 className="text-sm font-semibold text-white">{item.price + " $"}</h4>
        <h5 className="text-sm font-semibold text-white">{item.quantity}</h5>
        <div className='mt-[15px]'>
          <CustomCheckbox
            checked={selectedProducts.some((product) => product.id === item.id)}
            onChange={() => handleCheckboxChange(item)}
            label="Tanlash"
          />
        </div>
      </div>
    </Card>
  ))}
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
          title={name + " " +"Vitrinasiga yuborish"}
        >
          <AddProductVitrina 
            onClose={onClose} 
            selectedProducts={selectedProducts} 
            onSuccess={handleSuccessSubmit} 
            warehouseName={name}
            warehouseId={warehouseId} // Передаем найденный ID склада
            shopId={shopIdState} // Передаем найденный ID магазина
          />
        </ModalComponent>
        <ModalComponent
          isOpen={isWareHouseOpen}
          onClose={onClose}
          title={name + " Mahsulotlari"}
        >
          <ViewWareHoustProducts idwarehouse={warehouseId} />
        </ModalComponent>
      </div>
    </div>
  );
}