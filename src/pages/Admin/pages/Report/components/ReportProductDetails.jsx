import React, { useState, useEffect } from "react";
import { Card, Pagination, Spin, Empty, Tooltip, Badge } from "antd";
import "antd/dist/reset.css";
import bgsklad from "@/assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { format } from 'date-fns';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useLocation } from "react-router-dom";

export default function ReportWarehouseSend() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [filteredData, setFilteredData] = useState([]);
  const warehouseId = useLocation().state.warehouseId;
  const { data, isLoading  } = useFetch(`warehouse-transfers/${warehouseId}`, `warehouse-transfers/${warehouseId}`, {});

  useEffect(() => {
    if (data?.data && data?.data?.length > 0) {
      setFilteredData(data?.data);
    }
  }, [data?.data]);


  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(4); // For mobile devices
      } else {
        setItemsPerPage(9); // For desktop
      }
    };

    updateItemsPerPage(); // Call immediately when component mounts
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (searchTerm, date) => {
    if (data && data?.data > 0) {
      // Если нет поискового запроса и даты, показываем все данные
      if ((!searchTerm || searchTerm.trim() === '') && !date) {
        setFilteredData(data?.data);
        setCurrentPage(1);
        return;
      }
      
      let filtered = [...data?.data];
      
      // Фильтрация по поисковому запросу, если он есть
      if (searchTerm && searchTerm.trim() !== '') {
        const searchTermLower = searchTerm.toLowerCase();
        filtered = filtered.filter(item => {
          const sourceWarehouseName = item.sourceWarehouse?.name?.toLowerCase() || '';
          const destWarehouseName = item.destinationWarehouse?.name?.toLowerCase() || '';
          
          return sourceWarehouseName.includes(searchTermLower) || 
                 destWarehouseName.includes(searchTermLower);
        });
      }
      
      // Фильтрация по дате, если она выбрана
      if (date) {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0); // Начало дня
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999); // Конец дня
        
        filtered = filtered.filter(item => {
          if (!item.createdAt) return false;
          
          const itemDate = new Date(item.createdAt);
          return itemDate >= selectedDate && itemDate <= endOfDay;
        });
      }
      
      setFilteredData(filtered);
      setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <Badge status="success" text="Tasdiqlangan" />;
      case 'pending':
        return <Badge status="processing" text="Kutilmoqda" />;
      case 'rejected':
        return <Badge status="error" text="Rad etilgan" />;
      default:
        return <Badge status="default" text={status || 'Noma\'lum'} />;
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[110px]">
  
        <SearchForm 
          data={data?.data} 
          name="" 
          title="Hisobotlar omborlar" 
          showDatePicker={false} 
          onSearch={handleSearch} 
          className="w-full mb-6"
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <Spin size="large" />
          </div>
        ) : filteredData.length === 0 ? (
          <Empty 
            description={
              <span className="text-white">Ma'lumot topilmadi</span>
            } 
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full px-4">
            {currentData.map((item) => (
              <Card
                key={item.id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                bodyStyle={{ padding: "16px", color: "white" }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                        <Tooltip title="Manba ombor">
                          <span>{item.sourceWarehouse?.name || 'Noma\'lum'}</span>
                        </Tooltip>
                        <ArrowRightOutlined className="mx-2 text-yellow-400" />
                        <Tooltip title="Manzil ombor">
                          <span>{item.destinationWarehouse?.name || 'Noma\'lum'}</span>
                        </Tooltip>
                      </h3>
                      <div className="mb-2">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <Tooltip title="Yaratilgan sana">
                      <span className="text-xs text-gray-300">
                        {formatDate(item.createdAt)}
                      </span>
                    </Tooltip>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-300 mb-2">Mahsulotlar</h4>
                    {item.items && item.items.length > 0 ? (
                      <div className="space-y-3">
                        {item.items.map((product, index) => (
                          <div key={index} className="border-b border-gray-600 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{product.product?.article || 'Noma\'lum'}</span>
                              <span className="text-sm">{product.quantity} дона</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-300 mt-1">
                              <span>Партия: {product.product?.batch_number || 'Noma\'lum'}</span>
                              <Tooltip title="Narx o'zgarishi">
                                <span className={`${product.new_price > product.orginal_price ? 'text-green-400' : 'text-red-400'}`}>
                                  {product.orginal_price?.toLocaleString()} → {product.new_price?.toLocaleString()} $
                                </span>
                              </Tooltip>
                            </div>
                            {product.remarks && (
                              <p className="text-xs text-gray-400 mt-1 italic">Izoh: {product.remarks}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Mahsulotlar mavjud emas</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="my-0 mb-12 md:mb-2 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredData.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
}