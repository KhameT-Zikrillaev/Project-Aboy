import React from "react";
import Navbar from "@/components/Navbar/Navbar"; // Импортируйте ваш Navbar
import SideBar from "./components/SideBar"; // Создайте SideBar (см. ниже)
import { Outlet } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Основной контент с сайдбаром и правым контейнером */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />
        {/* Правый контейнер для отображения контента */}
        <div className="flex-1 overflow-y-auto p-8 md:ml-64 mt-[105px] bg-gray-900">
          <div className="w-full h-full bg-[#17212b] rounded-xl">
            <Outlet />
          </div>{" "}
          {/* Здесь будут отображаться вложенные маршруты (статистика, пользователи) */}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
