import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Импортируем Link, useNavigate и useLocation из react-router-dom
import { FaArrowLeft } from "react-icons/fa"; // Импортируем иконку стрелки назад
import logo from "@/assets/images/logo.png"; // Укажите правильный путь к вашему логотипу
import useUserStore from "@/store/useUser";
import { TbBellRinging2Filled } from "react-icons/tb";
import { Badge, Spin } from "antd";
import api from "@/services/api";
import PendingCardWarehouse from "../requestCards/PendingCardWarehouse";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useUserStore();
  const [openNotification, setOpenNotification] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleGoBack = () => {
    // Переход на родительский маршрут вместо истории браузера
    const pathParts = location.pathname.split("/");

    // Если мы находимся на глубине больше 2 уровней, вернемся на родительский маршрут
    if (pathParts.length > 2) {
      // Удаляем последний сегмент пути
      pathParts.pop();
      const parentPath = pathParts.join("/");
      navigate(parentPath);
    } else {
      // Если мы на верхнем уровне, просто идем назад по истории
      navigate(-1);
    }
  };

  const fetchRequests = useCallback(async () => {
    if (user?.role !== "staff") return;
    setLoading(true);
    try {
      const [warehouseRes, shopRes] = await Promise.all([
        api.get(`warehouse-requests/pending-requests/${user?.warehouse?.id}`),
        api.get(`shop-request/pending-requests/${user?.warehouse?.id}`),
      ]);
      const combinedRequests = [
        ...(warehouseRes?.data || []),
        ...(shopRes?.data || []),
      ];
      setRequests(combinedRequests);
    } catch (error) {
      console.error("Xatolik yuz berdi", error);
    }finally{
      setLoading(false);
    }
  }, [user?.role, user?.warehouse?.id, user?.id]);

  useEffect(() => {
    fetchRequests();
    const intervalId = setInterval(fetchRequests, 60000);
    return () => clearInterval(intervalId);
  }, [fetchRequests]);

  const handleOutsideClick = (e) => {
    if (openNotification) {
      setOpenNotification(false);
    }
  };

  return (
    <div className="w-full h-[105px] left-0 top-0 flex justify-between fixed z-10 items-center mb-6 md:mb-10 py-6 px-6 md:px-6 bg-[#17212b] rounded-lg shadow-xl">
      {/* Логотип и кнопка "Назад" */}
      <div className="left-content flex items-center space-x-4">
        {/* Кнопка "Назад" с иконкой */}
        <button
          onClick={handleGoBack}
          className="cursor-pointer hover:text-yellow-700 transition-all duration-300 ease-in-out"
        >
          <FaArrowLeft className=" h-4 w-4 md:h-6 md:w-6 text-yellow-200 " />{" "}
          {/* Иконка стрелки назад */}
        </button>

        {/* Логотип */}
        <div>
          <img
            className="glowing-image  max-w-[50px] ml-4 md:max-w-[100px] w-full"
            src={logo}
            alt="Logo"
          />
        </div>
      </div>

      {/* Правая часть: Имя пользователя и кнопка выхода */}
      <div className="right-content flex items-center space-x-4">
        {(user?.role === "staff" || user?.role === "seller") && (
          <div
            className="text-gray-100 text-[30px] mr-5 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenNotification(!openNotification);
            }}
          >
            <Badge count={requests?.length} size="small">
              <TbBellRinging2Filled className="text-gray-100 text-[30px]" />
            </Badge>
          </div>
        )}
        <div className="text-right">
          <h2 className="text-sm md:text-lg font-semibold text-white">
            {user?.name} <br />{" "}
            <span className="text-blue-600">{user?.role}</span>
          </h2>
        </div>
        <Link
          to="/"
          onClick={() => {
            localStorage.removeItem("tokenWall");
          }}
          className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-700 hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out border border-white/20 hover:border-white/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Chiqish
        </Link>
      </div>
      {openNotification && (
        <div
          className="fixed inset-0 bg-transparent w-full h-full z-[1000000]"
          onClick={handleOutsideClick}
        ></div>
      )}
      <div
        className={`p-2 absolute h-screen w-[400px] z-[100000000]  top-0 ${
          openNotification ? "right-0" : "-right-full"
        } bg-[#17212b] transition-all duration-300 ease-in-out overflow-y-scroll`}
      >
        <div className="flex flex-col gap-2">
        {
         requests?.length === 0 ? <p className="text-gray-100 text-center mt-10">Xabarlar mavjud emas</p> : requests?.map((request) => (
          <PendingCardWarehouse fetchRequests={fetchRequests} key={request.id} item={request} />
        ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
