import React from 'react';
import { Card, Tooltip,} from 'antd';
import { format } from 'date-fns';
import useUserStore from '@/store/useUser';
import { ArrowRightOutlined } from '@ant-design/icons';

const RepordCardShop = ({ item }) => {
  const { user } = useUserStore();
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
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
              <Tooltip title="Манба омбор">
                <span>{user?.warehouse?.name || 'Номаълум'}</span>
              </Tooltip>
              <ArrowRightOutlined className="mx-2 text-yellow-400" />
              <Tooltip title="Манзил омбор">
                <span>{item?.shop?.name || 'Номаълум'}</span>
              </Tooltip>
            </h3>
          </div>
          <Tooltip title="Яратилган сана">
            <span className="text-xs text-gray-300">
              {formatDate(item?.createdAt)}
            </span>
          </Tooltip>
        </div>
        
        <div className="bg-black/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-300 mb-2">Маҳсулотлар</h4>
          {item?.order && item?.order?.items?.length > 0 ? (
            <div className="space-y-3">
              {item?.order?.items?.map((product) => (
                <div key={product?.id} className="border-b border-gray-600 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{product?.product?.article || 'Номаълум'}</span>
                    <span className="text-sm">{Math.floor(product?.quantity)} Дона</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>Партия: {product?.product?.batch_number || 'Номаълум'}</span>
                    
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>Нарх: {product?.price?.toLocaleString()} $</span>
                    <span>Жами: {product?.total?.toLocaleString()} $</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Маҳсулотлар мавжуд эмас</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RepordCardShop;