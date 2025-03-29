import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Table, Tag, Input, Row, Col, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";
import useUserStore from "@/store/useUser";

const AddProduct = ({ onClose, selectedProducts, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { user } = useUserStore();
  const { handleSubmit, control, setValue } = useForm();

  const { mutate, isLoading: isSending } = useApiMutation({
    url: "shop-request/send-request",
    method: "POST",
    onSuccess: () => {
      toast.success("Буюртма муваффақиятли юборилди!");
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: () => {
      toast.error("Буюртма юборишда хатолик!");
    },
  });

  useEffect(() => {
    if (selectedProducts) {
      const preselectedItems = selectedProducts.map((item) => ({
        ...item,
        initialQuantity: item?.quantity || 0,
        quantity: 1, // Default quantity set to 1
      }));
      setSelectedItems(preselectedItems);
      preselectedItems.forEach((item) => {
        setValue(`quantity-${item.id}`, 1);
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
    const maxQuantity = selectedItems.find(item => item.id === id)?.initialQuantity || 0;
    
    const finalQuantity = Math.min(newQuantity, maxQuantity);
    
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: finalQuantity } : item
      )
    );
    setValue(`quantity-${id}`, finalQuantity);
  };

  const onSubmit = () => {
    if (selectedItems.length === 0) {
      message.warning("Ҳеч қандай маҳсулот танланмаган!");
      return;
    }

    const requestData = {
      shopId: user?.shop?.id,
      warehouseId: user?.shop?.warehouse_id,
      items: selectedItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        remarks: ""
      })),
    };

    mutate(requestData);
  };

  const columns = [
    {
      title: "№",
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
      title: "Мавжуд",
      key: "initialQuantity",
      width: 100,
      render: (_, record) => (
        <span className="text-gray-100">{record.initialQuantity} дона</span>
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
                message: `Макс ${record.initialQuantity}`,
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
            }}
            className="hover:bg-red-600"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-[#1a202c] rounded-lg">
      <Table
        columns={columns}
        dataSource={selectedItems}
        rowKey="id"
        pagination={false}
        rowClassName={() => "custom-row"}
        bordered
        style={{
          background: "rgba(255, 255, 255, 0.05)",
        }}
        className="custom-table mb-4"
        locale={{
          emptyText: (
            <div className="text-white py-4">
              Танланган маҳсулотлар мавжуд эмас
            </div>
          ),
        }}
      />

      <div className="text-center text-white mb-4">
        Танланган маҳсулотлар сони: <span className="font-bold">{selectedItems.length}</span>
      </div>

      <Row justify="end">
        <Col>
          <Button
            type="primary"
            onClick={onSubmit}
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
            {isSending ? "Юборилаётган..." : "Юбориш"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AddProduct;