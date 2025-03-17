import React from "react";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Chilanzar", description: "Описание Chilanzar" },
  { id: 2, name: "Yunsabad", description: "Описание Yunsabad" },
  { id: 3, name: "Namangan", description: "Описание Namangan" },
  { id: 4, name: "Samarqand", description: "Описание Samarqand" },
  { id: 5, name: "Mirzo Ulug'bek", description: "Описание Mirzo Ulug'bek" },
  { id: 6, name: "Navoiy", description: "Описание Navoiy" },
];

export default function TransferProductsToWarehouse() {
  return (
    <div className="DirectorProduct mt-[150px] p-4">
      <h3 className="text-white mb-4">Список Магазинов</h3>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/warehouse/transfer-to-warehouse/${product.name}`}
            className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}











// import React from 'react'

// export default function TransferProductsToWarehouse() {
//   return (
//     <><h3 className='text-white mt-[120px]'>Перемещение товаров на другой склад</h3></>
//   )
// }
