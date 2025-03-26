import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import useApiMutation from "@/hooks/useApiMutation";
import userStore from "@/store/useUser";

const AddProductWarehouse = ({ onClose, selectedProducts, onSuccess, warehouseId }) => {
  const { user } = userStore();
  const [selectedItems, setSelectedItems] = useState([]);
  const { handleSubmit, control, setValue, watch, formState: { errors } } = useForm();

  const { mutate, isLoading: isSending } = useApiMutation({
    url: "warehouse-products",
    method: "PATCH",
    onSuccess: () => {
      toast.success("Mahsulot muvaffaqiyatli o'tkazildi");
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`Mahsulot o'tkazishda xatolik yuz berdi!`);
    },
  });

  // Загружаем данные и сохраняем начальное количество (initialQuantity)
  useEffect(() => {
    if (selectedProducts) {
      const preselectedItems = selectedProducts.map((item) => ({
        ...item,
        initialQuantity: item?.quantity || 0, // Сохраняем начальное количество
        quantity: item?.quantity || 1,
      }));
      setSelectedItems(preselectedItems);
      preselectedItems.forEach((item) => {
        setValue(`quantity-${item.id}`, item.quantity);
      });
    }
  }, [selectedProducts, setValue]);

  // Удаление товара из списка
  const handleRemove = (id) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.filter((item) => item.id !== id);
      if (updatedItems.length === 0) onClose();
      return updatedItems;
    });
  };

  // Изменение количества
  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value) || 0;
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    setValue(`quantity-${id}`, newQuantity); // Обновляем значение в Controller
  };

  // Отправка формы
  const onSubmit = () => {
    if (selectedItems.length === 0) {
      message.warning("Hech narsa tanlanmagan");
      return;
    }

    const requestData = {
      fromWarehouseId: user.warehouse?.id,
      toWarehouseId: warehouseId,
      products: selectedItems.map((item) => ({
        productId: item?.id,
        quantity: item?.quantity,
      })),
    };

    mutate(requestData);
  };

  return (
    <div className="p-4 bg-[#1a202c] rounded-lg">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {selectedItems.map((product) => (
          <Form.Item key={product.id}>
            {/* Картинка */}
            <img
              crossOrigin="anonymous"
              className="h-48 w-full bg-cover cursor-pointer bg-center rounded-t-lg"
              src={product?.image_url}
              alt=""
            />

            {/* Артикул */}
            <h3 className="text-gray-100 font-semibold">{product?.article}</h3>

            {/* Номер партии */}
            <p className="text-gray-100 font-semibold">
              Part: <span className="text-red-500">{product?.batch_number}</span>
            </p>

            {/* Показываем начальное количество (initialQuantity) */}
            <span className="text-gray-100 font-semibold">
              {product?.initialQuantity} dona bor omborda
            </span>

            {/* Инпут для изменения количества */}
            <div className="flex mt-2">
              <Controller
                name={`quantity-${product.id}`}
                control={control}
                rules={{
                  required: "Son kiriting",
                  min: { value: 1, message: "Min 1" },
                  max: {
                    value: product.initialQuantity, // Устанавливаем лимит по начальному количеству
                    message: `Max ${product.initialQuantity}`,
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    value={product.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleQuantityChange(product.id, value);
                      field.onChange(value);
                    }}
                    max={product.initialQuantity}
                    className="w-24"
                  />
                )}
              />

              {/* Кнопка удаления */}
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => handleRemove(product.id)}
                style={{
                  color: "#fff",
                  backgroundColor: "#17212b",
                  borderRadius: "4px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s ease",
                }}
                className="hover:bg-red-600"
              />
            </div>

            {/* Ошибка валидации */}
            {errors[`quantity-${product.id}`] && (
              <span className="text-red-400">
                {errors[`quantity-${product.id}`]?.message}
              </span>
            )}
          </Form.Item>
        ))}

        {/* Кнопка отправки */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSending}
            disabled={isSending || selectedItems.length === 0}
            style={{
              backgroundColor: "#364153",
              color: "#f3f4f6",
              fontWeight: "500",
              padding: "15px 20px",
              borderRadius: "8px",
              fontSize: "18px",
              width: "100%",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2b3445")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#364153")
            }
          >
            {isSending ? "Yuborish..." : "Yuborish"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductWarehouse;
