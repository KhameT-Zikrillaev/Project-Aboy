import React  from "react";
import "antd/dist/reset.css";
import bgsklad from "@/assets/images/bg-sklad.png";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import { Link } from "react-router-dom";
import { Spin } from "antd";



export default function ReportSellerSend() {
  const {user} = useUserStore();
  const warehouseId = user?.warehouse?.id;

  const { data, isLoading } = useFetch(
    warehouseId ? `warehouse/${warehouseId}` : null, // ID yo'q bo‘lsa, URL null bo‘ladi
    `warehouse/${warehouseId}`,
    {},
    { enabled: !!warehouseId } // `enabled` opsiyasi bilan so‘rov faqat ID mavjud bo‘lganda bajariladi
  );

  const handleShopClick = (shopId) => {
    sessionStorage.setItem("shopId", shopId);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full">
          {Array.isArray(data?.data?.shops) && data?.data?.shops.length > 0 ? 
            data?.data?.shops.map((district) => (
              <Link
                key={district.id}
                to={`/warehouse/report-seller-send/${district.name}`}
                onClick={() => handleShopClick(district.id)}
                className="block bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition"
              >
                <h4>{district.name}</h4>
              </Link>
            ))
          : (
            <div className="col-span-2 text-center text-gray-500">
              Hech narsa yo'q
            </div>
          )}
        </div>
      )}

        {/* <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        /> */}

        {/* {filteredData.length > 0 && (
          <div className="my-2 mb-12 md:mb-2 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredData.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        )} */}
      </div>
    </div>
  );
}