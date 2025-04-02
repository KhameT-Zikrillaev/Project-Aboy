import React, { useState } from "react";
import { Button, Card, DatePicker, Pagination, Spin, Table, Tag } from "antd";
import "antd/dist/reset.css";
import { useParams } from "react-router-dom";
import bgsklad from "@/assets/images/bg-sklad.png";
import ImageModal from "@/components/modal/ImageModal";
import { EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import ModalComponent from "@/components/modal/Modal";
import EditReturnProduct from "../../components/EditReturnProductNumber";
import useFetch from "@/hooks/useFetch";
import { format } from "date-fns";
import { FaArchive } from "react-icons/fa";

export default function ReturnProducts() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 100;
  const [dates, setDates] = useState();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const { id } = useParams();

  const { data, isLoading, refetch } = useFetch(
    `order/shop/${id}`,
    `order/shop/${id}`,
    { page, limit, date: dates ? format(new Date(dates), "yyyy-MM-dd") : null }
  );

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.id]); // Faqat bitta qator ochiladi
    } else {
      setExpandedRowKeys([]); // Barchasini yopish
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  const showModal = (product) => {
    setSelectedProduct(product); // Устанавливаем выбранный товар
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Сбрасываем выбранный товар при закрытии модального окна
  };

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
  };

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
      title: "Магазин",
      dataIndex: "shop",
      render: ( text) => (
        <span className="text-gray-100 font-semibold">{text.name}</span>
      ),
    },
    {
      title: "Умумий тушум ($)",
      dataIndex: "total_amount",
      render: (text) => (
        <span className="text-gray-100 font-semibold">
          {Math.floor(text)}
        </span>
      ),
    },
    {
      title: "Сана",
      dataIndex: "createdAt",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{formatDate(text)}</span>
      ),
    },
    {
      title: "Harakatlar",
      render: (record) => (
        <Button
            type="primary"
            icon={<EditOutlined />}
            className="edit-btn"
            onClick={() => showModal(record)}
          />
      ),
    },
  ];

  const columnsNested = [
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
      title: "Артикле",
      dataIndex: "product",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.article}</span>
      ),
    },
    {
      title: "Партия",
      dataIndex: "product",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.batch_number}</span>
      ),
    },
    {
      title: "Рулон  сони",
      dataIndex: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{Math.floor(text)}</span>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
          {/* Логотип и заголовок */}
          <div className="flex justify-center md:justify-start items-center">
            <FaArchive className="text-3xl text-white" />
            <span className="text-xl font-semibold ml-2 text-white">
              Сотилган маҳсулотлар
            </span>
          </div>

          {/* Поле для выбора диапазона дат */}
          <div className="flex flex-col md:flex-row gap-3">
            <DatePicker
              onChange={handleDateChange}
              value={dates}
              format="DD/MM/YYYY"
              className="custom-datepicker"
              style={{
                backgroundColor: "#17212b",
                "--placeholder-color": "white",
              }}
            />
          </div>
        </div>
        <div className="w-full">
          <Table
            columns={columns}
            dataSource={data?.data[0]}
            pagination={false}
            rowKey="id"
            className="custom-table custom-table-inner"
            rowClassName={() => "custom-row"}
            bordered
            loading={isLoading}
            expandable={{
              expandedRowKeys,
              onExpand: handleExpand,
              expandedRowRender: (record) =>
                record?.items && record?.items?.length > 0 ? (
                  <Table
                    columns={columnsNested}
                    dataSource={record?.items}
                    pagination={false}
                  />
                ) : null,
            }}
          />
        </div>

        <div className="my-2 mb-12 md:mb-2  flex justify-center">
          <Pagination
            current={page}
            total={data?.data[1]}
            onChange={handlePageChange}
            pageSize={limit}
            itemRender={itemRender}
            className="custom-pagination"
          />
        </div>

        <ModalComponent
          isOpen={isModalOpen}
          onClose={onClose}
          title={"Маҳсулотни қайтариш"}
        >
          <EditReturnProduct
            refetch={refetch}
            onClose={onClose}
            product={selectedProduct}
          />
        </ModalComponent>

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />
      </div>
    </div>
  );
}
