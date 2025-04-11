import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Form, message, Table, Tag, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import useApiMutation from "@/hooks/useApiMutation";
import userStore from "@/store/useUser";

const AddProductWarehouse = ({ onClose, selectedProducts, onSuccess, warehouseId }) => {
  const { user } = userStore();
  const [selectedItems, setSelectedItems] = useState([]);
  const { handleSubmit, control, setValue, formState: { errors } } = useForm();

  const { mutate, isLoading: isSending } = useApiMutation({
    url: "warehouse-products/transfer-products",
    method: "PATCH",
    onSuccess: () => {
      toast.success("Маҳсулот муваффақиятли ўтказилди");
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: () => {
      toast.error(`Маҳсулот ўтказишда хатолик юз берди!`);
    },
  });

  useEffect(() => {
    if (selectedProducts) {
      const preselectedItems = selectedProducts.map((item) => ({
        ...item,
        initialQuantity: item?.quantity || 0,
        quantity: item?.quantity || 1,
      }));
      setSelectedItems(preselectedItems);
      preselectedItems.forEach((item) => {
        setValue(`quantity-${item.id}`, item.quantity);
      });
    }
  }, [selectedProducts, setValue]);

  const handleRemove = (id) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.filter((item) => item.id !== id);
      if (updatedItems.length === 0) onClose();
      return updatedItems;
    });
  };

  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value) || 0;
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    setValue(`quantity-${id}`, newQuantity);
  };

  const onSubmit = () => {
    if (selectedItems.length === 0) {
      message.warning("Ҳеч нарса танланмаган");
      return;
    }

    const requestData = {
      fromWarehouseId: user.warehouse?.id,
      toWarehouseId: warehouseId,
      products: selectedItems.map((item) => ({
        productId: item?.id,
        quantity: item?.quantity,
      })),
    };

    mutate(requestData);
  };

  const columns = [
    {
      title: "No",
      key: "index",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Расм",
      dataIndex: "image_url",
      key: "image",
      width: 100,
      render: (image) => (
        <img 
          crossOrigin="anonymous"
          className="h-16 w-16 object-cover rounded"
          src={image}
          alt="product"
          style={{ maxHeight: '64px', maxWidth: '64px' }}
        />
      ),
    },
    {
      title: "Артикул",
      dataIndex: "article",
      key: "article",
      width: 150,
      render: (text) => <span className="text-gray-100">{text}</span>,
    },
    {
      title: "Партия",
      dataIndex: "batch_number",
      key: "batch_number",
      width: 120,
      render: (text) => (
        <Tag color="blue" className="text-gray-100">
          {text}
        </Tag>
      ),
    },
    {
      title: "Мавjud",
      key: "initialQuantity",
      width: 100,
      render: (_, record) => (
        <span className="text-gray-100">{record.initialQuantity} dona</span>
      ),
    },
    {
      title: "Миқдор",
      key: "quantity",
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Controller
            name={`quantity-${record.id}`}
            control={control}
            rules={{
              required: "Сонни киритинг",
              min: { value: 1, message: "Мин 1" },
              max: {
                value: record.initialQuantity,
                message: `Макс  ${record.initialQuantity}`,
              },
            }}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                value={record.quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  handleQuantityChange(record.id, value);
                  field.onChange(value);
                }}
                max={record.initialQuantity}
                style={{ width: '80px' }}
                className="text-center"
              />
            )}
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => handleRemove(record.id)}
            style={{
              color: "#fff",
              backgroundColor: "#17212b",
              borderRadius: "4px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s ease",
            }}
            className="hover:bg-red-600"
          />
        </div>
      ),
    }
  ];

  return (
    <div className="p-4 bg-[#1a202c] rounded-lg">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Table
            columns={columns}
            dataSource={selectedItems}
            rowKey="id"
            pagination={false}
            rowClassName={() => "custom-row"}
            bordered
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "white",
            }}
            className="custom-table"
          />
        </div>

        <Row justify="end">
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSending}
              disabled={isSending || selectedItems.length === 0}
              style={{
                backgroundColor: "#364153",
                color: "#f3f4f6",
                fontWeight: "500",
                padding: "10px 24px",
                borderRadius: "6px",
                fontSize: "16px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2b3445")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#364153")
              }
            >
              {isSending ? "Юбориш..." : "Юбориш"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddProductWarehouse;