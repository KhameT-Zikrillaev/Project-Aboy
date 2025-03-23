import React, { useState, useEffect } from "react";
import { Pagination, Spin, Empty } from "antd";
import "antd/dist/reset.css";
import { useParams, useLocation } from "react-router-dom";
import bgsklad from "@/assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import ReportCard from "@/components/reportCard";
export default function ReportDetalies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [filteredData, setFilteredData] = useState([]);
  const location = useLocation();
  const warehouseId = location.state?.warehouseId;
  const {user} = useUserStore()
  console.log(warehouseId);
  
  const { data, isLoading, refetch } = useFetch(`warehouse-transfers/${warehouseId}`, `warehouse-transfers/${warehouseId}`, {});
  
  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);
 console.log(data)
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
    if (data && data.length > 0) {
      if ((!searchTerm || searchTerm.trim() === '') && !date) {
        setFilteredData(data);
        setCurrentPage(1);
        return;
      }
      
      let filtered = [...data];
      
      if (searchTerm && searchTerm.trim() !== '') {
        const searchTermLower = searchTerm.toLowerCase();
        filtered = filtered.filter(item => {
          const sourceWarehouseName = item.sourceWarehouse?.name?.toLowerCase() || '';
          const destWarehouseName = item.destinationWarehouse?.name?.toLowerCase() || '';
          
          return sourceWarehouseName.includes(searchTermLower) || 
                 destWarehouseName.includes(searchTermLower);
        });
      }
      
      if (date) {
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(item => {
          if (!item.createdAt) return false;
          
          const itemDate = new Date(item.createdAt);
          return itemDate >= selectedDate && itemDate <= endOfDay;
        });
      }
      
      setFilteredData(filtered);
      setCurrentPage(1);
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
          data={data} 
          name="" 
          title="Hisobotlar omborlar" 
          showDatePicker={true} 
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
              <ReportCard key={item.id} item={item} />
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