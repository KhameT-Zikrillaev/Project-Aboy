import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Card, Pagination, Tag, Button, Spin } from "antd";
import "antd/dist/reset.css";
import bgsklad from "@/assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import ModalComponent from "@/components/modal/Modal";
import DeleteProductVitrina from "../modules/DeleteProductVitrina/DeleteProductVitrina";
import ImageModal from "@/components/modal/ImageModal";
import CustomCheckbox from "@/components/CustomCheckbox";
import useFetch from "@/hooks/useFetch";

export default function ViewDetaliesRemoveProducts() {
  const { name } = useParams(); // Получаем параметр name и shopId из URL
  const location = useLocation();
  const shopId = location.state?.shopId; // Получаем shopId из state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseId, setWarehouseId] = useState(""); // Для хранения ID склада
  // ~~~~~~~~~~~~~~~~~~~~~~логика товаров из апи~~~~~~~~~~~~~~~~~~~~~~~~~~
  // const id = user?.warehouse?.id;
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useFetch(
    shopId ? `Storefront-product/${shopId}` : null, // Если id нет, не создаем ключ запроса
    shopId ? `Storefront-product/${shopId}` : null, // Если id нет, не делаем запрос
    {},
    {
      enabled: !!shopId, // Запрос будет выполнен только если id существует
    }
  );

  //~~~~~~~~~~~~~~~~~~~~ логика шопах из апи~~~~~~~~~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    if (productsData?.data) {
      // Проверяем, что productsData является массивом
      if (Array.isArray(productsData?.data)) {
        setFilteredData(
          productsData?.data.map((item) => ({
            ...item,
            key: item.id, // используем id как key
          }))
        );
      } else {
        // Если данные не являются массивом, устанавливаем пустой массив
        setFilteredData([]);
      }
    } else {
      setFilteredData([]);
    }
  }, [productsData]);

  // Открытие модального окна
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const onClose = () => {
    setIsModalOpen(false);
  };

  // Изменение количества товаров на странице  АДАПТИВНОСТЬ
  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 4 : 10);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Обработчик выбора товара
  const handleCheckboxChange = (item) => {
    setSelectedProducts((prev) => {
      const isSelected = prev?.some((product) => product?.id === item?.id);
      if (isSelected) {
        return prev.filter((product) => product?.id !== item?.id);
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
    if (selectedProducts?.length === filteredData?.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredData); // Передаём массив объектов
    }
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Обработчик успешной отправки товаров
  const handleSuccessSubmit = () => {
    resetSelection(); // Сбрасываем выбранные товары
    refetchProducts(); // Обновляем данные с сервера
  };

  // Обработчик результатов поиска
  const handleSearchResults = (results) => {
    // Проверяем, что результаты поиска являются массивом
    if (Array.isArray(results)) {
      setFilteredData(results);
    } else if (results === null || results === undefined) {
      // Если результаты поиска null или undefined, возвращаемся к исходным данным
      if (Array.isArray(productsData)) {
        setFilteredData(
          productsData.map((item) => ({
            ...item,
            key: item.id,
          }))
        );
      } else {
        setFilteredData([]);
      }
    } else {
      setFilteredData([]);
    }
  };

  // Текущие данные для отображения
  const currentData = Array.isArray(filteredData)
    ? filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          data={productsData?.data}
          onSearch={handleSearchResults}
          name={name + ""}
          title="витринасини ўчириш"
          showDatePicker={false}
        />
        <div className="w-full flex justify-end">
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~select all~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Button
            type=""
            onClick={handleSelectAll}
            style={{
              marginBottom: "10px",
              backgroundColor: "#17212b",
              color: "#fff",
            }}
          >
            {selectedProducts?.length === filteredData?.length
              ? "Ҳаммасини ечиш"
              : "Ҳаммасини танлаш"}
          </Button>
        </div>
        {productsLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full px-4">
            {Array.isArray(currentData) && currentData?.length > 0 ? (
              currentData.map((item) => (
                <Card
                  key={item.key}
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                  cover={<div />}
                  bodyStyle={{ padding: "12px", color: "white" }}
                >
                  <img
                    onClick={() => setSelectedImage(item?.image_url)}
                    crossOrigin="anonymous"
                    className="h-48 w-full bg-cover cursor-pointer bg-center rounded-t-lg"
                    src={item?.image_url}
                    alt=""
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {item?.article}
                    </h3>
                    <Tag color="blue">
                      Партия:{" "}
                      <span className="text-red-500">{item?.batch_number}</span>
                    </Tag>
                    <h4 className="text-sm font-semibold text-white">
                      {item?.price + " $"}
                    </h4>
                    <div className="mt-[15px]">
                      <CustomCheckbox
                        checked={selectedProducts?.some(
                          (product) => product?.id === item?.id
                        )}
                        onChange={() => handleCheckboxChange(item)}
                        label="Танлаш"
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-5 text-center text-white text-xl py-10">
                Малумот топилмади
              </div>
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
              className="custom-pagination text-white"
            />
          </div>
        )}
        {filteredData?.length > 0 && (
          <div className="w-full flex flex-col md:flex-row mt-2 mb-12 gap-2 justify-center items-center">
            <span className="bg-gray-700 py-[7px] max-w-[300px] w-full text-center h-[40px] text-white text-[18px] rounded-lg shadow-lg">
            Танланган: {selectedProducts?.length}
            </span>
            <Button
              type="primary"
              className="max-w-[300px] w-full"
              onClick={showModal}
              disabled={selectedProducts?.length === 0} // Отключаем кнопку, если нет выбранных товаров
              style={{
                backgroundColor:
                  selectedProducts?.length === 0 ? "#888" : "#364153",
                borderColor: "#364153",
                fontSize: "18px",
                height: "40px",
                cursor:
                  selectedProducts?.length === 0 ? "not-allowed" : "pointer",
                opacity: selectedProducts?.length === 0 ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (selectedProducts?.length > 0)
                  e.currentTarget.style.backgroundColor = "#2b3445";
              }}
              onMouseLeave={(e) => {
                if (selectedProducts?.length > 0)
                  e.currentTarget.style.backgroundColor = "#364153";
              }}
            >
              Ўчириш
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
          title={name + " " + "Витринасидан ўчириш"}
        >
          <DeleteProductVitrina
            onClose={onClose}
            selectedProducts={selectedProducts}
            onSuccess={handleSuccessSubmit}
            warehouseName={name}
            shopId={shopId} // Передаем найденный ID магазина
          />
        </ModalComponent>
      </div>
    </div>
  );
}
