// data/SellerCards.js
import {
    FaListAlt,
    FaMoneyBillAlt,
    FaChartLine,
    FaBox,
    FaWarehouse,
    FaArchive,
} from "react-icons/fa";
import React from "react";

export const SellerCards = [
    {
        icon: React.createElement(FaListAlt, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Tovar ro'yhatlari",
        description: "Mahsulotlar ro'yxati",
        link: "/seller/product-list",
    },
    {
        icon: React.createElement(FaBox, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Skladlar",
        description: "Omborxona boshqaruvi",
        link: "/seller/warehouses",
    },
    {
        icon: React.createElement(FaMoneyBillAlt, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Kassa",
        description: "Moliya operatsiyalari",
        link: "/seller/cash-register",
    },
    {
        icon: React.createElement(FaChartLine, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Arxiv",
        description: "Tarix va arxiv",
        link: "/seller/archive",
    },
    // {
    //     icon: React.createElement(FaWarehouse, {
    //         className: "text-4xl text-white mb-4",
    //     }),
    //     title: "Operatsiyalar tarixi",
    //     description: "Barcha tranzaksiyalarni ko'rish",
    //     link: "/seller/transaction-history",
    // },
    // {
    //     icon: React.createElement(FaArchive, {
    //         className: "text-4xl text-white mb-4",
    //     }),
    //     title: "Hisobotlar",
    //     description: "Analitika va statistika",
    //     link: "/seller/report",
    // }
];