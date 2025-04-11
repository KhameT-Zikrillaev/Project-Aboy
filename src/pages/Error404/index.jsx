import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate(); // useNavigation emas, useNavigate ishlatilishi kerak

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <h2 className="text-2xl font-semibold text-gray-300 mt-4">
        Оопс! Саҳифа топилмади
      </h2>
      <p className="text-gray-400 mt-2">Сиз излаётган саҳифа мавжуд эмас.</p>
      <button
        onClick={() => navigate(-1)} // Oldingi sahifaga qaytaradi
        className="mt-6 px-6 py-3 bg-gray-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
      >
        Орқага қайтиш
      </button>
    </div>
  );
};

export default NotFound;
