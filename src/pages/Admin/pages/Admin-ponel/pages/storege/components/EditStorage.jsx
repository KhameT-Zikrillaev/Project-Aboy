import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form,  Switch } from "antd";
import useApiMutation from "@/hooks/useApiMutation";

const EditStorage = ({ onClose, storageSingleData, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();



  // storageSingleData bor bo‘lsa, formani shu ma’lumotlar bilan to‘ldiramiz
  useEffect(() => {
    if (storageSingleData) {
      reset({
        name: storageSingleData.name, 
        isMain: storageSingleData.isMain,
        isTrusted: storageSingleData.isTrusted
      });
    }
  }, [storageSingleData, reset]);

  const { mutate, isLoading} = useApiMutation({
    url: `warehouse/${storageSingleData?.id}`,
    method: 'PATCH',
    onSuccess: () => {
      onClose();
      refetch();
    },
    onError: (error) => {
      console.error('Xatolik yuz berdi:', error.message);
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="">
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
              width: "100%",
            }}
          >
            Tahrirlash
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditStorage;
