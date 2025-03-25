import React, { useState } from "react";
import { Card, DatePicker, Pagination, Spin, Tag } from "antd";
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
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [dates, setDates] = useState();

  const { id } = useParams();

  const { data, isLoading, refetch } = useFetch(
    `order/shop/${id}`,
    `order/shop/${id}`,
    { page, limit, date: dates ? format(new Date(dates), "yyyy.dd.MM") : null },

  );

  const handleDateChange = (dates) => {
    setDates(dates);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  console.log(format(new Date(dates), "yyyy.dd.MM"));

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
              Qaytarilgan mahsulotlar
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

        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 w-full px-4">
              {data?.data[0]?.map((item) => (
                <Card
                  key={item.key}
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                  bodyStyle={{ padding: "12px", color: "white" }}
                >
                  <div className="flex gap-4">
                    {/* Фото обоев */}
                    <div className=" bg-cover bg-center rounded-lg cursor-pointer" />
                    <div>
                      <img
                        onClick={() =>
                          setSelectedImage(item?.items[0]?.product?.image_url)
                        }
                        className="max-h-[135px] max-w-[200px] h-full object-cover"
                        crossOrigin="anonymous"
                        src={item?.items[0]?.product?.image_url}
                        alt="product img"
                      />
                    </div>

                    {/* Данные */}
                    <div className="w-4/5 flex flex-col gap-2">
                      <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-[5px]">
                          <Tag color="blue">
                            {item?.items[0]?.product?.article}
                          </Tag>
                          <Tag color="orange">
                            {item?.items[0]?.product?.batch_number}
                          </Tag>
                        </div>
                        <h4 className="text-sm font-semibold text-white">
                          Do'kon nomi: {item?.shop?.name}
                        </h4>
                      </div>
                      <div>
                        <p className="text-gray-300 text-xs">
                          Narxi:{" "}
                          {Math.floor(item?.items[0]?.price).toLocaleString()}{" "}
                          so'm
                        </p>
                        <p className="text-gray-300 text-xs">
                          Soni: {Math.floor(item?.items[0]?.quantity)} dona
                        </p>
                        <p className="text-gray-300 text-xs">
                          Jami narxi:{" "}
                          {Math.floor(item?.items[0]?.total).toLocaleString()}{" "}
                          so'm
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300 text-xs">
                            Sotilgan sanasi: {formatDate(item?.createdAt)}
                          </p>
                          <button onClick={() => showModal(item)}>
                            <EditOutlined
                              style={{
                                color:
                                  hoveredItem === item?.id ? "white" : "orange",
                                cursor: "pointer",
                                backgroundColor:
                                  hoveredItem === item?.id
                                    ? "orange"
                                    : "transparent",
                                border: "2px solid orange",
                                padding: "3px",
                                borderRadius: "2px",
                                transition: "all 0.3s ease-in-out",
                              }}
                              onMouseEnter={() => setHoveredItem(item?.id)} // Faqat shu item uchun hover
                              onMouseLeave={() => setHoveredItem(null)} // Hoverdan chiqsa qaytarish
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
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
          </>
        )}

        <ModalComponent
          isOpen={isModalOpen}
          onClose={onClose}
          title={"Mahsulotni qaytarish"}
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
