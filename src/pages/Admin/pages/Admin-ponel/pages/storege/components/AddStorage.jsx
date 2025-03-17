import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Switch } from "antd";
import useApiMutation from "@/hooks/useApiMutation";

const AddStorage = ({ onClose, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const { mutate, isLoading } = useApiMutation({
    url: "warehouse",
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
    mutate({
      name: data.name,
      isMain: data.isMain ? true : false,
      isTrusted: data.isTrusted ? true : false
    });
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ombor nomi */}
        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Ombor nomi</span>
          }
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Ombor nomi majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Ombor nomini kiriting"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        <div className="flex justify-between">
          {/* Ruxsat berish Switch */}
          <Form.Item
            label={
              <span className="text-gray-100 font-semibold">Asosiy ombor</span>
            }
          >
            <Controller
              name="isMain"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>

          {/* Ruxsat berish Switch */}
          <Form.Item
            label={
              <span className="text-gray-100 font-semibold">Ruxsat berish</span>
            }
          >
            <Controller
              name="isTrusted"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>
        </div>

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
              width: "100%"
            }}
          >
            Yaratish
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddStorage;
