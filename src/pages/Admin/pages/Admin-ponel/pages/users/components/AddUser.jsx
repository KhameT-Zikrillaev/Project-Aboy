import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select } from "antd";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";

const { Option } = Select;

const AddUser = ({ onClose, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const { data: warehouses } = useFetch('warehouse', 'warehouse');
  const { data: shops } = useFetch('shop', 'shop');

  const { mutate, isLoading } = useApiMutation({
        url: "users",
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
    <div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ombor nomi */}
        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">
              Foydalanuvchi nomi
            </span>
          }
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Foydalanuvchi nomi majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Foydalanuvchi nomini kiriting"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">
              Foydalanuvchi roli
            </span>
          }
          validateStatus={errors.role ? "error" : ""}
          help={errors.role?.message}
        >
          <Controller
            name="role"
            control={control}
            rules={{ required: "Foydalanuvchi roli" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Foydalanuvchi roli"
                className="custom-select"
                onChange={(value) => field.onChange(value)}
                dropdownClassName="custom-dropdown"
              >
                <Option value="staff">Omborchi</Option>
                <Option value="seller">Sotuvchi</Option>
                <Option value="user">Sotuvchi 2</Option>
              </Select>
            )}
          />
        </Form.Item>

        
        {watch('role') === 'staff' && (
          <Form.Item
          label={
            <span className="text-gray-100 font-semibold">
              Ombor nomi
            </span>
          }
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
                placeholder="Omborni tanlang"
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
        )}

        {(watch('role') === 'seller' || watch('role') === 'user') && (
          <Form.Item
          label={
            <span className="text-gray-100 font-semibold">
              Magazin nomi
            </span>
          }
          validateStatus={errors.shop_id ? "error" : ""}
          help={errors.shop_id?.message}
        >
          <Controller
            name="shop_id"
            control={control}
            rules={{ required: "Magazin majburiy" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Magazinni tanlang"
                className="custom-select"
                onChange={(value) => field.onChange(value)}
                dropdownClassName="custom-dropdown"
              >
                {
                  shops?.data?.shops?.map((shop) => (
                    <Option key={shop?.id} value={shop?.id}>
                      {shop?.name}
                    </Option>
                  ))
                }
              </Select>
            )}
          />
        </Form.Item>
        )}

        {/* Telfon nomer */}
        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Telefon raqami</span>
          }
          validateStatus={errors.phone ? "error" : ""}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Telefon raqami majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Telefon raqamini kiriting"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        {/* Parol */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Parol</span>}
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{ required: "Parol majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Parolni kiriting"
                className="custom-input"
                {...field}
              />
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

export default AddUser;
