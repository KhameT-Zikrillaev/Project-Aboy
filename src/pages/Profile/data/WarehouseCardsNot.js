// data/ProductManagementCards.js
import {
    FaBox,
    FaTruck,
    FaWarehouse,
    FaCashRegister,
    FaChartLine,
  } from "react-icons/fa";

  import { AiOutlineRollback } from "react-icons/ai";

  import React from "react";
  
  export const SkladCardsNot = [
    {
      icon: React.createElement(FaBox, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Товарлар",
      description: "Товарларни бошқариш",
      link: "/warehouse/product-list",
    },
    {
      icon: React.createElement(FaTruck, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Товарларни витринага жўнатиш",
      description: "Товарларни витринага жўнатиш",
      link: "/warehouse/send-to-showcase",
    },
    {
      icon: React.createElement(FaWarehouse, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Товарларни витринадан ўчириш",
      description: "Товарларни витринадан ўчириш",
      link: "/warehouse/remove-from-showcase",
    },
    {
      icon: React.createElement(FaTruck, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Маҳсулотларни бошқа омборга жўнатиш",
      description: "Маҳсулотларни бошқа омборга жўнатиш",
      link: "/warehouse/transfer-to-warehouse",
    },
    {
      icon: React.createElement(FaCashRegister, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Касса",
      description: "Молия операцияларини бошқариш",
      link: "/warehouse/cash-register",
    },
    {
      icon: React.createElement(AiOutlineRollback, {
        className: "text-6xl font-bold text-white mb-4",
      }),
      title: "Маҳсулот қайтариш",
      description: "Дўконлардан маҳсулот қайтариш",
      link: "/warehouse/shop",
    },
    // {
    //   icon: React.createElement(FaShoppingCart, {
    //     className: "text-4xl text-white mb-4",
    //   }),
    //   title: "Маҳсулот заказ қилиш",
    //   description: "Янги маҳсулотлар заказ қилиш",
    //   link: "/warehouse/order-products",
    // },
    {
      icon: React.createElement(FaChartLine, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Ҳисоботлар омборларники",
      description: "Тарих ва архив",
      link: "/warehouse/report-warehouse-send",
    },
    {
      icon: React.createElement(FaChartLine, {
        className: "text-4xl text-white mb-4",
      }),
      title: "Ҳисоботлар сотувчиларники",
      description: "Тарих ва архив",
      link: "/warehouse/report-seller-send",
    }
  ];