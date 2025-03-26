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
        toast.success("Mahsulot muvaffaqiyatli qaytarildi!");
      },
      onError: () => {
        toast.error("Mahsulotni qaytarishda xatolik yuz berdi");
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
              Article: <span className="text-red-500">{(product?.items[0]?.product?.article)}</span>
            </p>
            <p className="text-gray-100 font-semibold">
              {" "}
              Narxi: <span className="text-red-500">{Math.floor(product?.items[0]?.price).toLocaleString()} $</span>
            </p>
            <p className="text-gray-100 font-semibold">
              {" "}
              Soni: <span className="text-red-500">{Math.floor(product?.items[0]?.quantity)} ta</span>
            </p>
            <p className="text-gray-100 font-semibold">
              {" "}
              Jami narxi: <span className="text-red-500">{Math.floor(product?.items[0]?.total).toLocaleString()} $</span>
            </p>
          </Form.Item>
        )}

        {/* Поле для ввода количества */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Qaytariladigan mahsulot soni:</span>}
          validateStatus={errors.quantity ? "error" : ""}
          help={
            errors.quantity?.message ||
            (quantity > Math.floor(product?.items[0]?.quantity) && `Max ${Math.floor(product?.items[0]?.quantity)} ta`)
          }
        >
          <Controller
            name="quantity"
            control={control}
            rules={{
              required: "Sonni kiriting",
              max: {
                value: Math.floor(product?.items[0]?.quantity), // Максимум product.quantity
                message: `Max ${Math.floor(product?.items[0]?.quantity)} ta product kiriting`,
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
            Mahsulotni qaytarish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditReturnProduct;
