import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, message } from "antd";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";
import useUserStore from "@/store/useUser";

const AddProduct = ({ onClose, product }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();
  const { user } = useUserStore();
  const quantity = watch("quantity"); // Следим за значением количества
  const idWarehouse = user?.shop?.warehouse_id; // warehouseId
  const idShop = user?.shop?.id; // shopID

 

  const { mutate, isLoading } = useApiMutation({
    url: "shop-request/send-request",
    method: "POST",
    onSuccess: () => {
      reset(); // Formani tozalash
      onClose();
      toast.success("Buyurtma berildi");
    },
    onError: () => {
      toast.error("Buyutma berishda xatolik!");
    },
  });

  const onSubmit = (data) => {
    if (data?.quantity > product?.quantity) {
      message.error(`Max ${product?.quantity} ta.`);
      return;
    }

    const requestBody = {
      shopId: idShop,
      warehouseId: idWarehouse,
      items: [
        {
          productId: product.id, // Предполагаем, что product.id это идентификатор продукта
          quantity: data.quantity,
          remarks: data.remarks || "" // Добавляем remarks, если они есть
        }
      ]
    };

    mutate(requestBody); // Отправляем запрос на бекенд

    console.log("Forma ma'lumotlari:", data);
    const newData = {
      shopId: user?.shop?.id,
      warehouseId: user?.shop?.warehouse_id,
      items: [
        {
          productId: product?.id,
          quantity: data?.quantity,
        },
      ],
    };
    mutate(newData);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Удаляем все символы, кроме цифр
    const maxValue = product?.quantity; // Максимальное значение равно product.stock
    const parsedValue = parseInt(value, 10);

    if (parsedValue > maxValue) {
      setValue("quantity", maxValue.toString());
    } else if (value === "") {
      setValue("quantity", "");
    } else {
      setValue("quantity", value);
    }
  };

  return (
    <div className="">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {product && (
          <Form.Item
            label={
              <span className="text-gray-100 font-semibold">Tovar nomi</span>
            }
          >
            <h3 className="text-gray-100 font-semibold">{product?.article}</h3>
            <p className="text-gray-100 font-semibold">
              {" "}
              Part:{" "}
              <span className="text-red-500">{product?.batch_number}</span>
            </p>
            <span className="text-gray-100 font-semibold">
              {product?.quantity} dona bor omborda
            </span>
          </Form.Item>
        )}

        <Form.Item
          label={<span className="text-gray-100 font-semibold">Soni</span>}
          validateStatus={errors.quantity ? "error" : ""}
          help={
            errors.quantity?.message ||
            (quantity > product?.quantity && `Max ${product?.quantity} ta`)
          }
        >
          <Controller
            name="quantity"
            control={control}
            rules={{
              required: "Sonni kiriting",
              max: {
                value: product?.quantity, // Максимум product.stock
                message: `Max ${product?.quantity} ta`,
              },
              min: {
                value: 1,
                message: "Min 1 ta",
              },
            }}
            render={({ field }) => (
              <Input
                placeholder="Sonnini kiriting"
                className="custom-input"
                {...field}
                onChange={handleQuantityChange} // Обработчик для ограничения ввода
                max={product?.quantity} // Максимальное значение
                type="number" // Тип поля для мобильных устройств
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={quantity > product?.quantity}
            loading={isLoading}
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
            Buyurtma berish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
