import React, { useState, useEffect } from "react";
import "antd/dist/reset.css";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
const products = [
  { id: 1, name: "Chilanzar", description: "Описание Chilanzar" },
  { id: 2, name: "Yunsabad", description: "Описание Yunsabad" },
  { id: 3, name: "Qo'yliq", description: "Описание Chilanzar" },
  { id: 4, name: "Chinor", description: "Описание Chinor" },
  { id: 5, name: "Salar", description: "Описание Salar" },
  { id: 6, name: "Olamzor", description: "Описание Olamzor" },
];

export default function WarehouseOrderProducts() {
  const [filteredData, setFilteredData] = useState([]);
  const { data, isLoading, refetch } = useFetch('warehouse', 'warehouse', {});
  useEffect(() => {
    setFilteredData(data?.data?.warehouses)
  }, [data])
  return (
    <div className="DirectorProduct mt-[150px] p-4">
      <SearchForm data={data?.data?.warehouses} name="" title="Omborlar ro'yxati" showDatePicker={false} onSearch={setFilteredData} />
      <div className="grid grid-cols-2 gap-4">
        {filteredData?.map((product) => (
          <Link
            key={product.id}
            to={`/warehouse/order-products/${product.name}`}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
