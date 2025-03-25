import React from 'react';
import { Card,} from 'antd';
import { format } from 'date-fns';
import useUserStore from '@/store/useUser';

const RepordCardShop = ({ item }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card
      className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      bodyStyle={{ padding: "16px", color: "white" }}
    >
      {/* <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
              <Tooltip title="Manba ombor">
                <span>{user?.warehouse?.name || 'Noma\'lum'}</span>
              </Tooltip>
              <ArrowRightOutlined className="mx-2 text-yellow-400" />
              <Tooltip title="Manzil ombor">
                <span>{item?.shop?.name || 'Noma\'lum'}</span>
              </Tooltip>
            </h3>
          </div>
          <Tooltip title="Yaratilgan sana">
            <span className="text-xs text-gray-300">
              {formatDate(item?.createdAt)}
            </span>
          </Tooltip>
        </div>
        
        <div className="bg-black/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-300 mb-2">Mahsulotlar</h4>
          {item?.order && item?.order?.items?.length > 0 ? (
            <div className="space-y-3">
              {item?.order?.items?.map((product) => (
                <div key={product?.id} className="border-b border-gray-600 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{product?.product?.article || 'Noma\'lum'}</span>
                    <span className="text-sm">{Math.floor(product?.quantity)} dona</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>Partiya: {product?.product?.batch_number || 'Noma\'lum'}</span>
                    
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>Narx: {product?.price?.toLocaleString()} so'm</span>
                    <span>Jami: {product?.total?.toLocaleString()} so'm</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Mahsulotlar mavjud emas</p>
          )}
        </div>
      </div> */}
    </Card>
  );
};

export default RepordCardShop;