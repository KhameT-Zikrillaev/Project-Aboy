import React, { useState, useEffect } from "react";
import { Button, Input, message, Table, Tag, Spin, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import userStore from "@/store/useUser";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

const AddProductOrderWarehouse = ({ 
  onClose, 
  selectedProducts, 
  onSuccess, 
  idWarehouse,
  warehouseName 
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = userStore();

  const { handleSubmit, control, setValue, formState: { errors } } = useForm();

  const { mutate, isLoading } = useApiMutation({
    url: 'warehouse-requests/send-request',
    method: 'POST',
    onSuccess: () => {
      onClose();
      toast.success("Buyurtma muvaffaqiyatli berildi!");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Buyurtma berishda xatolik yuz berdi!");
    },
  });

  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      setLoading(true);
      const preselectedItems = selectedProducts.map((item) => ({
        ...item,
        key: item.id,
        initialQuantity: item?.quantity || 0,
        quantity: item?.quantity || 1,
      }));
      
      setSelectedItems(preselectedItems);
      preselectedItems.forEach((item) => {
        setValue(`quantity-${item.id}`, item.quantity);
      });
      setLoading(false);
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
    setValue(`quantity-${item.id}`, newQuantity);
  };

  const onSubmit = () => {
    if (!user?.warehouse?.id) {
      message.error("Ombor ma'lumotlari topilmadi!");
      return;
    }

    if (selectedItems.length === 0) {
      message.warning("Hech qanday mahsulot tanlanmagan!");
      return;
    }

    const requestData = {
      sourceWarehouseId: idWarehouse,
      destinationWarehouseId: user.warehouse?.id,
      items: selectedItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    mutate(requestData);
  };

  const columns = [
    {
      title: "№",
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <span className="text-gray-100">{index + 1}</span>
      ),
    },
    {
      title: "Artikul",
      dataIndex: "article",
      key: "article",
      render: (text) => <span className="text-gray-100">{text}</span>,
    },
    {
      title: "Partiya",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => (
        <Tag color="blue" className="text-gray-100">
          {text}
        </Tag>
      ),
    },
    {
      title: "Mavjud",
      key: "initialQuantity",
      render: (_, record) => (
        <span className="text-gray-100">{record.initialQuantity} ta</span>
      ),
    },
    {
      title: "Miqdor",
      key: "quantity",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Controller
            name={`quantity-${record.id}`}
            control={control}
            rules={{
              required: "Miqdorni kiriting",
              min: { value: 1, message: "Kamida 1" },
              max: {
                value: record.initialQuantity,
                message: `Maksimum ${record.initialQuantity}`,
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
                min={1}
                style={{ width: 80 }}
              />
            )}
          />
          {errors[`quantity-${record.id}`] && (
            <span className="text-red-400 text-xs">
              {errors[`quantity-${record.id}`]?.message}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Harakat",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => handleRemove(record.id)}
          style={{
            color: "#fff",
            backgroundColor: "#17212b",
          }}
          className="hover:bg-red-600"
        />
      ),
      width: 80,
    },
  ];

  return (
    <div className="p-4 bg-[#1a202c] rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4">
        {warehouseName} omboriga buyurtma
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table
            columns={columns}
            dataSource={selectedItems}
            pagination={false}
            className="custom-table mb-4"
            rowClassName={() => "custom-row"}
            bordered
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
            locale={{
              emptyText: (
                <div className="text-white py-4">
                  Tanlangan mahsulotlar mavjud emas
                </div>
              ),
            }}
          />

          <Row justify="end">
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading || selectedItems.length === 0}
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
                {isLoading ? "Jo'natilmoqda..." : "Buyurtma berish"}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </div>
  );
};

export default AddProductOrderWarehouse;