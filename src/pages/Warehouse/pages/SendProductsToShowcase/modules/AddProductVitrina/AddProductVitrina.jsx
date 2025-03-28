import React, { useState, useEffect } from "react";
import { Button, Table, Tag, Image, message, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";

const AddProductVitrina = ({ 
  onClose, 
  selectedProducts, 
  onSuccess, 
  warehouseId, 
  warehouseName, 
  shopId 
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const { mutate, isLoading: isSending } = useApiMutation({
    url: 'Storefront-product',
    method: 'POST',
    onSuccess: (data) => {
      toast.success('Товар муваффақиятли қўшилди!');
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`Товар қўшишда хатолик юз берди`);
    }
  });
  
  useEffect(() => {
    if (selectedProducts) {
      const preselectedItems = selectedProducts?.map((item, index) => ({
        ...item,
        key: `${item?.id}-${index}`,
        quantity: 1,
      }));
      setSelectedItems(preselectedItems);
    }
  }, [selectedProducts]);

  const handleRemove = (key) => {
    setSelectedItems((prev) => {
      const updatedItems = prev?.filter((item) => item?.key !== key);
      if (updatedItems?.length === 0) {
        if (onSuccess) onSuccess();
        onClose();
      }
      return updatedItems;
    });
  };

  const onSubmit = () => {
    if (selectedItems?.length === 0) {
      message.warning('Танланган товар йўқ');
      return;
    }
    
    if (!shopId) {
      message.error('ID магазина (shopId) не указан. Невозможно отправить товары.');
      return;
    }
    
    const requestData = {
      productIds: selectedItems?.map(item => item.id),
      shopId: shopId
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
      title: "Rasm",
      key: "image",
      width: 100,
      render: (_, record) => (
        <Image
          src={record?.image_url}
          alt={record?.article}
          width={50}
          height={50}
          crossOrigin="anonymous"
          className="object-cover"
        />
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
      title: "Harakat",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => handleRemove(record.key)}
          style={{
            color: "#fff",
            backgroundColor: "#17212b",
          }}
          className="hover:bg-red-600"
        />
      ),
    },
  ];

  return (
    <div className="p-4 bg-[#1a202c] rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4">
        {warehouseName} vitrinasiga yuborish
      </h2>
      
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

      <div className="text-center text-white mt-2 mb-4">
        <span>
          Tanlangan tovarlar soni:{" "}
          <span className="font-bold">{selectedItems?.length}</span>
        </span>
      </div>

      <Row justify="end">
        <Col>
          <Button
            type="primary"
            onClick={onSubmit}
            loading={isSending}
            disabled={isSending || selectedItems?.length === 0 || !shopId}
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
            {isSending ? 'Jo`natilmoqda...' : 'Yuborish'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AddProductVitrina;