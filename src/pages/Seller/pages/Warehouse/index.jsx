import React, { useState, useEffect } from "react";
import { Card, Pagination, Tag, Button, Spin } from "antd";
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
  const [itemsPerPage, setItemsPerPage] = useState(8);
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
    setItemsPerPage(window.innerWidth < 768 ? 4 : 10);
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
          title="Omborxona"
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
            <div className="grid grid-cols-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1 w-full px-2">
              {currentData?.map((item) => (
                <Card
                  key={item?.id}
                  className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                  bodyStyle={{ padding: '4px', color: 'white' }}
                >
                  <img
                    onClick={() => setSelectedImage(item?.image_url)}
                    crossOrigin="anonymous"
                    className="h-12 w-full object-cover cursor-pointer rounded-t-lg mb-1" 
                    src={item?.image_url}
                    alt=""
                  />
                   <h3 className="text-sm font-semibold text-white">{item?.article}</h3>
                    <Tag style={{ width: '100%', fontSize: '12px'}} color="blue">Part: <br/>
                      <span className="text-red-500">{item?.batch_number}</span></Tag>
                      <h4 className="text-sm font-semibold text-white">Narxi: {item?.price + " $"}</h4>        
                      <span className="text-gray-300 text-xs">
                        Rulon soni: {item?.quantity} ta
                      </span>
                    {user?.role === "seller" && (
                      <Button
                        type="primary"
                        onClick={() => showModal(item)}
                        style={{ backgroundColor: "#364153", borderColor: "#364153", fontSize: "12px", width: "100%", padding: "1px" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2b3445")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#364153")
                        }
                      >
                        <span className="text-xs">Buyurtma <br/> berish</span>
                      </Button>
                    )}    
                </Card>
              ))}
            </div>

            <ImageModal
              isOpen={!!selectedImage}
              onClose={() => setSelectedImage(null)}
              imageUrl={selectedImage}
            />
            <ModalComponent
              isOpen={isModalOpen}
              onClose={onClose}
              title={"Omborga buyurtma berish"}
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
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}