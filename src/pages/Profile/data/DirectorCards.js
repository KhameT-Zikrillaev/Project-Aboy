// data/AdminCards.js
import {
  FaListAlt,
  FaChartLine,
  FaUserTie, // Иконка для продавцов
} from "react-icons/fa";
import React from "react";

export const DirectorCards = [
  {
    icon: React.createElement(FaChartLine, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Ҳисоботлар",
    description: "Аналитика ва статистика",
    link: "/director/report",
  },
  {
    icon: React.createElement(FaListAlt, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Маҳсулотлар",
    description: "Маҳсулотлар рўйхати",
    link: "/director/product-list",
  },
  {
    icon: React.createElement(FaUserTie, { // Используем FaUserTie для продавцов
      className: "text-4xl text-white mb-4",
    }),
    title: "Сотувчилар",
    description: "Сотувчилар",
    link: "/director/seller-list",
  },
];