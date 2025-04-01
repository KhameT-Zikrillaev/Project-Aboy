import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function CashRegister() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUserStore();
  const warehouseId = user?.warehouse?.id;

  const { data: shops, isLoading } = useFetch(
    warehouseId ? `shop/all-shops/${warehouseId}` : null,
    warehouseId ? `shop/all-shops/${warehouseId}` : null,
    {
      ...(searchQuery && { name: searchQuery })
    },
    {
      enabled: !!warehouseId
    }
  );

  const onSearch = (searchParams) => {
    const searchValue = searchParams.name || "";
    setSearchQuery(searchValue);
    setPage(1);
    setVisibleShops(12);
  };

  return (
    <div className="DirectorProduct pt-[150px] p-4 max-w-[1440px] mx-auto">
      <SearchForm 
        name=""
        title="Сотувчилар" 
        showDatePicker={false}
        searchBy="name"
        onSearch={onSearch}
        placeholder="Сотувчи номи бўйича қидириш"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : shops?.data?.shops?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {shops?.data?.shops.map((shop) => (
            <Link
              key={shop.id}
              to={`/warehouse/cash-register/${shop.name}`}
              state={{ shopId: shop.id }}
              className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h4>{shop.name}</h4>
              {shop.description && <p>{shop.description}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Сотувчилар топилмади
        </div>
      )}
    </div>
  );
}