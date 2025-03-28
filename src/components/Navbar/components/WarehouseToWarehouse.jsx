import React from 'react';
import { Card, Tooltip, Badge } from 'antd';

const WarehouseToWarehouse = ({ report }) => {
  return (
    <Card
      className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden cursor-pointer"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      bodyStyle={{ padding: "16px", color: "white" }}
    >
      <div className="flex flex-col gap-2">
        {/* Ombor nomi */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">
            <Tooltip title="Омбор номи">
              <span>{report?.warehouseName || "Номаълум омбор"}</span>
            </Tooltip>
          </h3>
          <Badge status="processing" text="Hisobot" />
        </div>

        {/* Mahsulotlar */}
        <div className="bg-black/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-300 mb-2">Маҳсулот маълумотлари</h4>
          <div className="space-y-3">
            {report?.products?.length > 0 ? (
              report?.products.map((product, index) => (
                <div key={index} className="p-2 bg-black/40 rounded-md">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Маҳсулот:</span>
                    <span className="text-white">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-300">
                    <span>Артикл:</span>
                    <span>{product?.articles}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-400">
                    <span>Партия:</span>
                    <span>{product?.batch}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-green-400">
                    <span>Сони:</span>
                    <span>{product?.quantity}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-red-400">Маҳсулотлар мавжуд эмас</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WarehouseToWarehouse;
