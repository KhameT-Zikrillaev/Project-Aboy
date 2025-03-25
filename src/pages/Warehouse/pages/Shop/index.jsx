import React from "react";
import {  Spin } from "antd";
import "antd/dist/reset.css";
import bgsklad from "../../../../assets/images/bg-sklad.png";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import { FaArchive } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Shop() {
  const { user } = useUserStore();

  const { data, isLoading } = useFetch(
    `warehouse/${user?.warehouse?.id}`,
    `warehouse/${user?.warehouse?.id}`
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
          {/* Логотип и заголовок */}
          <div className="flex justify-center md:justify-start items-center">
            <FaArchive className="text-3xl text-white" />
            <span className="text-xl font-semibold ml-2 text-white">
              Do'konlar
            </span>
          </div>

          {/* Поле для выбора диапазона дат */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* <Search
          placeholder="Qidirish"
          onChange={(e) => handleSearch(e.target.value)}
          enterButton
          className="custom-search max-w-md"
        /> */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full px-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {data?.data?.shops?.map((product) => (
            <Link
              key={product?.id}
              to={`/warehouse/shop/${product?.id}`}
              className="flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700 
              text-white text-lg font-semibold p-4 rounded-lg shadow-md 
              hover:shadow-lg hover:scale-101 transition-all duration-300"
            >
              {product?.name}
            </Link>
          ))}
        </div>
      )}
    </div>
      </div>
    </div>
  );
}
