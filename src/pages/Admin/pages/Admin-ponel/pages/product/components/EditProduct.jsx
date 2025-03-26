import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";

const { TextArea } = Input;

const EditProduct = ({ onClose, productSingleData, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (productSingleData) {
      reset({
        article: productSingleData.article,
        name: productSingleData.name,
        batch_number: productSingleData.batch_number,
        price: productSingleData.price
      });
    }
  }, [productSingleData, reset]);

  const { mutate, isLoading } = useApiMutation({
    url: `products/${productSingleData?.id}`,
    method: "PATCH",
    isFormData: true,
    onSuccess: () => {
      reset(); // Formani tozalash
      onClose();
      refetch();
      toast.success("Mahsulot muvaffaqiyatli yangilandi!");
    },
    onError: (error) => {
      if (error?.response?.data?.message === "This product already exists") {
        toast.error("Bunday partiyali mahsulot mavjud");
      } else {
        toast.error("Mahsulotni yangilashda xatolik yuz berdi");
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
      toast.info("Hech qanday o'zgarish kiritilmadi.");
      return;
    }
  
    mutate(updatedFields);
  };

  // const beforeUpload = (file) => {
  //   const isImage = file.type.startsWith("image/");
  //   if (!isImage) {
  //     message.error("Faqat rasm yuklash mumkin!");
  //     return false;
  //   }

  //   setValue("image", file); // Rasmni react-hook-form state ga saqlash
  //   const reader = new FileReader();
  //   reader.onload = () => setPreviewImage(reader.result);
  //   reader.readAsDataURL(file);

  //   return false; // Ant Design uploadni avtomatik yuborishining oldini olish
  // };

  return (
    <div className="">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Ombor nomi */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Artikul</span>}
          validateStatus={errors.article ? "error" : ""}
          help={errors.article?.message}
        >
          <Controller
            name="article"
            control={control}
            rules={{ required: "Artikul majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Artikulni kiriting"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-100 font-semibold">Partiya</span>}
          validateStatus={errors.batch_number ? "error" : ""}
          help={errors.batch_number?.message}
        >
          <Controller
            name="batch_number"
            control={control}
            rules={{ required: "Partiya majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Partiyani kiriting"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Narxi ($)</span>}
          validateStatus={errors.price ? "error" : ""}
          help={errors.price?.message}
        >
          <Controller
            name="price"
            control={control}
            rules={{ required: "Narxi majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Narxini kiriting"
                type="number"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>
        {/* <Form.Item
          label={
            <span className="text-gray-100 font-semibold">Rasm yuklash</span>
          }
          validateStatus={errors.image ? "error" : ""}
          help={errors.image?.message}
        >
          <Controller
            name="image"
            control={control}
            rules={{ required: "Rasm yuklash majburiy" }}
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
                {imageFile ? (
                  <img
                    src={previewImage}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <div className="upload-text">
                    <PlusOutlined style={{ color: "#fff", fontSize: "24px" }} />
                    <div
                      style={{ marginTop: 8, color: "#fff", fontWeight: "500" }}
                    >
                      Rasm yuklash
                    </div>
                  </div>
                )}
              </Upload>
            )}
          />
        </Form.Item> */}
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Izoh</span>}
          validateStatus={errors.comment ? "error" : ""}
          help={errors.comment?.message}
        >
          <Controller
            name="comment"
            control={control}
            rules={{ required: "Izoh majburiy" }}
            render={({ field }) => (
              <TextArea
                rows={4}
                placeholder="Izohni kiriting"
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
            Tahrirlash
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
