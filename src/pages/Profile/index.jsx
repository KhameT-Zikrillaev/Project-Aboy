import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Loading from "../../components/Loading/Loading";
import { AiOutlineUser } from "react-icons/ai";
import bgsklad from "../../assets/images/bg-sklad.png"; // Ваша картинка
import { AdminCards } from "./data/AdminCards.js"; // Импортируем данные
import { SkladCards } from "./data/SkladCards.js"; // Импортируем данные

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Определяем, какой текст и карточки отображать в зависимости от маршрута
  let userRole = "";
  let cards = [];

  if (location.pathname === "/Admin") {
    userRole = "Administrator";
    cards = AdminCards;
  } else if (location.pathname === "/warehouse") {
    userRole = "Skladchik";
    cards = SkladCards;
  } else {
    // Если маршрут не /admin и не /sklad, можно ничего не отображать или показать что-то нейтральное
    userRole = "User";
    cards = []; // Пустой массив, чтобы ничего не отображать
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      {isLoading && <Loading />}
      <Navbar />

      {/* Размытый фон */}
      <div className="absolute hidden md:block inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

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
                <span className="text-xl font-semibold text-white">{card.title}</span>
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