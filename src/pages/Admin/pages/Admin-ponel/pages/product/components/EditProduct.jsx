import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";

const { TextArea } = Input;
const { Option } = Select;

const EditProduct = ({ onClose, productSingleData, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm();
  
  const { data: warehouses } = useFetch("warehouse", "warehouse");

  useEffect(() => {
    if (productSingleData) {
      reset({
        article: productSingleData.article,
        name: productSingleData.name,
        batch_number: productSingleData.batch_number,
        price: productSingleData.price,
      });
    }
  }, [productSingleData, reset]);
  const imageFile = watch("image");
    const [previewImage, setPreviewImage] = useState(productSingleData?.image_url || null);

    

  const { mutate, isLoading } = useApiMutation({
    url: `products/${productSingleData?.id}`,
    method: "PATCH",
    isFormData: true,
    onSuccess: () => {
      reset(); // Formani tozalash
      onClose();
      refetch();
      toast.success("Маҳсулот муваффақиятли янгиланди!");
    },
    onError: (error) => {
      if (error?.response?.data?.message === "This product already exists") {
        toast.error("Бундай партияли маҳсулот мавжуд");
      } else {
        toast.error("Маҳсулотни янгилашда хатолик юз берди");
      }
    },
  });

  const onSubmit = (data) => {
    const updatedFields = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== productSingleData[key]) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    // Agar o'zgarish bo'lmasa, API chaqirmaslik
    if (Object.keys(updatedFields).length === 0) {
      toast.info("Ҳеч қандай ўзгариш киритилмади.");
      return;
    }

    mutate(updatedFields);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    
    if (!isImage) {
      // message.error("Faqat rasm yuklash mumkin!");
      return false;
    }
    // setValue("image", file); // Rasmni react-hook-form state ga saqlash
    const reader = new FileReader();
    
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    return false; // Ant Design uploadni avtomatik yuborishining oldini olish
  };

  return (
    <div className="">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ombor nomi */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Артикул</span>}
          validateStatus={errors.article ? "error" : ""}
          help={errors.article?.message}
        >
          <Controller
            name="article"
            control={control}
            rules={{ required: "Артикул мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Артикулни киритинг"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-100 font-semibold">Партия</span>}
          validateStatus={errors.batch_number ? "error" : ""}
          help={errors.batch_number?.message}
        >
          <Controller
            name="batch_number"
            control={control}
            rules={{ required: "Партия мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Партияни киритинг"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Нархи ($)</span>}
          validateStatus={errors.price ? "error" : ""}
          help={errors.price?.message}
        >
          <Controller
            name="price"
            control={control}
            rules={{ required: "Нархи мажбурий" }}
            render={({ field }) => (
              <Input
                placeholder="Нархини киритинг"
                type="number"
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
        <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Расм юклаш</span>
          }
          validateStatus={errors.image ? "error" : ""}
          help={errors.image?.message}
        >
          <Controller
            name="image"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={(file) => {
                  beforeUpload(file);
                  return false;
                }}
              >
                {imageFile || previewImage ? (
                  <img
                    src={previewImage}
                    crossOrigin="anonymous"
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <div className="upload-text">
                    <PlusOutlined style={{ color: "#fff", fontSize: "24px" }} />
                    <div
                      style={{ marginTop: 8, color: "#fff", fontWeight: "500" }}
                    >
                      Расм юклаш  
                    </div>
                  </div>
                )}
              </Upload>
            )}
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Изоҳ</span>}
          validateStatus={errors.comment ? "error" : ""}
          help={errors.comment?.message}
        >
          <Controller
            name="comment"
            control={control}
            rules={{ required: "Изоҳ мажбурий" }}
            render={({ field }) => (
              <TextArea
                rows={4}
                placeholder="Изоҳни киритинг"
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

export default EditProduct;
