import React from "react";
import { Card, Tooltip, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import useUserStore from "@/store/useUser";
import api from "@/services/api";
import { toast } from "react-toastify";

const PendingCardWarehouse = ({ item, fetchRequests }) => {
  const { user } = useUserStore();
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };
  console.log(item);

  const changeStatusApproved = async () => {
    try {
      if (item?.shop) {
        const quantity = item?.items[0]?.quantity ?? 0;
        const price = item?.items[0]?.product?.price ?? 0;
        const productId = item?.items[0]?.product?.id;
        const shopId = item?.shop?.id;
        const sellerId = item?.shop?.sellers[0]?.id
        const response = await api.patch(`shop-request/change-status/${item?.id}`, { status: "approved" });
        const order = await api.post("order", {
                    shop_id: shopId,
                    warehouse_id: user?.warehouse?.id,
                    seller_id: sellerId,
                    total_amount: price * quantity,
                    payment_method: "cash",
                    items: [
                      {
                        productId: productId,
                        orderId: item?.id,
                        price: price,
                        quantity: quantity,
                        total: price * quantity
                      }
                    ]
                  });
        
      }else{
        const response = await api.patch(
          `warehouse-requests/change-status/${item?.id}`,
          {
            status: "approved",
          }
        );
      }
      fetchRequests();
      toast.success("Mahsulot muvaffaqiyatli berildi");
    } catch (error) {
      toast.error("Mahsulot berishda xatolik yuz berdi");
    }
  };

  const changeStatusRejected = async () => {
    try {
      if(item?.shop){
        const response = await api.patch(`shop-request/change-status/${item?.id}`, {
          status: "rejected",
        });
      }else{
        const response = await api.patch(`warehouse-requests/change-status/${item?.id}`, {
          status: "rejected",
        });
      }
      fetchRequests();
      toast.success("So'rov bekor qilindi");
    } catch (error) {
      toast.error("So'rovni bekor qilishda xatolik yuz berdi");
    }
  };

  return (
    <Card
      className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      bodyStyle={{ padding: "16px", color: "white" }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
              <Tooltip title="So'rov yuboruvchi ombor">
                <span>
                  {item?.destinationWarehouse?.name ||
                    item?.shop?.name ||
                    "Noma'lum"}
                </span>
              </Tooltip>
              <ArrowRightOutlined className="mx-2 text-yellow-400" />
              <Tooltip title="Qabul qiluvchi ombor">
                <span>{user?.warehouse?.name || "Noma'lum"}</span>
              </Tooltip>
            </h3>
          </div>
          <Tooltip title="So'rov yuborilgan sana">
            <span className="text-xs text-gray-300">
              {formatDate(item?.createdAt)}
            </span>
          </Tooltip>
        </div>

        <div className="bg-black/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-300 mb-2">
            So'ralgan mahsulotlar
          </h4>
          {item?.items?.length > 0 ? (
            <div className="space-y-3">
              {item?.items?.map((product) => (
                <div
                  key={product?.id}
                  className="border-b border-gray-600 pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {product?.product?.article || "Noma'lum"}
                    </span>
                    <span className="text-sm">
                      {Math.floor(product?.quantity)} dona
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>
                      Partiya: {product?.product?.batch_number || "Noma'lum"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>
                      Narx: {product?.product?.price?.toLocaleString()} so'm
                    </span>
                    <span>
                      Jami:{" "}
                      {(
                        product?.product?.price * product?.quantity
                      )?.toLocaleString()}{" "}
                      so'm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              So'ralgan mahsulotlar mavjud emas
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <Button type="primary" danger onClick={() => changeStatusRejected()}>
            Rad etish
          </Button>
          <Button type="primary" onClick={() => changeStatusApproved()}>
            Qabul qilish
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PendingCardWarehouse;
