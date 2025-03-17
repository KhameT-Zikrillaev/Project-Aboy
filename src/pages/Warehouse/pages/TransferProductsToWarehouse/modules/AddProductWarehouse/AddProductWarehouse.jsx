import React, { useState, useEffect } from "react";
import { Button, List, Image, InputNumber, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import userStore from "@/store/useUser";
import useApiMutation from "@/hooks/useApiMutation";

const AddProductWarehouse = ({ onClose, selectedProducts, onSuccess, warehouseId }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = userStore();

  // Используем useApiMutation для PATCH запроса
  const { mutate, isLoading: isSending } = useApiMutation({
    url: 'warehouse-products',
    method: 'PATCH',
    onSuccess: (data) => {
      message.success('Продукты успешно отправлены!');
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      message.error(`Ошибка: ${error.message || 'Не удалось отправить продукты'}`);
      console.error('Error sending products:', error);
    }
  });

  console.log(user.warehouse?.id)              // ГЛАВНАЯ АЙДИ СКЛАДА ОТПРАВИТЕЛЬ
  console.log(selectedProducts)     //ТОВАРЫ
  console.log(warehouseId)          // СКЛАД ПОКУПАТЕЛЬ
  

  // Преобразуем выбранные товары в нужный формат с уникальным ключом
  useEffect(() => {
    if (selectedProducts) {
      const preselectedItems = selectedProducts.map((item, index) => ({
        ...item,
        key: `${item.id}-${index}`,
        quantity: item.quantity || 1,
      }));
      setSelectedItems(preselectedItems);
    }
  }, [selectedProducts]);

  // Удаляем товар из списка по уникальному ключу
  const handleRemove = (key) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.filter((item) => item.key !== key);
      if (updatedItems.length === 0) {
        if (onSuccess) onSuccess(); // Закрываем, если все товары удалены
        onClose();
      }
      return updatedItems;
    });
  };

  // Изменяем количество товара
  const handleQuantityChange = (key, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, quantity: value } : item
      )
    );
  };

  // Отправка данных
  const onSubmit = () => {
    if (selectedItems.length === 0) {
      message.warning('Нет выбранных товаров для отправки');
      return;
    }
    
    // Формируем данные для отправки на бэкенд
    const requestData = {
      fromWarehouseId: user.warehouse?.id, // ID склада-отправителя
      toWarehouseId: warehouseId, // ID склада-получателя
      products: selectedItems.map(item => ({
        productId: item.id, // ID продукта
        quantity: item.quantity // Количество
      }))
    };
    
    console.log('Отправляем данные:', requestData);
    
    // Отправляем данные на бэкенд
    mutate(requestData);
  };

  return (
    <div className="flex min-h-[400px] min-w-[400px] flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
      <div className="w-full">
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          <List
            dataSource={selectedItems}
            renderItem={(product) => (
              <List.Item
                key={product.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={product.photo}
                    width={50}
                    height={50}
                    style={{ marginRight: "10px" }}
                  />
                  <div className="ml-2">
                    <div className="text-white font-bold">{product.article}</div>
                    <div className="text-white">{product.code}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* ✅ Добавил InputNumber ВНУТРИ renderItem */}
                  <InputNumber
                    min={1}
                    max={product.stock}
                    value={product.quantity}
                    onChange={(value) =>
                      handleQuantityChange(product.key, value)
                    }
                    style={{ width: 60, marginRight: 10 }}
                    controls={true}
                    step={1}
                    parser={(value) => value.replace(/[^\d]/g, "")}
                    formatter={(value) => `${value}`.replace(/[^\d]/g, "")}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => handleRemove(product.key)}
                    style={{
                      color: "#fff",
                      backgroundColor: "#17212b",
                      borderRadius: "4px",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 0.2s ease",
                      marginRight: "10px",
                    }}
                    className="hover:bg-red-600"
                  />
                </div>
              </List.Item>
            )}
            pagination={{ pageSize: 3 }}
          />
        </div>

        {/* ✅ Количество товаров */}
        <div className="text-center text-white mt-4">
          <span>
            Количество выбранных товаров:{" "}
            <strong>{selectedItems.length}</strong>
          </span>
        </div>

        {/* ✅ Кнопка отправки */}
        <Button
          type="primary"
          onClick={onSubmit}
          loading={isSending}
          disabled={isSending || selectedItems.length === 0}
          style={{ marginTop: 20, width: "100%" }}
        >
          {isSending ? 'Отправка...' : 'Yuborish'}
        </Button>
      </div>
    </div>
  );
};

export default AddProductWarehouse;
