// data/AdminCards.js
import {
  FaCog,
  FaListAlt,
  FaMoneyBillAlt,
  FaChartLine,
  FaShoppingCart,
  FaCashRegister,
} from "react-icons/fa";
import React from "react";

export const AdminCards = [
  {
    icon: React.createElement(FaCog, { className: "text-4xl text-white mb-4" }),
    title: "Admin panel",
    description: "Tizimni boshqarish",
    link: "/admin/admin-panel/statistics",
  },
  {
    icon: React.createElement(FaListAlt, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Kassa",
    description: "Moliya operatsiyalari",
    link: "/operations",
  },
  {
    icon: React.createElement(FaMoneyBillAlt, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Operatsiyalar tarixi",
    description: "Barcha tranzaksiyalarni ko'rish",
    link: "/close-cash",
  },
  {
    icon: React.createElement(FaChartLine, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Hisobotlar",
    description: "Analitika va statistika",
    link: "/main-reports",
  },
  {
    icon: React.createElement(FaShoppingCart, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Sotuvlar",
    description: "Sotuvlarni boshqarish",
    link: "/sales",
  },
  {
    icon: React.createElement(FaCashRegister, {
      className: "text-4xl text-white mb-4",
    }),
    title: "Xaridlar",
    description: "Xaridlarni boshqarish",
    link: "/purchases",
  },
];