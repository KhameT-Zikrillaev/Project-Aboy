// data/AdminCards.js
import {
  FaCog,
  FaChartLine,
} from "react-icons/fa";
import React from "react";

export const AdminCards = [
  {
    icon: React.createElement(FaCog, { className: "text-4xl text-white mb-4" }),
    title: "Админ панел",
    description: "Тизимни бошқариш",
    link: "/admin/admin-panel/storage",
  },
  {
    icon: React.createElement(FaChartLine, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Ҳисоботлар",
    description: "Аналитика ва статистика",
    link: "/admin/report",
  }
];