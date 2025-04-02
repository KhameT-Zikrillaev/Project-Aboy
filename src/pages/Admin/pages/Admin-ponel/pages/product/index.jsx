import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Pagination,
  Select,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
  LeftOutlined,
  UploadOutlined,
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
import Total from "@/components/total/Total";
import { RiFileExcel2Line } from "react-icons/ri";
import api from "@/services/api";
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
  const [excelLoading, setExcelLoading] = useState(false);

  const { data: warehouseData } = useFetch("warehouse", "warehouse");

  const { data, isLoading, refetch } = useFetch(
    "warehouse-products/all-products",
    "warehouse-products/all-products",
    {
      warehouseId: warehouseId || null,
      limit,
      page,
      article: searchQuery || null,
    }
  );

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

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      if (warehouseId) {
        const response = await api.get(
          `warehouse-products/export-excel/${warehouseId}`,
          {
            responseType: "blob", // Fayl sifatida yuklab olish
          }
        );

        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.xlsx"); // Fayl nomi
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.info("Омбор танланг");
      }
    } catch (error) {
      toast.error("Excel юклаб олишда хатолик");
    } finally {
      setExcelLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isExcel =
      file.type === "application/vnd.ms-excel" || // .xls
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // .xlsx

    if (!isExcel) {
      toast.error("Фақат .хлс ёки .хлсх файлларни юклаш мумкин!");
    }
    return isExcel;
  };

  const handleUpload = async (info) => {
    const { file } = info;
    const formData = new FormData();
    formData.append("file", file);

    try {
      if(warehouseId){
        await api.post(`products/upload-excel/${warehouseId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        refetch()
        toast.success("Файл муваффақиятли юкланди!");
      }else{
        toast.info("Омбор танланг");
      }
    } catch (error) {
      toast.error("Файл юклашда хатолик юз берди!");
    }
  };

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
        <div
          className="max-h-[80px] max-w-[80px]"
          onClick={() => isOpenModal(text)}
        >
          <img
            className="h-auto w-full"
            src={`${text}`}
            crossOrigin="anonymous"
          />
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
      <div className="flex justify-between items-center mb-5">
        <div className="text-3xl font-bold  text-gray-100">Excel</div>
        <div className="flex gap-3 items-center">
          <Button
            onClick={handleDownloadExcel}
            loading={excelLoading}
            className="flex self-end items-center "
            style={{
              background: "oklch(0.627 0.194 149.214)",
              border: "none",
              color: "white",
              fontSize: "18px",
            }}
          >
            <RiFileExcel2Line size={18} /> Excel орқали юклаб олиш
          </Button>
          <Upload
            beforeUpload={beforeUpload}
            customRequest={handleUpload}
            showUploadList={false}
          >
            <Button
              style={{
                background: "oklch(0.627 0.194 149.214)",
                border: "none",
                color: "white",
                fontSize: "18px",
              }}
              icon={<UploadOutlined />}
            >
              Excel орқали юклаш
            </Button>
          </Upload>
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
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={onCloseModal}
        imageUrl={imageUrl}
      />
      <ModalComponent
        isOpen={isModalOpen}
        onClose={onClose}
        title={formType === "add" ? "Маҳсулот қўшиш" : "Маҳсулотни таҳрирлаш"}
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
