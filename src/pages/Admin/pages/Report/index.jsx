import React, { useState } from "react";
import "antd/dist/reset.css";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { FaWarehouse } from "react-icons/fa";
import { Input } from "antd";

const { Search } = Input;

export default function Report() {
  const [term, setTerm] = useState('');
  // const { name } = useParams();
  
  const { data, isLoading } = useFetch('warehouse', 'warehouse', {name: term ?? null});


  return (
    <div className="DirectorProduct mt-[150px] p-4">
      <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all duration-300">
      <div className="flex justify-center md:justify-start items-center">
        <FaWarehouse className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">
          Omborlar
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 w-full">
          <Search
            placeholder="Qidirish"
            onChange={(e) => setTerm(e.target.value)}
            value={term}
            enterButton
            className="custom-search max-w-md"
          />
        </div>
      </div>
    </div>
      <div className="grid grid-cols-2 gap-4">
        {data?.data?.warehouses?.map((product) => (
          <Link
            key={product.id}
            to={`/admin/report/${product.name}`}
            state={{warehouseId: product.id}}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{product.name}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
