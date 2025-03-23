import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar";
import Loading from "@/components/Loading/Loading";
import { AiOutlineUser } from "react-icons/ai";
import bgsklad from "../../assets/images/bg-sklad.png"; // Ваша картинка
import { AdminCards } from "./data/AdminCards.js"; // Импортируем данные
import { SkladCards } from "./data/WarehouseCards.js"; // Импортируем данные
import { SellerCards } from "./data/SellerCards.js";
import { DirectorCards } from "./data/DirectorCards.js";
// import  useUserStore  from "@/store/useUser";
// import useRequest from "./components/useRequest.jsx";
// import useRequestShop from "./components/useRequestShop.jsx";
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  // const {user} = useUserStore();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  // useRequest(user?.role, user?.warehouse?.id);
  // useRequestShop(user, user?.warehouse?.id);

  // Определяем, какой текст и карточки отображать в зависимости от маршрута
  let userRole = "";
  let cards = [];

  if (location.pathname === "/admin") {
    userRole = "Admin";
    cards = AdminCards;
  } else if (location.pathname === "/warehouse") {
    userRole = "Omborchi";
    cards = SkladCards;
  } else if (location.pathname === "/seller") {
    userRole = "Sotuvchi";
    // Если роль пользователя - user, удаляем последний элемент из SellerCards
    cards = user?.role === "user" ? SellerCards.slice(0, -1) : SellerCards;
  } else if (location.pathname === "/director") {
    userRole = "Direktor";
    cards = DirectorCards;
  } else {
    // Если маршрут не /admin и не /sklad, можно ничего не отображать или показать что-то нейтральное
    userRole = "User";
    cards = []; // Пустой массив, чтобы ничего не отображать
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center p-2"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      {isLoading && <Loading />}
      <Navbar />

      {/* Размытый фон */}
      <div className="absolute min-h-screen hidden md:block inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      {/* Основной контент */}
      <div className="relative z-0 flex flex-col items-center justify-center mt-[120px]">
        {/* Блок с пользователем */}
        <div className="flex items-center justify-center gap-3 mb-2 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-300">
          <AiOutlineUser className="text-3xl text-white" />
          <span className="text-xl font-semibold text-white">{userRole}</span>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Boshqaruv paneli</h1>
          <p className="text-gray-200">Boshqaruv paneliga kirish uchun bo'limni tanlang</p>
        </div>

        {/* Кнопки */}
        {cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
            {cards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className="flex flex-col items-center justify-center p-8 bg-black/50 md:bg-white/10 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                {card.icon}
                <span className="text-xl text-center font-semibold text-white">{card.title}</span>
                <p className="text-gray-200 text-center mt-2">{card.description}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Если карточек нет (например, для других маршрутов) */}
        {cards.length === 0 && (
          <div className="text-center">
            <p className="text-white">Нет доступных карточек для этого маршрута.</p>
          </div>
        )}
      </div>
    </div>
  );
}