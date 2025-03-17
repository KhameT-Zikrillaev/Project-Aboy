import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useApiMutation from "@/hooks/useApiMutation";

const { TextArea } = Input;

const EditProduct = ({ onClose, productSingleData, refetch }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();
  const imageFile = watch("image");
  const [previewImage, setPreviewImage] = useState(null);

  // storageSingleData bor bo‘lsa, formani shu ma’lumotlar bilan to‘ldiramiz
  console.log(productSingleData);
  
  useEffect(() => {
    if (productSingleData) {
      reset({
        article: productSingleData.article,
        name: productSingleData.name,
        batch_number: productSingleData.batch_number,
        quantity: productSingleData.quantity,
        price: productSingleData.price,
        image: productSingleData.image_url,
      });
    }
  }, [productSingleData, reset]);

  const onSubmit = (data) => {
    console.log("Forma ma'lumotlari:", data);
    message.success("Mahsulot muvaffaqiyatli yangilandi!");
    reset(); // Formani tozalash
    onClose();
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Faqat rasm yuklash mumkin!");
      return false;
    }

    setValue("image", file); // Rasmni react-hook-form state ga saqlash
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
          label={
            <span className="text-gray-100 font-semibold">Rulon soni</span>
          }
          validateStatus={errors.quantity ? "error" : ""}
          help={errors.quantity?.message}
        >
          <Controller
            name="quantity"
            control={control}
            rules={{ required: "Rulon soni majburiy" }}
            render={({ field }) => (
              <Input
                placeholder="Rulon sonini kiriting"
                type="number"
                className="custom-input"
                {...field}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label={<span className="text-gray-100 font-semibold">Narxi</span>}
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
        <Form.Item
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
        </Form.Item>
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
