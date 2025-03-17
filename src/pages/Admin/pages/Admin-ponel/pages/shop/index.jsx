import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Input } from 'antd';
import ModalComponent from "@/components/modal/Modal";
import AddShop from "./components/AddShop";
import EditShop from "./components/EditShop";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";
const { Search } = Input;


const Seller = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sellerSingleData, setSellerSingleData] = useState(null);
  const [formType, setFormType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, refetch } = useFetch('shop', 'shop', { limit, page, name: searchQuery });

    const { mutate: deleteShop} = useApiMutation({
        url: 'shop', // Asosiy API endpoint
        method: 'DELETE',
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          console.error('Xatolik yuz berdi:', error.message);
        },
      });
    
      const handleDelete = (id) => {
        deleteShop({ id });
      };


  const showModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSellerSingleData(null);
  };
  
  const handleEdit = (record) => {
    setSellerSingleData(record);
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
      render: (_, __, index) => <span className="text-gray-100 font-semibold">{(page - 1) * limit + index + 1}</span>,
      width: 70,
    },
    {
      title: "Magazin nomi",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="text-gray-100 font-semibold">{text}</span>,
    },
    {
      title: "Ombor nomi",
      dataIndex: "warehouseName",
      key: "warehouseName",
      render: (text) => <span className="text-gray-100 font-semibold">{text}</span>,
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
        <div className="text-3xl font-bold  text-gray-100">Magazinlar</div>
        <div className="flex gap-3 items-center">
        <Search placeholder="Qidirish" onSearch={onSearch} enterButton className="custom-search"/>
        <Button
          type="primary"
          style={{
            backgroundColor: "#364153",
            color: "#f3f4f6",
            fontWeight: "500",
            padding: "17px 20px",
            borderRadius: "8px",
            fontSize: "20px"
          }}
          className="hover:bg-[#0056b3] hover:border-[#004494] focus:bg-[#004494] "
          onClick={() => showModal("add")}
        >
          Qo'shish
        </Button>
        </div>
      </div>
      <div className="text-gray-100">
        <Table
          columns={columns}
          dataSource={data?.data?.shops}
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
        title={formType === "add" ? "Magazin qo'shish" : "Magazinni tahrirlash"}
      >
       {formType === "add" ?<AddShop onClose={onClose} refetch={refetch}/> : <EditShop onClose={onClose} refetch={refetch} sellerSingleData={sellerSingleData}/>} 
      </ModalComponent>
    </div>
  );
};

export default Seller;
