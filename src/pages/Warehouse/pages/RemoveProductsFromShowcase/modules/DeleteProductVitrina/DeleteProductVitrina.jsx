import React, { useState, useEffect } from "react";
import { Button, Table, Image, message, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "@/services/api";

const DeleteProductVitrina = ({
  onClose,
  selectedProducts,
  onSuccess,
  shopId,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async () => {
    if (selectedItems?.length === 0) {
      message.warning('Танланган товар йўқ');
      return;
    }
    
    if (!shopId) {
      message.error('ID магазина (shopId) не указан. Невозможно удалить товары.');
      return;
    }
    
    try {
      setIsLoading(true);
      const requestData = {
        productIds: selectedItems?.map(item => item.id),
      };

      await api({
        url: `shop-product/remove-products/${shopId}`,
        method: "DELETE",
        data: requestData,
      });

      toast.success('Товар муваффақиятли ўчирилди!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Товар ўчиришда хатолик юз берди: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
      title: "Расм",
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
      title: "Артикул",
      dataIndex: "article",
      key: "article",
      render: (text) => <span className="text-gray-100">{text}</span>,
    },
    {
      title: "Партия",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => <span className="text-gray-100">{text}</span>,
    },
    {
      title: "Ҳаракат",
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
              Танланган маҳсулотлар мавжуд эмас
            </div>
          ),
        }}
      />

      <div className="text-center text-white mt-2 mb-4">
        <span>
          Танланган товарлар сони:{" "}
          <span className="font-bold">{selectedItems?.length}</span>
        </span>
      </div>

      <Row justify="end">
        <Col>
          <Button
            type="primary"
            danger
            onClick={onSubmit}
            loading={isLoading}
            disabled={isLoading || selectedItems?.length === 0 || !shopId}
            style={{
              backgroundColor: "#ff4d4f",
              color: "#fff",
              fontWeight: "500",
              padding: "10px 24px",
              borderRadius: "6px",
              fontSize: "16px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#ff7875")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ff4d4f")
            }
          >
            {isLoading ? 'Ўчирилмоқда...' : 'Ўчириш'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DeleteProductVitrina;