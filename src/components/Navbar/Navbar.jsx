import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; 
import logo from "@/assets/images/logo.png"; 
import useUserStore from "@/store/useUser";
import { TbBellRinging2Filled } from "react-icons/tb";
import { Badge } from "antd";
import PendingCardWarehouse from "../requestCards/PendingCardWarehouse";
import useFetch from "@/hooks/useFetch";  
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const [openNotification, setOpenNotification] = useState(false);
  const handleGoBack = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length > 2) {
      pathParts.pop();
      const parentPath = pathParts.join("/");
      navigate(parentPath);
    } else {
      navigate(-1);
    }
  };

  const { data: warehouseRequests, refetch: refetchWarehouseRequests } = useFetch(
    "warehouse-requests",
    `warehouse-requests/pending-requests/${user?.warehouse?.id}`,
    {},
    { enabled: user?.role === "staff" }
  );

  const { data: shopRequests, refetch: refetchShopRequests } = useFetch(
    "shop-requests",
    `shop-request/pending-requests/${user?.warehouse?.id}`,
    {},
    { enabled: user?.role === "staff" }
  );

  const { data: orderRequests, refetch: refetchOrderRequests } = useFetch(
    "order-requests",
    `warehouse-requests/all-requests/${user?.warehouse?.id}`,
    {},
    { enabled: user?.role === "staff" }
  );

  const { data: sellerRequests, refetch: refetchSellerRequests } = useFetch(
    "seller-requests",
    `shop-request/all-requests/byShop/${user?.shop?.id}`,
    {},
    { enabled: user?.role === "seller" }
  ); 

  const requests = user?.role === "staff"
    ? [...(warehouseRequests?.data || []), ...(shopRequests?.data || []), ...(orderRequests?.data || [])]
    : user?.role === "seller"
    ? [...(sellerRequests?.data || [])]
    : [];

    const fetchRequests = () => {
      if (user?.role === "staff") {
        refetchWarehouseRequests();
        refetchShopRequests();
        refetchOrderRequests();
      } else if (user?.role === "seller") {
        refetchSellerRequests();
      }
    };

    useEffect(() => {
      const intervalId = setInterval(fetchRequests, 60000);
      return () => clearInterval(intervalId);
    }, [refetchWarehouseRequests, refetchShopRequests, refetchOrderRequests, refetchSellerRequests]);

  const handleOutsideClick = (e) => {
    if (openNotification) {
      setOpenNotification(false);
    }
  };

  return (
    <div className="w-full h-[105px] left-0 top-0 flex justify-between fixed z-10 items-center mb-6 md:mb-10 py-6 px-6 md:px-6 bg-[#17212b] rounded-lg shadow-xl">
      <div className="left-content flex items-center space-x-4">
        <button
          onClick={handleGoBack}
          className="cursor-pointer hover:text-yellow-700 transition-all duration-300 ease-in-out"
        >
          <FaArrowLeft className=" h-4 w-4 md:h-6 md:w-6 text-yellow-200 " />
        </button>
        <div>
          <img
            className="glowing-image  max-w-[50px] ml-4 md:max-w-[100px] w-full"
            src={logo}
            alt="Logo"
          />
        </div>
      </div>
      <div className="right-content flex items-center space-x-4">
        {(user?.role === "staff" || user?.role === "seller") && (
          <div
            className="text-gray-100 text-[30px] mr-5 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenNotification(!openNotification);
            }}
          >
            <Badge count={requests?.length} size="small">
              <TbBellRinging2Filled className="text-gray-100 text-[30px]" />
            </Badge>
          </div>
        )}
        <div className="text-right">
          <h2 className="text-sm md:text-lg font-semibold text-white">
            {user?.name} <br />{" "}
            <span className="text-blue-600">{user?.role}</span>
          </h2>
        </div>
        <Link
          to="/"
          onClick={() => {
            localStorage.removeItem("tokenWall");
          }}
          className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-700 hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out border border-white/20 hover:border-white/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Chiqish
        </Link>
      </div>
      {openNotification && (
        <div
          className="fixed inset-0 bg-transparent w-full h-full z-[1000000]"
          onClick={handleOutsideClick}
        ></div>
      )}
      <div
        className={`p-2 absolute h-screen w-[400px] z-[100000000]  top-0 ${
          openNotification ? "right-0" : "-right-full"
        } bg-[#17212b] transition-all duration-300 ease-in-out overflow-y-scroll`}
      >
        <div className="flex flex-col gap-2">
        {requests?.length === 0 ? (
            <p className="text-gray-100 text-center mt-10">Xabarlar mavjud emas</p>
          ) : (
            requests?.map((request) => (
              <PendingCardWarehouse fetchRequests={fetchRequests} key={request?.id} item={request} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
