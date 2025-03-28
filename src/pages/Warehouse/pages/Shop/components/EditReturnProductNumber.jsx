import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form } from "antd";
import useApiMutation from "@/hooks/useApiMutation";
import useUserStore from "@/store/useUser";
import { toast } from "react-toastify";

const EditReturnProduct = ({ onClose, product, refetch }) => {
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

  const { mutate, isLoading } = useApiMutation({
      url: `order/${product?.id}/return`,
      method: "POST",
      onSuccess: () => {
        reset(); // Formani tozalash
        onClose();
        refetch();
        toast.success("Маҳсулот муваффақиятли қайтарилди!");
      },
      onError: () => {
        toast.error("Маҳсулотни қайтаришда хатолик юз берди");
      },
    });
  const onSubmit = (data) => {

    const newData = {
      items: [
        {
          productId: product?.items[0]?.productId,
          quantity: data.quantity
        }
      ],
      userId: user?.id
    }
    mutate(newData);
   
  };

  // Функция для ограничения ввода только цифрами от 1 до product.quantity
  const handleQuantityChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Удаляем все символы, кроме цифр
    const maxValue = Math.floor(product?.items[0]?.quantity); // Максимальное значение равно product.quantity
    const parsedValue = parseInt(value, 10);

    // Если значение больше максимального, устанавливаем максимальное значение
    if (parsedValue > maxValue) {
      setValue("quantity", maxValue.toString());
    } else if (value === "") {
      setValue("quantity", ""); // Позволяем очистить поле
    } else {
      setValue("quantity", value); // Устанавливаем значение в форму
    }
  };

  return (
    <div className="">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Отображение названия товара */}
        {product && (
          <Form.Item
           
          >
            <p className="text-gray-100 font-semibold">
              {" "}
              Артикле: <span className="text-red-500">{(product?.items[0]?.product?.article)}</span>
            </p>
            <p className="text-gray-100 font-semibold">
              {" "}
              Нархи: <span className="text-red-500">{Math.floor(product?.items[0]?.price).toLocaleString()} $</span>
            </p>
            <p className="text-gray-100 font-semibold">
              {" "}
              Сони: <span className="text-red-500">{Math.floor(product?.items[0]?.quantity)} ta</span>
            </p>
            <p className="text-gray-100 font-semibold">
              {" "}
              Жами нархи: <span className="text-red-500">{Math.floor(product?.items[0]?.total).toLocaleString()} $</span>
            </p>
          </Form.Item>
        )}

        {/* Поле для ввода количества */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Қайтариладиган маҳсулот сони:</span>}
          validateStatus={errors.quantity ? "error" : ""}
          help={
            errors.quantity?.message ||
            (quantity > Math.floor(product?.items[0]?.quantity) && `Max ${Math.floor(product?.items[0]?.quantity)} та`)
          }
        >
          <Controller
            name="quantity"
            control={control}
            rules={{
              required: "Сонни киритинг",
              max: {
                value: Math.floor(product?.items[0]?.quantity), // Максимум product.quantity
                message: `Max ${Math.floor(product?.items[0]?.quantity)} та продукт киритинг`,
              },
              min: {
                value: 1,
                message: "Мин 1 а",
              },
            }}
            render={({ field }) => (
              <Input
                placeholder="Соннини киритинг"
                className="custom-input"
                defaultValue={Math.floor(product?.items[0]?.quantity)}
                {...field}
                onChange={handleQuantityChange} // Обработчик для ограничения ввода
                max={Math.floor(product?.items[0]?.quantity)} // Максимальное значение
                type="number" // Тип поля для мобильных устройств
              />
            )}
          />
        </Form.Item>

        {/* Кнопка "Заказать" */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={quantity > Math.floor(product?.items[0]?.quantity)}
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
            Маҳсулотни қайтариш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditReturnProduct;
