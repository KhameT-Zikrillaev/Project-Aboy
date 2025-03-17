import React, { useState, useEffect } from "react";
import { Button, List, Image } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import bg from "@/assets/images/bg-login.jpg";

const DeleteProductVitrina = ({ onClose, selectedProducts, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const dataSource = [
    { key: '1', code: 'OB001', name: 'Обои "Синий океан"', price: '1000 руб', stock: 10, photo: bg },
    { key: '2', code: 'OB002', name: 'Обои "Зеленый лес"', price: '1200 руб', stock: 5, photo: bg },
    { key: '3', code: 'OB003', name: 'Обои "Красный закат"', price: '1100 руб', stock: 8, photo: bg },
    { key: '4', code: 'OB004', name: 'Обои "Желтый песок"', price: '900 руб', stock: 15, photo: bg },
    { key: '5', code: 'OB005', name: 'Обои "Фиолетовый туман"', price: '1300 руб', stock: 3, photo: bg },
    { key: '6', code: 'OB006', name: 'Обои "Голубое небо"', price: '950 руб', stock: 7, photo: bg },
    { key: '7', code: 'OB007', name: 'Обои "Розовый рассвет"', price: '1050 руб', stock: 12, photo: bg },
    { key: '8', code: 'OB008', name: 'Обои "Серый камень"', price: '800 руб', stock: 20, photo: bg },
    { key: '9', code: 'OB009', name: 'Обои "Белый снег"', price: '1000 руб', stock: 0, photo: bg },
    { key: '10', code: 'OB010', name: 'Обои "Черная ночь"', price: '1400 руб', stock: 6, photo: bg },
  ];

  useEffect(() => {
    const preselectedItems = dataSource
      .filter((item) => selectedProducts.includes(item.key))
      .map((item) => ({ ...item, quantity: 1 }));

    setSelectedItems(preselectedItems);
  }, [selectedProducts]);

  const handleRemove = (key) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.filter((item) => item.key !== key);
      if (updatedItems.length === 0) {
        onSuccess();
        onClose();
      }
      return updatedItems;
    });
  };

  const onSubmit = () => {
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image src={product.photo} width={50} height={50} style={{ marginRight: "10px" }} />
                  <div className="ml-2">
                    <div className="text-white font-bold">{product.name}</div>
                    <div className="text-white ">{product.code}</div>
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
                    marginRight: "10px"
                  }}
                  className="hover:bg-red-600"
                />
              </List.Item>
            )}
            pagination={{ pageSize: 5 }}
          />
        </div>

        <div className="text-center text-white mt-4">
          <span>Количество выбранных товаров: <strong>{selectedItems.length}</strong></span>
        </div>

        <Button type="primary" danger onClick={onSubmit} style={{ marginTop: 20, width: "100%" }}>
          O'chirish
        </Button>
      </div>
    </div>
  );
};

export default DeleteProductVitrina;
