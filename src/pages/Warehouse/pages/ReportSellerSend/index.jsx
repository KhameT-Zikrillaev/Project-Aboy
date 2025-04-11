import React, { useState, useEffect } from "react";
import bgsklad from "@/assets/images/bg-sklad.png";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import SearchForm from "@/components/SearchForm/SearchForm";
import { Link } from "react-router-dom";
import { Spin, Button } from "antd";

export default function ReportSellerSend() {
  const { user } = useUserStore();
  const warehouseId = user?.warehouse?.id;
  const [visibleShops, setVisibleShops] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMoreShops = () => {
    setVisibleShops(prev => prev + 12);
  };

  const { data, isLoading } = useFetch(
    warehouseId ? `shop/all-shops/${warehouseId}` : null,
    warehouseId ? `shop/all-shops/${warehouseId}` : null,
    {
      page: 1,
      limit: 100, // Загружаем больше данных для поиска
      ...(searchQuery && { name: searchQuery })
    },
    { enabled: !!warehouseId }
  );

  const handleShopClick = (shopId) => {
    sessionStorage.setItem("shopId", shopId);
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.name || "";
    setSearchQuery(searchValue);
    setVisibleShops(12); // Сброс при новом поиске
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          title="Сотувчилар"
          showDatePicker={false}
          searchBy="name"
          onSearch={onSearch}
          placeholder="Номи бўйича қидириш"
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {data?.data?.shops?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 w-full px-4">
                {data?.data?.shops?.slice(0, visibleShops).map((shop) => (
                  <Link
                    key={shop.id}
                    to={`/warehouse/report-seller-send/${shop.name}`}
                    onClick={() => handleShopClick(shop?.id)}
                    className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
                  >
                    <h4 className="font-medium">{shop?.name}</h4>
                    {shop?.description && (
                      <p className="text-gray-300">{shop?.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-10">
               Сотувчилар топилмади
              </div>
            )}
          </>
        )}

        {data?.data?.shops?.length > visibleShops && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={loadMoreShops}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Яна
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}