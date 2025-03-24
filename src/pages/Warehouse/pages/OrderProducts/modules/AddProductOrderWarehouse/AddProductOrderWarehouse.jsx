import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import userStore from "@/store/useUser";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

const AddProductOrderWarehouse = ({ onClose, selectedProducts, onSuccess, idWarehouse }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = userStore();

  const { handleSubmit, control, setValue, watch, formState: { errors } } = useForm();

  const { mutate, isLoading } = useApiMutation({
    url: 'warehouse-requests/send-request',
    method: 'POST',
    onSuccess: () => {
      onClose();
      toast.success("Buyurtma berildi");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Buyurtma berishda xatolik!");
    },
  });

  useEffect(() => {
    if (selectedProducts) {
      const preselectedItems = selectedProducts.map((item) => ({
        ...item,
        initialQuantity: item?.quantity || 0,
        quantity: item?.quantity || 1,
      }));
      setSelectedItems(preselectedItems);
      preselectedItems.forEach((item) => {
        setValue(`quantity-${item.id}`, item.quantity);
      });
    }
  }, [selectedProducts, setValue]);

  const handleRemove = (id) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.filter((item) => item.id !== id);
      if (updatedItems.length === 0) onClose();
      return updatedItems;
    });
  };

  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value) || 0;
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    setValue(`quantity-${id}`, newQuantity);
  };

  const onSubmit = () => {
    if (!user?.warehouse?.id) {
      message.error("Ombor ma'lumotlari topilmadi!");
      return;
    }

    if (selectedItems.length === 0) {
      message.warning("Нет выбранных товаров для отправки");
      return;
    }

    const requestData = {
      sourceWarehouseId: idWarehouse,
      destinationWarehouseId: user.warehouse?.id,
      items: selectedItems.map((item) => ({
        productId: item?.id,
        quantity: item?.quantity,
      })),
    };

    mutate(requestData);
  };

  return (
    <div className="p-4 bg-[#1a202c] rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        {selectedItems.map((product) => (
          <div key={product.id} className="mb-4">
            <img
              crossOrigin="anonymous"
              className="h-48 w-full bg-cover cursor-pointer bg-center rounded-t-lg"
              src={product?.image_url}
              alt=""
            />

            <h3 className="text-gray-100 font-semibold">{product?.article}</h3>
            <p className="text-gray-100 font-semibold">
              Part: <span className="text-red-500">{product?.batch_number}</span>
            </p>

            <span className="text-gray-100 font-semibold">
              {product?.initialQuantity} dona bor omborda
            </span>

            <div className="flex mt-2">
              <Controller
                name={`quantity-${product.id}`}
                control={control}
                rules={{
                  required: "Введите количество",
                  min: { value: 1, message: "Минимум 1" },
                  max: {
                    value: product.initialQuantity,
                    message: `Максимум ${product.initialQuantity}`,
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

            {errors[`quantity-${product.id}`] && (
              <span className="text-red-400">
                {errors[`quantity-${product.id}`]?.message}
              </span>
            )}
          </div>
        ))}

        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading || selectedItems.length === 0}
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
          {isLoading ? "Отправка..." : "Zakaz berish!"}
        </Button>
      </form>
    </div>
  );
};

export default AddProductOrderWarehouse;