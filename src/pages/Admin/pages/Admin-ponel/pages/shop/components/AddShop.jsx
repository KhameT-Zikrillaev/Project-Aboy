import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select } from "antd";
import useApiMutation from "@/hooks/useApiMutation";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";

const { Option } = Select;

const AddSeller = ({ onClose, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const { data: warehouses } = useFetch("warehouse", "warehouse");

  const { mutate, isLoading } = useApiMutation({
    url: "shop",
    method: "POST",
    onSuccess: () => {
      reset(); // Formani tozalash
      onClose();
      refetch();
      toast.success("Магазин муваффақиятли қўшилди!");
    },
    onError: (error) => {
      if (
        error?.response?.data?.message === "Shop with this name already exists"
      ) {
        toast.error("Бундай магазин номи мавжуд");
      }
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Sotuvchi nomi */}
        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Магазин номи</span>
          }
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Магазин номи мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Магазин номини киритинг"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        {/* Kategoriya tanlash */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Омборлар</span>}
          validateStatus={errors.warehouse_id ? "error" : ""}
          help={errors.warehouse_id?.message}
        >
          <Controller
            name="warehouse_id"
            control={control}
            rules={{ required: "Омбор мажбурий" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Омбор танланг"
                className="custom-select"
                onChange={(value) => field.onChange(value)}
                dropdownClassName="custom-dropdown"
              >
                {warehouses?.data?.warehouses?.map((warehouse) => (
                  <Option key={warehouse?.id} value={warehouse?.id}>
                    {warehouse?.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Yuborish tugmasi */}
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
            }}
          >
            Яратиш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSeller;
