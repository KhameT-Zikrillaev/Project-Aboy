import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Pagination } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import ModalComponent from "@/components/modal/Modal";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";
const { Search } = Input;

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productSingleData, setProductSingleData] = useState(null);
  const [formType, setFormType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useFetch("product", "product", {
    limit,
    page,
    article: searchQuery,
  });

  const { mutate: deleteProduct } = useApiMutation({
    url: "product", // Asosiy API endpoint
    method: "DELETE",
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Xatolik yuz berdi:", error.message);
    },
  });

  const handleDelete = (id) => {
    deleteProduct({ id });
  };

  const showModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setProductSingleData(null);
  };

  const handleEdit = (record) => {
    setProductSingleData(record);
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
      render: (_, __, index) => (
        <span className="text-gray-100 font-semibold">
          {(page - 1) * limit + index + 1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Artikul",
      dataIndex: "article",
      key: "article",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Partiya",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Rulon soni",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Narxi",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Rasm",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <span className="h-[80px] w-[80px]">
          <img className="h-full w-auto" src={text}  />
        </span>
      ),
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
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="edit-btn"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="text-3xl font-bold  text-gray-100">Mahsulotlar</div>
        <div className="flex gap-3 items-center">
          <Search
            placeholder="Qidirish"
            onSearch={onSearch}
            enterButton
            className="custom-search"
          />
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
          dataSource={data?.data?.products}
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
        title={
          formType === "add" ? "Mahsulot qo'shish" : "Mahsulotni tahrirlash"
        }
      >
        {formType === "add" ? (
          <AddProduct onClose={onClose} refetch={refetch} />
        ) : (
          <EditProduct
            refetch={refetch}
            onClose={onClose}
            productSingleData={productSingleData}
          />
        )}
      </ModalComponent>
    </div>
  );
};

export default Product;
