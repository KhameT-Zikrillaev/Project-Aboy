import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Select} from "antd";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";

const { Option } = Select;

const EditUser = ({ onClose, storageSingleData,refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm();

  const { data: warehouses } = useFetch('warehouse', 'warehouse');
    const { data: shops } = useFetch('shop', 'shop');

  // storageSingleData bor bo‘lsa, formani shu ma’lumotlar bilan to‘ldiramiz
  useEffect(() => {
    if (storageSingleData) {
      reset({
        name: storageSingleData.name,
        warehouse_id: storageSingleData.warehouse?.id,
        shop_id: storageSingleData.shop?.id,
        phone: storageSingleData.phone,
        password: "",
      });
    }
  }, [storageSingleData, reset]);
  const { mutate, isLoading } = useApiMutation({
    url: `users/${storageSingleData?.id}`,
    method: "PUT",
    onSuccess: () => {
      onClose();
      refetch();
      reset()
      toast.success("Фойдаланувчи муваффақиятли янгиланди!");
    },
    onError: () => {
      toast.error("Фойдаланувчи янгилашда хатолик юз берди!");
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
            <span className="text-gray-100 font-semibold">
              Фойдаланувчи номи
            </span>
          }
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Фойдаланувчи номи мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Фойдаланувчи номини киритинг"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        {/* <Form.Item
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
        </Form.Item> */}

        
        {storageSingleData?.role === 'staff' && (
          <Form.Item
          label={
            <span className="text-gray-100 font-semibold">
              Омбор номи
            </span>
          }
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
                placeholder="Омборни танланг"
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

        {(storageSingleData?.role === 'seller' || storageSingleData?.role === 'user') && (
          <Form.Item
          label={
            <span className="text-gray-100 font-semibold">
              Магазин номи
            </span>
          }
          validateStatus={errors.shop_id ? "error" : ""}
          help={errors.shop_id?.message}
        >
          <Controller
            name="shop_id"
            control={control}
            rules={{ required: "Магазин мажбурий" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Магазинни танланг"
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
            <span className="text-gray-100 font-semibold">Телефон рақами (Логин)</span>
          }
          validateStatus={errors.phone ? "error" : ""}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Телефон рақами мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Телефон рақамини киритинг"
                className="custom-input"
                {...field}
              />
            )}  
          />
        </Form.Item>

        {/* Parol */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Парол</span>}
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <Input
                placeholder="Паролни киритинг"
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
            Таҳрирлаш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUser;
