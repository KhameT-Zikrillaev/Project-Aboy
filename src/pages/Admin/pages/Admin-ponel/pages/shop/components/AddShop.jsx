import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select } from "antd";
import useApiMutation from "@/hooks/useApiMutation";
import useFetch from "@/hooks/useFetch";

const { Option } = Select;

const AddSeller = ({ onClose, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const { data: warehouses } = useFetch('warehouse', 'warehouse');

  const { mutate, isLoading } = useApiMutation({
      url: "shop",
      method: "POST",
      onSuccess: () => {
        reset(); // Formani tozalash
        onClose();
        refetch();
      },
      onError: (error) => {
        console.error("Error creating user:", error);
        alert("Xatolik yuz berdi!");
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
          label={<span className="text-gray-100 font-semibold">Magazin nomi</span>}
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Magazin nomi majburiy" }}
            render={({ field }) => (
              <Input placeholder="Magazin nomini kiriting" className="custom-input" {...field} />
            )}
          />
        </Form.Item>

        {/* Kategoriya tanlash */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Omborlar</span>}
          validateStatus={errors.warehouse_id ? "error" : ""}
          help={errors.warehouse_id?.message}
        >
          <Controller
            name="warehouse_id"
            control={control}
            rules={{ required: "Ombor majburiy" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Ombor tanlang"
                className="custom-select"
                onChange={(value) => field.onChange(value)}
                dropdownClassName="custom-dropdown"
              >
                {
                  warehouses?.data?.warehouses?.map((warehouse) => (
                    <Option key={warehouse?.id} value={warehouse?.id}>
                      {warehouse?.name}
                    </Option>
                  ))
                }
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
            Yaratish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSeller;
