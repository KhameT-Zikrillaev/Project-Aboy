import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Импортируем Link, useNavigate и useLocation из react-router-dom
import { FaArrowLeft } from "react-icons/fa"; // Импортируем иконку стрелки назад
import logo from "@/assets/images/logo.png"; // Укажите правильный путь к вашему логотипу
import useUserStore from "@/store/useUser";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useUserStore();
  const handleGoBack = () => {
    // Переход на родительский маршрут вместо истории браузера
    const pathParts = location.pathname.split('/');
    
    // Если мы находимся на глубине больше 2 уровней, вернемся на родительский маршрут
    if (pathParts.length > 2) {
      // Удаляем последний сегмент пути
      pathParts.pop();
      const parentPath = pathParts.join('/');
      navigate(parentPath);
    } else {
      // Если мы на верхнем уровне, просто идем назад по истории
      navigate(-1);
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
          <FaArrowLeft className=" h-4 w-4 md:h-6 md:w-6 text-yellow-200 " /> {/* Иконка стрелки назад */}
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
        <div className="text-right">
          <h2 className="text-sm md:text-lg font-semibold text-white">
            {user?.name} <br />{" "}
            <span className="text-blue-600">{user?.role}</span>
          </h2>
        </div>
        <Link
          to="/"
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
    </div>
  );
};

export default Navbar;