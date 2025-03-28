import React, { useState, useEffect } from "react";
import { Table, Pagination, Tag, Button, Spin } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import bgsklad from "../../../../assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import ModalComponent from "@/components/modal/Modal";
import AddProduct from "./modules/AddProduct/AddProduct";
import ImageModal from "@/components/modal/ImageModal";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";

export default function Warehouse() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUserStore();
  const id = user?.shop?.warehouse_id;

  const { data, isLoading } = useFetch(
    id ? `warehouse-products/byWarehouse/${id}` : null,
    id ? `warehouse-products/byWarehouse/${id}` : null,
    {},
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (data?.data?.products) {
      setFilteredData(data?.data?.products);
    }
  }, [data?.data?.products]);

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchResults = (results) => {
    setFilteredData(results);
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
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      ),
      width: 50,
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
        <Tag color="blue" className="text-gray-100">
          {text}
        </Tag>
      ),
    },
    {
      title: "Narxi ($)",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Rulon soni",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text} ta</span>
      ),
    },
    {
      title: "Rasm",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <div 
          className="max-h-[60px] max-w-[60px] cursor-pointer"
          onClick={() => setSelectedImage(text)}
        >
          <img
            className="h-auto w-full object-cover"
            src={text}
            crossOrigin="anonymous"
            alt="product"
          />
        </div>
      ),
      width: 100,
    },
    {
      title: "Harakatlar",
      key: "action",
      render: (_, record) => (
        user?.role === "seller" && (
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ 
              backgroundColor: "#364153", 
              borderColor: "#364153", 
              fontSize: "12px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2b3445")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#364153")
            }
          >
            Buyurtma berish
          </Button>
        )
      ),
      width: 150,
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          data={data?.data?.products}
          name=""
          title="Омборхона"
          showDatePicker={false}
          onSearch={handleSearchResults}
        />

        {/* Спиннер для загрузки данных */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {filteredData?.length === 0 ? (
              <div className="text-white text-lg">Mahsulot topilmadi</div>
            ) : (
              <div className="w-full px-2">
                <Table
                  columns={columns}
                  dataSource={currentData}
                  pagination={false}
                  className="custom-table"
                  rowClassName={() => "custom-row"}
                  bordered
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
<<<<<<< HEAD
                  cover={<div />}
                  bodyStyle={{ padding: "12px", color: "white" }}
                >
                  <img
                    onClick={() => setSelectedImage(item?.image_url)}
                    crossOrigin="anonymous"
                    className="h-48 w-full bg-cover object-cover cursor-pointer bg-center rounded-t-lg"
                    src={item?.image_url}
                    alt=""
                  />
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold text-white">
                      {item?.article}
                    </h4>
                    <Tag color="blue">
                    Партия: <span className="text-red-500">{item?.batch_number}</span>
                    </Tag>
                    <div className="flex justify-between">
                      <p className="text-gray-300 text-xs">
                      Нархи: {item?.price} $
                      </p>
                      <p className="text-gray-300 text-xs">
                      Рулон сони: {item?.quantity} ta
                      </p>
                    </div>
                    {user?.role === "seller" && (
                      <Button
                        type="primary"
                        onClick={() => showModal(item)}
                        style={{ backgroundColor: "#364153", borderColor: "#364153" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2b3445")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#364153")
                        }
                      >
                        Буюртма бериш
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
=======
                />
              </div>
            )}
>>>>>>> 445d773ddbeaee8c167ba27ea380c2ce14646be5

            <ImageModal
              isOpen={!!selectedImage}
              onClose={() => setSelectedImage(null)}
              imageUrl={selectedImage}
            />
            <ModalComponent
              isOpen={isModalOpen}
              onClose={onClose}
              title={"Омборга буюртма бериш"}
            >
              <AddProduct onClose={onClose} product={selectedProduct} />
            </ModalComponent>
            {filteredData?.length > 0 && (
              <div className="my-2 mb-12 md:mb-0 flex justify-center">
                <Pagination
                  current={currentPage}
                  total={filteredData?.length}
                  pageSize={itemsPerPage}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  className="custom-pagination"
                  itemRender={itemRender}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}