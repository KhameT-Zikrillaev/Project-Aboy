import React, { useState, useEffect } from "react";
import { Card, Pagination, Tag } from "antd";
import "antd/dist/reset.css";
import { useParams } from "react-router-dom";
import bg from "@/assets/images/bg-login.jpg";
import ImageModal from "@/components/modal/ImageModal";
import  bgsklad  from '@/assets/images/bg-sklad.png';
import { TbShoppingCartCheck } from "react-icons/tb";
const dataSource = [
  {
    key: "1",
    date: "2023-10-01",
    returnDate: "2023-10-05",
    code: "#4443",
    name: 'Oboi "Yashil o‘rmon"',
    color: "#008000",
    action: "sotib olindi",
    quantity: 10,
    returns: 2,
    price: 250000,
    party: "123-45",
    photo: bg,
    storeName: "Lesnoy Dom",
  },
  {
    key: "2",
    date: "2023-10-02",
    returnDate: "2023-10-06",
    code: "#4444",
    name: 'Oboi "Moviy okean"',
    color: "#0000FF",
    action: "sotib olindi",
    quantity: 5,
    returns: 1,
    price: 220000,
    party: "234-56",
    photo: bgsklad,
    storeName: "Okean Dekor",
  },
  {
    key: "3",
    date: "2023-10-03",
    returnDate: "2023-10-07",
    code: "#4445",
    name: 'Oboi "Qizil shafaq"',
    color: "#FF0000",
    action: "sotib olindi",
    quantity: 8,
    returns: 0,
    price: 275000,
    party: "345-67",
    photo: bg,
    storeName: "Solnechnyy Svet",
  },
  {
    key: "4",
    date: "2023-10-04",
    returnDate: "2023-10-08",
    code: "#4446",
    name: 'Oboi "Sariq qum"',
    color: "#FFFF00",
    action: "sotib olindi",
    quantity: 15,
    returns: 3,
    price: 190000,
    party: "456-78",
    photo: bg,
    storeName: "Peschanaya Lavka",
  },
  {
    key: "5",
    date: "2023-10-05",
    returnDate: "2023-10-09",
    code: "#4447",
    name: 'Oboi "Binafsha tuman"',
    color: "#800080",
    action: "sotib olindi",
    quantity: 3,
    returns: 0,
    price: 300000,
    party: "567-89",
    photo: bg,
    storeName: "Tumannyy Ray",
  },
  {
    key: "6",
    date: "2023-10-06",
    returnDate: "2023-10-10",
    code: "#4448",
    name: 'Oboi "Moviy osmon"',
    color: "#87CEEB",
    action: "sotib olindi",
    quantity: 7,
    returns: 1,
    price: 210000,
    party: "678-90",
    photo: bg,
    storeName: "Nebesnyy Mir",
  },
  {
    key: "7",
    date: "2023-10-07",
    returnDate: "2023-10-11",
    code: "#4449",
    name: 'Oboi "Pushti tong"',
    color: "#FFC0CB",
    action: "sotib olindi",
    quantity: 12,
    returns: 4,
    price: 230000,
    party: "789-12",
    photo: bg,
    storeName: "Rassvet Dekor",
  },
  {
    key: "8",
    date: "2023-10-08",
    returnDate: "2023-10-12",
    code: "#4450",
    name: 'Oboi "Kulrang tosh"',
    color: "#808080",
    action: "sotib olindi",
    quantity: 20,
    returns: 5,
    price: 280000,
    party: "890-23",
    photo: bg,
    storeName: "Kamennyy Ugol",
  },
  {
    key: "9",
    date: "2023-10-09",
    returnDate: "2023-10-13",
    code: "#4451",
    name: 'Oboi "Oq qor"',
    color: "#FFFFFF",
    action: "sotib olindi",
    quantity: 0,
    returns: 0,
    price: 200000,
    party: "901-34",
    photo: bg,
    storeName: "Zimniy Ray",
  },
  {
    key: "10",
    date: "2023-10-10",
    returnDate: "2023-10-14",
    code: "#4452",
    name: 'Oboi "Qora tun"',
    color: "#000000",
    action: "sotib olindi",
    quantity: 6,
    returns: 2,
    price: 260000,
    party: "012-45",
    photo: bg,
    storeName: "Nochnaya Magiya",
  },
];

export default function CashRegisterDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [filteredData, setFilteredData] = useState(dataSource);
  const [selectedImage, setSelectedImage] = useState(null);

  const { name } = useParams();

  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(5);
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
       <div className="flex flex-col md:flex-row w-full justify-between gap-3 mb-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
      {/* Логотип и заголовок */}
      <div className="flex justify-center md:justify-start items-center">
        <TbShoppingCartCheck className="text-3xl text-white" />
        <span className="text-xl font-semibold ml-2 text-white">{name}   Kassasi</span>
      </div>

    </div>
    <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4">
          {currentData.map((item) => (
            <Card
              key={item.key}
              className="shadow-lg hover:shadow-xl  transition-shadow rounded-lg"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              bodyStyle={{ padding: "12px", color: "white" }}
            >
              <div className="flex flex-col justify-center items-center sm:flex-row gap-4">
                <div
                  onClick={() => setSelectedImage(item.photo)}
                  className="w-full flex  sm:w-1/3 h-32 bg-cover bg-center rounded-lg cursor-pointer"
                  style={{ backgroundImage: `url(${item.photo})` }}
                />
                <div className="w-full sm:w-2/3 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                    <div className="flex gap-[5px]">
                      <Tag color="blue">{item.code}</Tag>
                      <Tag color="orange">{item?.party}</Tag>
                    </div>
                    {/* <h4 className="text-sm font-semibold text-white">
                      Do'kon nomi: {item.name}
                    </h4> */}
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs">
                      Soni: {item.quantity} dona
                    </p>
                    <p className="text-gray-300 text-xs">
                      Jami narxi: {item.price * item.quantity} so'm
                    </p>
                    <p className="text-gray-300 text-xs">
                      Berilgan sanasi: {item.date}
                    </p>
                    <p className="text-gray-300 text-xs pt-2 text-right">
                      Do'kon nomi:{" "}
                      <span className="text-white font-bold">{item.name}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />

     {dataSource.length > 0 && (
        <div className="my-2 mb-12 md:mb-2  flex justify-center">
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            className="text-white [&_.ant-pagination-item]:bg-transparent [&_.ant-pagination-item]:transition [&_.ant-pagination-item:hover]:bg-white [&_.ant-pagination-item-active]:bg-white [&_.ant-pagination-item-active]:text-black"
          />
        </div>
     )}
     <div className="w-full flex justify-end mr-12 mb-12"> 
     <button  style={{color:"white"}} className="bg-white/10  py-2 px-4 mr-auto hover:bg-white/20 cursor-pointer  rounded-lg">Kassani yopish</button>
     </div>
      
      </div>
   
    </div>
  );
}
