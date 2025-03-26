import React from 'react';
import { Card, Tooltip } from 'antd';
import { format } from 'date-fns';

const CashCard = ({ transaction }) => {
  // Форматирование даты
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Форматирование суммы
  const formatAmount = (amount) => {
    if (!amount) return '0 so\'m';
    return `${parseFloat(amount).toLocaleString('ru-RU')} $`;
  };

  // Получение информации о товарах
  const getItemsInfo = (items) => {
    if (!items || items.length === 0) return 'Tovarlar mavjud emas';
    return items.map((item) => (
      <div key={item.id} className="text-sm space-y-1">
        {/* Название товара */}
        <span className="font-medium">{item.product?.article || 'Noma’lum'}</span>
        {/* Количество и цена */}
        <div className="flex justify-between">
          <span>
            {parseInt(item.quantity)} x {formatAmount(item.price)} = {formatAmount(item.total)}
          </span>
        </div>
        {/* Партия */}
        {item.product?.batch_number && (
          <span className="text-gray-400">Partiya: {item.product.batch_number}</span>
        )}
      </div>
    ));
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
            <h3 className="text-lg font-semibold text-white mb-1">
              {transaction.type === 'income' ? 'Kirim' : 'Chiqim'} - {formatAmount(transaction.amount)}
            </h3>
          </div>
          <Tooltip title="Yaratilgan sana">
            <span className="text-xs text-gray-300">
              {formatDate(transaction?.createdAt)}
            </span>
          </Tooltip>
        </div>

        <div className="bg-black/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-300 mb-2">Tafsilotlar</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>To'lov turi:</span>
              <span className="font-medium">
                {transaction.order?.payment_method || 'Noma\'lum'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Umumiy summa:</span>
              <span className="text-gray-300">
                {formatAmount(transaction.order?.total_amount)}
              </span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="font-medium">Tovarlar:</span>
              {getItemsInfo(transaction.order?.items)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CashCard;
