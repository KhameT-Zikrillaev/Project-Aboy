import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import { Spin, Pagination } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function WarehouseProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUserStore();
  const warehouseId = user?.warehouse?.id;

  const { data, isLoading, refetch } = useFetch(
    warehouseId ? `shop/all-shops/${warehouseId}` : null,
    warehouseId ? `shop/all-shops/${warehouseId}` : null,
    {
      page: currentPage,
      limit: itemsPerPage,
      ...(searchQuery && { name: searchQuery })
    },
    {
      enabled: !!warehouseId,
    }
  );

  useEffect(() => {
    if (data?.data?.shops) {
      setFilteredData(data.data.shops);
    } else {
      setFilteredData([]);
    }
  }, [data]);

  const onSearch = (searchParams) => {
    const searchValue = searchParams.name || "";
    setSearchQuery(searchValue);
    setCurrentPage(1);
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 6 : 12);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
          <LeftOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
          <RightOutlined />
        </button>
      );
    }
    return originalElement;
  };

  return (
    <div className="DirectorProduct mt-[150px] p-4">
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
          {filteredData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredData.map((shop) => (
                  <Link
                    key={shop?.id}
                    state={{ shopId: shop?.id }}
                    to={`/warehouse/send-to-showcase/${shop?.name}`}
                    className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
                  >
                    <h4 className="text-lg font-medium">{shop?.name}</h4>
                    <p className="text-gray-300">
                      {shop?.description || "Тавсиф мавжуд эмас"}
                    </p>
                  </Link>
                ))}
              </div>

              {data?.data?.total > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={currentPage}
                    total={data?.data?.total}
                    pageSize={itemsPerPage}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    className="custom-pagination"
                    itemRender={itemRender}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-[100px] text-xl text-gray-500">
              Сотувчилар топилмади
            </div>
          )}
        </>
      )}
    </div>
  );
}