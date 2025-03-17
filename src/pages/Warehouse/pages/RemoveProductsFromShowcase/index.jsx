import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm/SearchForm";

const products = [
  { id: 1, name: "Chilanzar", description: "Описание Chilanzar" },
  { id: 2, name: "Yunsabad", description: "Описание Yunsabad" },
  { id: 3, name: "Namangan", description: "Описание Namangan" },
  { id: 4, name: "Samarqand", description: "Описание Samarqand" },
  { id: 5, name: "Mirzo Ulug'bek", description: "Описание Mirzo Ulug'bek" },
  { id: 6, name: "Navoiy", description: "Описание Navoiy" },
];

export default function WarehouseProducts() {
  const [visibleDistricts, setVisibleDistricts] = useState(12);
  const [filteredData, setFilteredData] = useState(products);
  const loadMoreDistricts = () => {
    setVisibleDistricts((prevVisibleDistricts) => prevVisibleDistricts + 12);
  };
  return (
    <div className="DirectorProduct mt-[150px] p-4">
       <SearchForm data={products} name="" title="Sotuvchilar" showDatePicker={false} onSearch={setFilteredData} />
      <div className="grid grid-cols-2 gap-4">
        {filteredData.slice(0, visibleDistricts).map((product) => (
          <Link
            key={product.id}
            to={`/warehouse/remove-from-showcase/${product.name}`}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </Link>
        ))}
      </div>
      {visibleDistricts < filteredData.length && (
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
