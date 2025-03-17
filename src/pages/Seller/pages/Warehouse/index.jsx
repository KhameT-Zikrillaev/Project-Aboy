import React, { useState, useEffect } from "react";
import { Card, Pagination, Tag, Button } from "antd";
import "antd/dist/reset.css";
import bgsklad from "../../../../assets/images/bg-sklad.png";
import SearchForm from "@/components/SearchForm/SearchForm";
import bg from "../../../../assets/images/bg-login.jpg";
import ModalComponent from "@/components/modal/Modal";
import AddProduct from "./modules/AddProduct/AddProduct";
import ImageModal from "@/components/modal/ImageModal";
const dataSource = [
  {
    key: "1",
    code: "OB001",
    name: 'Обои "Синий океан"',
    price: 1000,
    stock: 10,
    photo: bg,
  },
  {
    key: "2",
    code: "OB002",
    name: 'Обои "Зеленый лес"',
    price: 1200,
    stock: 5,
    photo: bg,
  },
  {
    key: "3",
    code: "OB003",
    name: 'Обои "Красный закат"',
    price: 1100,
    stock: 8,
    photo: bg,
  },
  {
    key: "4",
    code: "OB004",
    name: 'Обои "Желтый песок"',
    price: 900,
    stock: 15,
    photo: bg,
  },
  {
    key: "5",
    code: "OB005",
    name: 'Обои "Фиолетовый туман"',
    price: 1300,
    stock: 3,
    photo: bg,
  },
  {
    key: "6",
    code: "OB006",
    name: 'Обои "Голубое небо"',
    price: 950,
    stock: 7,
    photo: bg,
  },
  {
    key: "7",
    code: "OB007",
    name: 'Обои "Розовый рассвет"',
    price: 1050,
    stock: 12,
    photo: bg,
  },
  {
    key: "8",
    code: "OB008",
    name: 'Обои "Серый камень"',
    price: 800,
    stock: 20,
    photo: bg,
  },
  {
    key: "9",
    code: "OB009",
    name: 'Обои "Белый снег"',
    price: 1000,
    stock: 0,
    photo: bg,
  },
  {
    key: "10",
    code: "OB010",
    name: 'Обои "Черная ночь"',
    price: 1400,
    stock: 6,
    photo: bg,
  },
  {
    key: "11",
    code: "OB011",
    name: 'Обои "Оранжевый закат"',
    price: 1150,
    stock: 9,
    photo: bg,
  },
  {
    key: "12",
    code: "OB012",
    name: 'Обои "Коричневый дуб"',
    price: 1250,
    stock: 4,
    photo: bg,
  },
  {
    key: "13",
    code: "OB013",
    name: 'Обои "Бирюзовый океан"',
    price: 1350,
    stock: 15,
    photo: bg,
  },
  {
    key: "14",
    code: "OB014",
    name: 'Обои "Лавандовый туман"',
    price: 950,
    stock: 12,
    photo: bg,
  },
  {
    key: "15",
    code: "OB015",
    name: 'Обои "Мятный бриз"',
    price: 1100,
    stock: 7,
    photo: bg,
  },
];

export default function Warehouse() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [filteredData, setFilteredData] = useState(dataSource);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (product) => {
    setSelectedProduct(product); // Устанавливаем выбранный товар
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Сбрасываем выбранный товар при закрытии модального окна
  };

  const updateItemsPerPage = () => {
    setItemsPerPage(window.innerWidth < 768 ? 4 : 10);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        <SearchForm
          data={dataSource}
          name=""
          title="Omborxona"
          showDatePicker={false}
          onSearch={setFilteredData}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full px-4">
          {currentData.map((item) => (
            <Card
              key={item.key}
              className="shadow-lg hover:shadow-xl transition-shadow rounded-lg"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              cover={
                <div
                onClick={() => setSelectedImage(item.photo)}
                  className="h-28 bg-cover bg-center rounded-t-lg"
                  style={{ backgroundImage: `url(${item.photo})` }}
                />
              }
              bodyStyle={{ padding: "12px", color: "white" }}
            >
              <div className="flex flex-col gap-2">
                <Tag color="blue">
                  Part: <span className="text-red-500">{item.code}</span>
                </Tag>
                <h4 className="text-sm font-semibold text-white">
                  {item.name}
                </h4>
                <div className="flex justify-between">
                  <p className="text-gray-300 text-xs">
                    Narxi: {item.price} so'm
                  </p>
                  <p className="text-gray-300 text-xs">
                    Soni bor: {item.stock} dona.
                  </p>
                </div>
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
                  Buyurtma berish
                </Button>
              </div>
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
        {filteredData.length > 0 && (
          <div className="my-2 mb-12 md:mb-0 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredData.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
