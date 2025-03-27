import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select } from "antd";
import useApiMutation from "@/hooks/useApiMutation";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";

const { Option } = Select;
const EditSeller = ({ onClose, sellerSingleData, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const { data: warehouses } = useFetch("warehouse", "warehouse");

  // storageSingleData bor bo‘lsa, formani shu ma’lumotlar bilan to‘ldiramiz
  useEffect(() => {
    if (sellerSingleData) {
      reset({
        name: sellerSingleData.name,
        warehouse_id: sellerSingleData.warehouse_id,
      });
    }
  }, [sellerSingleData, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `shop/${sellerSingleData?.id}`,
    method: "PATCH",
    onSuccess: () => {
      onClose();
      refetch();
      toast.success("Magazin muvaffaqiyatli yangilandi!");
    },
    onError: (error) => {
      if(
        error?.response?.data?.message === "Shop with this name already exists"
      ){
        toast.error("Bunday magazin nomi mavjud");
      }else {
        toast.error("Magazini yangilashda xatolik yuz berdi");
      }
    },
  });

  const onSubmit = (data) => {
    const changedValues = Object.keys(data).reduce((acc, key) => {
          if (data[key] !== sellerSingleData[key]) {
            acc[key] = data[key];
          }
          return acc;
        }, {});
    
        // Agar hech qanday o'zgarish bo'lmasa, zapros yubormaslik
        if (Object.keys(changedValues).length === 0) {
          toast.info("Hech qanday o'zgarish qilinmadi");
          return;
        }
    
    mutate(changedValues);
  };

  return (
    <div className="">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ombor nomi */}
        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Magazin nomi</span>
          }
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Magazin nomi majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Magazin nomini kiriting"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

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
            Tahrirlash
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditSeller;
