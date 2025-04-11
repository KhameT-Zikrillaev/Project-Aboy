import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Switch } from "antd";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";

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
      toast.success("Омбор муваффақиятли қўшилди!");
    },
    onError: (error) => {
      if (error?.response?.data?.message === "Warehouse with this name already exists") {
        toast.error("Бундай омбор номи мавжуд");
      }else if(error?.response?.data?.message === "Main warehouse already exists!"){
        toast.error("Асосий омбор мавжуд");
      }else{
        toast.error("Омбор қўшишда хатолик юз берди");
      }
    },
  });

  const onSubmit = (data) => {
    mutate({
      name: data.name,
      isMain: data.isMain ? true : false,
      isTrusted: data.isTrusted ? true : false,
      priceDifference: data.priceDifference
    });
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ombor nomi */}
        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Омбор номи</span>
          }
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Омбор номи мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Омбор номини киритинг"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        {/* <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Нарх фарқи ($)</span>
          }
          validateStatus={errors.priceDifference ? "error" : ""}
          help={errors.priceDifference?.message}
        >
          <Controller
            name="priceDifference"
            control={control}
            rules={{ required: "Нарх фарқи мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Narx farqini kiriting"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item> */}

        <div className="flex justify-between">
          {/* Ruxsat berish Switch */}
          <Form.Item
            label={
              <span className="text-gray-100 font-semibold">Асосий омбор</span>
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
              <span className="text-gray-100 font-semibold">Рухсат бериш</span>
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
            Яратиш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddStorage;
