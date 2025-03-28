import React, { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { Card, Spin, Empty, Tag, Pagination } from "antd";

export default function ViewWareHoustProducts({ idwarehouse }) {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [selectedImage, setSelectedImage] = useState(null);

  // Проверяем, что idwarehouse передается корректно

  // Исправляем параметры useFetch
  const { data, isLoading, refetch } = useFetch(
    `warehouse-products/byWarehouse/${idwarehouse}`, // Уникальный ключ для кеширования
    `warehouse-products/byWarehouse/${idwarehouse}`, // URL запроса
    {}, // Параметры запроса
    {
      enabled: !!idwarehouse, // Запрос будет выполнен только если id существует
      staleTime: 0, // Данные всегда считаются устаревшими
      cacheTime: 0, // Не кешируем данные
    }
  );

  // Вызываем refetch при изменении idwarehouse
  useEffect(() => {
    if (idwarehouse) {
      // Очищаем данные при изменении idwarehouse
      setFilteredData([]);
      setCurrentPage(1);
      // Запрашиваем новые данные
      refetch();
    }
  }, [idwarehouse, refetch]);

  // Обновляем filteredData при изменении data
  useEffect(() => {
    if (data?.data?.products) {
      setFilteredData(data?.data?.products);
    } else if (data?.products) {
      // Альтернативная структура данных
      setFilteredData(data?.products);
    } else {
      // Если данных нет, устанавливаем пустой массив
      setFilteredData([]);
    }
  }, [data]);

  // Проверяем данные, которые пришли с сервера
  // Расчет пагинации
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData?.slice(startIndex, endIndex);

  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Если данные загружаются, показываем спиннер
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Если данных нет, показываем компонент Empty
  if (!filteredData || filteredData?.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Empty description="Нет данных для отображения" />
      </div>
    );
  }

  // Отображаем данные в виде списка карточек
  return (
    <div className="p-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-2 w-full px-4">
        {currentData?.map((item) => (
          <Card
            key={item?.id}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
            style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            cover={
              <img  onClick={() => setSelectedImage(item?.image_url)} crossOrigin='anonymous' className="h-28 w-full bg-cover object-cover cursor-pointer bg-center rounded-t-lg"  src={item?.image_url} alt=""/>
            }
            bodyStyle={{ padding: '12px', color: 'white' }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-white">{item?.article || item?.name || 'Без названия'}</h3>
              <Tag color="blue">Партия: <span className="text-red-500">{item?.batch_number || 'N/A'}</span></Tag>
              <h4 className="text-sm font-semibold text-white">{(item?.price || 0) + " $"}</h4>
              <h5 className="text-sm font-semibold text-white">Рулон сони: {item?.quantity || 0} ta</h5>
            </div>
          </Card>
        ))}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData?.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* Модальное окно с изображением */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-[450px] max-h-[80vh] overflow-auto bg-white rounded-lg shadow-xl">
            <img src={selectedImage} crossOrigin='anonymous' alt="Увеличенное изображение" className="max-w-full max-h-full object-contain" />
            <button 
              className="absolute top-0 right-2  bg-white/50 cursor-pointer text-white w-8 h-8 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}