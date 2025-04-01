import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import { Spin } from "antd";
import useUserStore from "@/store/useUser";

export default function Shop() {
  const [visibleShops, setVisibleShops] = useState(12);
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, refetch } = useFetch(
    user?.warehouse?.id ? `shop/all-shops/${user?.warehouse?.id}` : null,
    user?.warehouse?.id ? `shop/all-shops/${user?.warehouse?.id}` : null,
    {
      page,
      limit,
      ...(searchQuery && { name: searchQuery })
    },
    { enabled: !!user?.warehouse?.id }
  );

  const loadMoreShops = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.name || "";
    setSearchQuery(searchValue);
    setPage(1);
    setVisibleShops(12);
  };

  return (
    <div className="WarehouseTransferProduct mt-[150px] p-4 max-w-[1440px] mx-auto">
      <SearchForm 
        name=""
        title="Дўконлар" 
        showDatePicker={false}
        searchBy="name"
        onSearch={onSearch}
        placeholder="Дўкон номи бўйича қидириш"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : data?.data?.shops?.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {data.data.shops.slice(0, visibleShops).map((shop) => (
            <Link
              key={shop.id}
              to={`/warehouse/shop/${shop.id}`}
              className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <h4>{shop.name}</h4>
              {shop.description && <p>{shop.description}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-400">
          Дўкон топилмади
        </div>
      )}
      
      {data?.data?.shops?.length >= limit && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreShops}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Яна
          </button>
        </div>
      )}
    </div>
  );
}