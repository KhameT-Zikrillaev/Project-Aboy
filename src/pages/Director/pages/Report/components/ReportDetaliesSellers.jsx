import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function ReportDetaliesSellers() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const { user } = useUserStore();

  const [filteredData, setFilteredData] = useState([]);
  const [filteredBySearch, setFilteredBySearch] = useState([]);
  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };
 const id = useParams()
  console.log(id?.name)
  const { data, isLoading,refetch} = useFetch(
    id?.name? `warehouse/${id?.name}` : null,
    `warehouse/${id?.name}`,
    {},
    { enabled: !!id?.name}
  );

  // Фильтрация складов при загрузке данных

  useEffect(() => {
    if (data?.data?.shops && user?.name) {
      // Приводим имя пользователя к нижнему регистру для сравнения
      const userName = user.name.toLowerCase();
      
      const filtered = data?.data?.shops?.filter(shop => {
        // Приводим имя склада к нижнему регистру для сравнения
        const shopName = shop?.name?.toLowerCase().trim();
        
        // Проверяем, содержится ли имя пользователя в имени склада
        const isUserShop = userName.includes(shopName);
        
        // console.log(`Склад: ${warehouse?.name}, Совпадение: ${isUserWarehouse}`);
        
        return !isUserShop; // Возвращаем true, если имя пользователя НЕ содержится в имени склада
      });
      
      console.log("Фильтрованные склады:", filtered);
      setFilteredData(filtered);
      setFilteredBySearch(filtered); // Изначально устанавливаем то же самое данные для поиска
    } else {
      setFilteredData(data?.data?.shops || []);
      setFilteredBySearch(data?.data?.shops || []);
    }
  }, [data, user?.name]);

  // Обработчик поиска, который работает с уже отфильтрованными данными
  const handleSearch = (searchResults) => {
    setFilteredBySearch(searchResults);
  };

  return (
    <div className="DirectorSeller mt-[150px] p-4">
      {/* Передаем отфильтрованные данные в компонент поиска */}
      <SearchForm 
        data={filteredData} 
        name="" 
        title="Sotuvchilar" 
        showDatePicker={false} 
        onSearch={handleSearch} 
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : filteredBySearch?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredBySearch?.slice(0, visibleDistricts)?.map((product) => (
            <Link
              key={product?.id}
              state={{ shopId: product?.id }}
              to={`/director/report/${id?.name}/${product?.name}`}
              className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h4>{product?.name}</h4>
              <p>{product?.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Ombor topilmadi
        </div>
      )}
      
      {visibleDistricts < filteredBySearch?.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreDistricts}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Yana
          </button>
        </div>
      )}
    </div>
  );
}
