// data/SellerCards.js
import {
    FaListAlt,
    FaChartLine,
    FaWarehouse,
} from "react-icons/fa";
import React from "react";

export const SellerCards = [
    {
        icon: React.createElement(FaListAlt, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Tovar vitrinasi",
        description: "Mahsulotlar ro'yxati",
        link: "/seller/product-list",
    },
    {
        icon: React.createElement(FaWarehouse, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Sklad",
        description: "Omborxona",
        link: "/seller/warehouse",
    },
    {
        icon: React.createElement(FaChartLine, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Hisobotlar",
        description: "Tarix va arxiv",
        link: "/seller/report",
    }
];