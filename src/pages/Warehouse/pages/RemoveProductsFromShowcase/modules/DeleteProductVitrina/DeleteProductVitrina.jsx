import React, { useState, useEffect } from "react";
import { Button, List, Image } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const DeleteProductVitrina = ({ onClose, selectedProducts, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Преобразуем выбранные товары в нужный формат с уникальным ключом
  useEffect(() => {
    if (selectedProducts) {
      const preselectedItems = selectedProducts.map((item, index) => ({
        ...item,
        key: `${item.product_id}-${index}`, // Делаем ключ уникальным
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
        onSuccess(); // Закрываем, если все товары удалены
        onClose();
      }
      return updatedItems;
    });
  };

  // Отправка данных
  const onSubmit = () => {
    if (selectedItems.length === 0) {
      onSuccess();
      onClose();
      return;
    }
    console.log("Отправленные товары:", selectedItems);
    onSuccess();
    onClose();
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
                    <div className="text-white font-bold">{product.name}</div>
                    <div className="text-white">{product.code}</div>
                  </div>
                </div>
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
              </List.Item>
            )}
            pagination={{ pageSize: 5 }}
          />
        </div>

        <div className="text-center text-white mt-4">
          <span>
            Количество выбранных товаров:{" "}
            <strong>{selectedItems.length}</strong>
          </span>
        </div>

        <Button
          type="primary"
          danger
          onClick={onSubmit}
          style={{ marginTop: 20, width: "100%" }}
        >
         O'chirish
        </Button>
      </div>
    </div>
  );
};

export default DeleteProductVitrina;
