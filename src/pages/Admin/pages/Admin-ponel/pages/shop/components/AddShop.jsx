import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, message, Select } from "antd";

const { Option } = Select;

const AddSeller = ({ onClose }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Forma ma'lumotlari:", data);
    message.success("Sotuvchi muvaffaqiyatli qo‘shildi!");
    reset(); // Formani tozalash
    onClose();
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
