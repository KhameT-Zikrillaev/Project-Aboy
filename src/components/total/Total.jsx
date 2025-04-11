import React from "react";

const Total = ({ totalPrice, totalQuantity }) => {
  return (
    <div className="flex justify-between bg-gray-800 p-4 rounded-lg mb-4 w-full text-gray-100">
      <div className="text-lg font-semibold">Жами сўмма: ${totalPrice}</div>
      <div className="text-lg font-semibold">Жами миқдор: {totalQuantity}</div>
    </div>
  );
};

export default Total;
