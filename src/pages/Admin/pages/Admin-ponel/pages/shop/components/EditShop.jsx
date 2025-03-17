import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select  } from "antd";
import useApiMutation from "@/hooks/useApiMutation";

const { Option } = Select;
const EditSeller = ({ onClose, sellerSingleData, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  // storageSingleData bor bo‘lsa, formani shu ma’lumotlar bilan to‘ldiramiz
  useEffect(() => {
    if (sellerSingleData) {
      reset({
        name: sellerSingleData.name,
        warehouse_id: sellerSingleData.warehouse_id
      });
    }
  }, [sellerSingleData, reset]);

  const { mutate, isLoading} = useApiMutation({
      url: `shop/${sellerSingleData?.id}`,
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
                <Option value="electronics">Elektronika</Option>
                <Option value="clothing">Kiyim-kechak</Option>
                <Option value="food">Oziq-ovqat</Option>
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
