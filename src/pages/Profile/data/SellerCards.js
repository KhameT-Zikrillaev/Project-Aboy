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
        title: "Товар витринаси",
        description: "Маҳсулотлар рўйхати",
        link: "/seller/product-list",
    },
    {
        icon: React.createElement(FaWarehouse, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Омборхона",
        description: "Омборхона",
        link: "/seller/warehouse",
    },
    {
        icon: React.createElement(FaChartLine, {
            className: "text-4xl text-white mb-4",
        }),
        title: "Ҳисоботлар",
        description: "Тарих ва архив",
        link: "/seller/report",
    }
];