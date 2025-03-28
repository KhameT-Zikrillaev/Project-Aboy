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
      toast.success("Буюртма берилди");
    },
    onError: () => {
      toast.error("Буютма беришда хатолик!");
    },
  });

  const onSubmit = (data) => {
    if (data?.quantity > product?.quantity) {
      message.error(`Мах ${product?.quantity} та.`);
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
              <span className="text-gray-100 font-semibold">Товар номи</span>
            }
          >
            <img  crossOrigin="anonymous" className="h-48 w-full bg-cover cursor-pointer bg-center rounded-t-lg" src={product?.image_url} alt=""/>
            <h3 className="text-gray-100 font-semibold">{product?.article}</h3>
            <p className="text-gray-100 font-semibold">
              {" "}
              Партия:{" "}
              <span className="text-red-500">{product?.batch_number}</span>
            </p>
            <span className="text-gray-100 font-semibold">
              {product?.quantity} дона бор омборда
            </span>
          </Form.Item>
        )}

        <Form.Item
          label={<span className="text-gray-100 font-semibold">Сони</span>}
          validateStatus={errors.quantity ? "error" : ""}
          help={
            errors.quantity?.message ||
            (quantity > product?.quantity && `Max ${product?.quantity} та.`)
          }
        >
          <Controller
            name="quantity"
            control={control}
            rules={{
              required: "Сонни киритинг",
              max: {
                value: product?.quantity, // Максимум product.stock
                message: `Max ${product?.quantity} та.`,
              },
              min: {
                value: 1,
                message: "Мин 1 та.",
              },
            }}
            render={({ field }) => (
              <Input
                placeholder="Соннини киритинг"
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
            Буюртма бериш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
