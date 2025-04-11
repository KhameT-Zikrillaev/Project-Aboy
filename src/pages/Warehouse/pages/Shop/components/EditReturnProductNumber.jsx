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

  const { mutate, isLoading } = useApiMutation({
    url: `order/${product?.id}/return`,
    method: "POST",
    onSuccess: () => {
      reset();
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
      items: product?.items.map((item) => ({
        productId: item.productId,
        quantity: +data[`quantity_${item.productId}`] || 0,
      })).filter((item) => item.quantity > 0),
      userId: user?.id,
    };

    mutate(newData);
  };

  const handleQuantityChange = (e, productId, maxQuantity) => {
    const value = e.target.value.replace(/\D/g, "");
    const parsedValue = parseInt(value, 10);

    if (parsedValue > maxQuantity) {
      setValue(`quantity_${productId}`, maxQuantity.toString());
    } else if (value === "") {
      setValue(`quantity_${productId}`, "");
    } else {
      setValue(`quantity_${productId}`, value);
    }
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {product?.items.map((item) => (
          <Form.Item key={item.productId}>
            <p className="text-gray-100 font-semibold">
              Артикле: <span className="text-red-500">{item.product?.article}</span>
            </p>
            <p className="text-gray-100 font-semibold">
              Нархи: <span className="text-red-500">{Math.floor(item.price).toLocaleString()} $</span>
            </p>
            <p className="text-gray-100 font-semibold">
              Сони: <span className="text-red-500">{Math.floor(item.quantity)} та</span>
            </p>
            <p className="text-gray-100 font-semibold">
              Жами нархи: <span className="text-red-500">{Math.floor(item.total).toLocaleString()} $</span>
            </p>
            <Form.Item
              label={<span className="text-gray-100 font-semibold">Қайтариладиган маҳсулот сони:</span>}
              validateStatus={errors[`quantity_${item.productId}`] ? "error" : ""}
              help={
                errors[`quantity_${item.productId}`]?.message ||
                (watch(`quantity_${item.productId}`) > Math.floor(item.quantity) && `Max ${Math.floor(item.quantity)} та`)
              }
            >
              <Controller
                name={`quantity_${item.productId}`}
                control={control}
                rules={{
                  required: false,
                  max: {
                    value: Math.floor(item.quantity),
                    message: `Max ${Math.floor(item.quantity)} та продукт киритинг`,
                  },
                  min: {
                    value: 1,
                    message: "Мин 1 та",
                  },
                }}
                render={({ field }) => (
                  <Input
                    placeholder="Соннини киритинг"
                    className="custom-input"
                    {...field}
                    onChange={(e) => handleQuantityChange(e, item.productId, Math.floor(item.quantity))}
                    type="number"
                  />
                )}
              />
            </Form.Item>
          </Form.Item>
        ))}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2b3445")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#364153")}
          >
            Маҳсулотни қайтариш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditReturnProduct;
