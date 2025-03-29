import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Pagination, Select } from "antd";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageModal from "@/components/modal/ImageModal";
const { Search } = Input;

const { Option } = Select;

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productSingleData, setProductSingleData] = useState(null);
  const [formType, setFormType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 100;
  const navigate = useNavigate();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [warehouseId, setWarehouseId] = useState(null);

  const {data: warehouseData} = useFetch("warehouse", "warehouse");

  const { data, isLoading, refetch } = useFetch("warehouse-products/all-products", "warehouse-products/all-products", {
    warehouseId: warehouseId || null,
    limit,
    page,
    article: searchQuery || null
  });

  
  const { mutate: deleteProduct } = useApiMutation({
    url: "products", // Asosiy API endpoint
    method: "DELETE",
    onSuccess: () => {
      refetch();
      toast.success("Маҳсулот муваффақиятли ўчирилди!");
    },
    onError: () => {
      toast.error("Маҳсулотни ўчиришда хатолик юз берди");
    },
  });

  const isOpenModal = (imageUrl) => {
    setImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const onCloseModal = () => {
    setImageUrl(null);
    setIsImageModalOpen(false);
  };

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

  const handleChange = (value) => {
    setWarehouseId(value);
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
      title: "Артикул",
      dataIndex: "article",
      key: "article",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Партия",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Рулон сони",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Нархи",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Расм",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <div className="max-h-[80px] max-w-[80px]" onClick={() => isOpenModal(text)}>
          
          <img className="h-auto w-full" src={`${text}`} crossOrigin="anonymous"  />
        </div>
      ),
    },
    {
      title: "Ҳаракатлар",
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
            title="Ўчиришни тасдиқлайсизми?"
            onConfirm={() => handleDelete(record?.id)}
            okText="Ҳа"
            cancelText="Йўқ"
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
        <div className="text-3xl font-bold  text-gray-100">Маҳсулотлар</div>
        <div className="flex gap-3 items-center">
        <Select
            value={warehouseId}
            placeholder="Омбор танланг"
            className="custom-select-filter"
            onChange={handleChange}
            dropdownClassName="custom-dropdown"
          >
            <Option value="">Ҳаммаси</Option>
           {warehouseData?.data?.warehouses?.map((item) => (
             <Option value={item.id}>{item.name}</Option>
           ))}
          </Select>
          <Search
            placeholder="Қидириш"
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
            Қўшиш
          </Button>
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
            onClick={() => navigate("/admin/admin-panel/product-edit-history")}
          >
            Маҳсулотлар тарихи
          </Button>
        </div>
      </div>
      <div className="text-gray-100">
     
        <Table
          columns={columns}
          dataSource={data?.data?.data}
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
            total={data?.total}
            pageSize={limit}
            onChange={handlePageChange}
            itemRender={itemRender}
          />
        </div>
      </div>
      <ImageModal isOpen={isImageModalOpen} onClose={onCloseModal} imageUrl={imageUrl}/>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={onClose}
        title={
          formType === "add" ? "Маҳсулот қўшиш" : "Маҳсулотни таҳрирлаш"
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
