import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Pagination, Tag } from "antd";
import { EditOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Input } from "antd";
import ModalComponent from "@/components/modal/Modal";
import AddStorage from "./components/AddStorage";
import EditStorage from "./components/EditStorage";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";

const { Search } = Input;

const Statistics = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storageSingleData, setStorageSingleData] = useState(null);
  const [formType, setFormType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useFetch('warehouse', 'warehouse', { limit, page, name: searchQuery });
  
  const { mutate: deleteWarehouse} = useApiMutation({
    url: 'warehouse', // Asosiy API endpoint
    method: 'DELETE',
    onSuccess: () => {
      console.log('Mahsulot muvaffaqiyatli o‘chirildi');
      refetch();
    },
    onError: (error) => {
      console.error('Xatolik yuz berdi:', error.message);
    },
  });

  const handleDelete = (id) => {
    deleteWarehouse({ id });
  };

  

  const showModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setStorageSingleData(null);
  };

  const handleEdit = (record) => {
    setStorageSingleData(record);
    showModal("edit");
  };

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
  };

  const onSearch = (value) => setSearchQuery(value);

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button
          style={{
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LeftOutlined /> 
        </button>
      );
    }
    if (type === "next") {
      return (
        <button
          style={{
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
           <RightOutlined />
        </button>
      );
    }
    return originalElement;
  };

  const columns = [
    {
      title: "№",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => <span className="text-gray-100 font-semibold">{(page - 1) * limit + index + 1}</span>,
      width: 70,
    },
    {
      title: "Ombor nomi",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="text-gray-100 font-semibold">{text}</span>,
    },
    {
      title: "Ruxsat berilgan",
      dataIndex: "isTrusted",
      key: "isTrusted",
      render: (text) => <span className="text-gray-100 font-semibold">{text  ? <Tag color="green">Ruxsat berilgan</Tag> : <Tag color="red">Ruxsat berilmagan</Tag>}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="edit-btn"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="O‘chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDelete(record?.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} className="edit-btn" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="text-3xl font-bold text-gray-100">Omborlar</div>
        <div className="flex gap-3 items-center">
          <Search placeholder="Qidirish" onSearch={onSearch} enterButton className="custom-search" />
          <Button
            type="primary"
            style={{
              backgroundColor: "#364153",
              color: "#f3f4f6",
              fontWeight: "500",
              padding: "17px 20px",
              borderRadius: "8px",
              fontSize: "20px",
            }}
            className="hover:bg-[#0056b3] hover:border-[#004494] focus:bg-[#004494]"
            onClick={() => showModal("add")}
          >
            Qo'shish
          </Button>
        </div>
      </div>
      <div className="text-gray-100">
        <Table
          columns={columns}
          dataSource={data?.data?.warehouses || []}
          pagination={false}
          className="custom-table"
          rowClassName={() => "custom-row"}
          bordered
          loading={isLoading}
        />
        <div className="flex justify-center mt-5">
          <Pagination
            className="custom-pagination"
            current={page}
            total={data?.data?.total}
            pageSize={limit}
            onChange={handlePageChange}
            itemRender={itemRender}
          />
        </div>
      </div>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={onClose}
        title={formType === "add" ? "Ombor qo'shish" : "Omborni tahrirlash"}
      >
        {formType === "add" ? <AddStorage onClose={onClose} refetch={refetch} /> : <EditStorage onClose={onClose} refetch={refetch} storageSingleData={storageSingleData} />}
      </ModalComponent>
    </div>
  );
};

export default Statistics;
