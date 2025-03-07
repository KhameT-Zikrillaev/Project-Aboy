// data/ProductManagementCards.js
import {
    FaBox,
    FaTruck,
    FaWarehouse,
    FaCashRegister,
    FaArchive,
    FaStore,
    FaUndo,
    FaShoppingCart,
  } from "react-icons/fa";
  import React from "react";
  
  export const SkladCards = [
    {
      icon: React.createElement(FaBox, { className: "text-4xl text-white mb-4" }),
      title: "Tovarlar",
      description: "Tovarlarni boshqarish",
      link: "/products",
    },
    {
      icon: React.createElement(FaTruck, { className: "text-4xl text-white mb-4" }),
      title: "Tovarlarni vitrinaga jo'natish",
      description: "Tovarlarni vitrinaga jo'natish",
      link: "/send-to-showcase",
    },
    {
      icon: React.createElement(FaWarehouse, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Tovarlarni vitrinadan o'chirish",
      description: "Tovarlarni vitrinadan o'chirish",
      link: "/remove-from-showcase",
    },
    {
      icon: React.createElement(FaTruck, { className: "text-4xl text-white mb-4" }),
      title: "Mahsulotlarni boshqa omborga jo'natish",
      description: "Mahsulotlarni boshqa omborga jo'natish",
      link: "/send-to-warehouse",
    },
    {
      icon: React.createElement(FaUndo, { className: "text-4xl text-white mb-4" }),
      title: "Vazvrat",
      description: "Vazvrat operatsiyalari",
      link: "/returns",
    },
    {
      icon: React.createElement(FaCashRegister, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Kassa",
      description: "Moliya operatsiyalarini boshqarish",
      link: "/cash-register",
    },
    {
      icon: React.createElement(FaStore, { className: "text-4xl text-white mb-4" }),
      title: "Do'kon",
      description: "Do'konlarni boshqarish",
      link: "/stores",
    },
    {
      icon: React.createElement(FaArchive, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Arxiv",
      description: "Arxiv ma'lumotlari",
      link: "/archive",
    },
    {
      icon: React.createElement(FaShoppingCart, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Mahsulot zakaz qilish",
      description: "Yangi mahsulotlar zakaz qilish",
      link: "/order-products",
    },
  ];