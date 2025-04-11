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
      toast.success("Магазин муваффақиятли янгиланди!");
    },
    onError: (error) => {
      if(
        error?.response?.data?.message === "Shop with this name already exists"
      ){
        toast.error("Бундай магазин номи мавжуд");
      }else {
        toast.error("Магазини янгилашда хатолик юз берди");
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
          label={
            <span className="text-gray-100 font-semibold">Магазин номи</span>
          }
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Магазин номи мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Магазин номини киритинг"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-100 font-semibold">Омборлар</span>}
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
                placeholder="Омбор танланг"
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
            Таҳрирлаш
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditSeller;
