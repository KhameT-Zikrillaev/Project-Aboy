import React from 'react';
import { Card, Tooltip, Badge } from 'antd';

const WarehouseSendShopReportCard = ({ report }) => {

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
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">
            <Tooltip title="Hisobot sanasi">
              <span>{report?.date}</span>
            </Tooltip>
          </h3>
          <Badge status="processing" text="Hisobot" />
        </div>

        <div className="bg-black/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-300 mb-2">Moliya ma'lumotlari</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Umumiy tushum:</span>
              <span>{report?.totalIncome?.toLocaleString()} $</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-red-400">
              <span>Qaytarilgan summa:</span>
              <span>{report?.totalRefund?.toLocaleString()} $</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-green-400">
              <span>Sof foyda:</span>
              <span>{report?.netTotal?.toLocaleString()} $</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WarehouseSendShopReportCard;
