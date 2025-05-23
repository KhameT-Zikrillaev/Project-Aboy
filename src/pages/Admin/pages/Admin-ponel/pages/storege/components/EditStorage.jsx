import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Switch } from "antd";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";

const EditStorage = ({ onClose, storageSingleData, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    if (storageSingleData) {
      reset({
        name: storageSingleData.name,
        isMain: storageSingleData.isMain,
        isTrusted: storageSingleData.isTrusted,
        // priceDifference: storageSingleData.priceDifference,
      });
    }
  }, [storageSingleData, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `warehouse/${storageSingleData?.id}`,
    method: "PATCH",
    onSuccess: () => {
      onClose();
      refetch();
      toast.success("Омбор муваффақиятли янгиланди!");
    },
    onError: (error) => {
      if (
        error?.response?.data?.message ===
        "Warehouse with this name already exists"
      ) {
        toast.error("Бундай омбор номи мавжуд");
      } else if (error?.response?.data?.message === "Main warehouse already exists!") {
        toast.error("Асосий омбор мавжуд");
      } else {
        toast.error("Омборни янгилашда хатолик юз берди");
      }
    },
  });

  const onSubmit = (data) => {
    // Faqat o'zgargan qiymatlarni olish
    const changedValues = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== storageSingleData[key]) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    // Agar hech qanday o'zgarish bo'lmasa, zapros yubormaslik
    if (Object.keys(changedValues).length === 0) {
      toast.info("Ҳеч қандай ўзгариш қилинмади");
      return;
    }

    mutate(changedValues);
  };

  return (
    <div className="">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ombor nomi */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Омбор номи</span>}
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Омбор номи мажбурий" }}
            render={({ field }) => (
              <Input placeholder="Омбор номини киритинг" className="custom-input" {...field} />
            )}
          />
        </Form.Item>

        {/* <Form.Item
          label={<span className="text-gray-100 font-semibold">Нарх фарқи ($)</span>}
          validateStatus={errors.priceDifference ? "error" : ""}
          help={errors.priceDifference?.message}
        >
          <Controller
            name="priceDifference"
            control={control}
            rules={{ required: "Narx farqi majburiy" }}
            render={({ field }) => (
              <Input placeholder="Narx farqini kiriting" className="custom-input" {...field} />
            )}
          />
        </Form.Item> */}

        <div className="flex justify-between">
          {/* Asosiy ombor Switch */}
          <Form.Item label={<span className="text-gray-100 font-semibold">Асосий омбор</span>}>
            <Controller
              name="isMain"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>

          {/* Ruxsat berish Switch */}
          <Form.Item label={<span className="text-gray-100 font-semibold">Рухсат бериш</span>}>
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
            Таҳрирлаш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditStorage;
