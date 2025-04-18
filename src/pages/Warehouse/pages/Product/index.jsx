import React, { useState } from "react";
import bgsklad from "@/assets/images/bg-sklad.png";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import SearchForm from "@/components/SearchForm/SearchForm";
import { Button, Pagination, Table } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Total from "@/components/total/Total";
import { RiFileExcel2Line } from "react-icons/ri";
import api from "@/services/api";

export default function Warehouse() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 100;

  const { user } = useUserStore();
  const id = user?.warehouse?.id;

  const { data, isLoading, refetch } = useFetch(
    `warehouse-products/all-products`,
    `warehouse-products/all-products`,
    {
      page,
      limit,
      warehouseId: id,
      article: searchQuery || null,
    },
    { enabled: !!id }
  );

  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      const response = await api.get(`warehouse-products/export-excel/${user?.warehouse?.id}`, {
        responseType: "blob", // Fayl sifatida yuklab olish
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx"); // Fayl nomi
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Excel yuklab olishda xatolik:", error);
    }finally{
      setExcelLoading(false);
    }
  };

  const isOpenModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const onCloseModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
  };

  const onSearch = (searchParams) => {
    const searchValue = searchParams.article || "";
    setSearchQuery(searchValue);
    setPage(1);
  };

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
          <LeftOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
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
        text ? <div
        className="max-h-[80px] max-w-[80px]"
        onClick={() => isOpenModal(text)}
      >
        <img
          className="h-auto w-full"
          src={`${text}`}
          crossOrigin="anonymous"
        />
      </div> : <span className="text-gray-100 font-semibold">-</span>
      ),
    },
    {
      title: "Витринадаги маҳсулот",
      dataIndex: "shop_product_item",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
  ];

  const totalPrice = data?.data?.total_price;
  const totalQuantity = data?.data?.total_quantity;

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          title={"Маҳсулотлар"}
          showDatePicker={false}
          onSearch={onSearch}
        />

        <div className="text-gray-100 w-full flex flex-col">
          {data?.data?.total > 0 && (
            <>
              <Total totalPrice={totalPrice} totalQuantity={totalQuantity} />
              <Button onClick={handleDownloadExcel} loading={excelLoading} className="flex self-end items-center " style={{ background: "oklch(0.627 0.194 149.214)", border: "none", color: "white", fontSize: "18px", marginBottom: "15px" }}>
                <RiFileExcel2Line size={18} /> Excel орқали юклаб олиш
              </Button>
            </>
          )}
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
              total={data?.data?.total}
              showSizeChanger={false}
              pageSize={limit}
              onChange={handlePageChange}
              itemRender={itemRender}
            />
          </div>
        </div>

        <ImageModal
          isOpen={isImageModalOpen}
          onClose={onCloseModal}
          imageUrl={selectedImage}
        />
      </div>
    </div>
  );
}
