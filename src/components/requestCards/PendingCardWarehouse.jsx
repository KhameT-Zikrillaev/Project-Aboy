import React from "react";
import { Card, Tooltip, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import useUserStore from "@/store/useUser";
import api from "@/services/api";
import { toast } from "react-toastify";

const PendingCardWarehouse = ({ item, fetchRequests }) => {
  const { user } = useUserStore();
  const formatDate = (date) => (date ? format(new Date(date), "dd.MM.yyyy HH:mm") : "Noma'lum sana");

  const updateStatus = async (status) => {
    try {
      const endpoint = item?.shop ? `shop-request/change-status/${item?.id}` : `warehouse-requests/change-status/${item?.id}`;
      await api.patch(endpoint, { status });
      
      if (status === "approved" && item?.shop) {
        const { quantity = 0, product } = item?.items[0] || {};
        await api.post("order", {
          shop_id: item.shop.id,
          warehouse_id: user?.warehouse?.id,
          seller_id: item.shop.sellers[0]?.id,
          total_amount: product?.price * quantity,
          payment_method: "cash",
          items: [{
            productId: product?.id,
            orderId: item?.id,
            price: product?.price,
            quantity,
            total: product?.price * quantity,
          }],
        });
      }

      fetchRequests();
      toast.success(status === "approved" ? "Mahsulot muvaffaqiyatli berildi" : "So'rov bekor qilindi");
    } catch (error) {
      toast.error(error?.response?.status === 404 ? "Mahsulot yetarli emas" : "Xatolik yuz berdi");
    }
  };

  const deleteRequest = async () => {
    try {
      const endpoint = item?.shop ? `shop-request/remove-request/${item?.id}` : `warehouse-requests/remove-request/${item?.id}`;
      await api.delete(endpoint);
      fetchRequests();
      toast.success("So'rov muvaffaqiyatli o'chirildi");
    } catch {
      toast.error("So'rov o'chirishda xatolik yuz berdi");
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
              {item?.status === "rejected" || item?.status === "approved" ? (
                <>
                  <Tooltip title="So'rov yuboruvchi ombor">
                    <span>
                      {item?.sourceWarehouse?.name ||
                        item?.shop?.name ||
                        "Noma'lum"}
                    </span>
                  </Tooltip>
                  <ArrowRightOutlined className="mx-2 text-yellow-400" />
                  <Tooltip title="Qabul qiluvchi ombor">
                    <span>
                      {item?.status === "rejected"
                        ? "Rad etildi"
                        : "Qabul qilindi"}
                    </span>
                  </Tooltip>
                </>
              ) : (
                <>
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
                </>
              )}
            </h3>
          </div>
          <Tooltip title="So'rov yuborilgan sana">
            <span className="text-xs text-gray-300">
              {formatDate(item?.createdAt)}
            </span>
          </Tooltip>
        </div>

        <div className="bg-black/20 p-3 rounded-lg">
          {
            item?.status === "rejected" ? <h4 className="text-sm font-medium text-red-400 mb-2">
            Bekor qilingan
          </h4> : item?.status === "approved" ? <h4 className="text-sm font-medium text-green-400 mb-2">
            Qabul qilingan
          </h4> : <h4 className="text-sm font-medium text-yellow-300 mb-2">
            So'ralgan mahsulotlar
          </h4>
          }
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
                      Narx: {product?.product?.price?.toLocaleString()} $
                    </span>
                    <span>
                      Jami:{" "}
                      {(
                        product?.product?.price * product?.quantity
                      )?.toLocaleString()}{" "}
                      $
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

        {item?.status !== "pending" ? (
          <div className="flex justify-end gap-2 mt-3">
            <Button type="primary"  onClick={deleteRequest}>
                O'qidim
              </Button>
          </div>
        ) : (
          <>
            {" "}
            <div className="flex justify-end gap-2 mt-3">
              <Button
                type="primary"
                danger
                onClick={() => updateStatus("rejected")}
              >
                Rad etish
              </Button>
              <Button type="primary" onClick={() => updateStatus("approved")}>
                Qabul qilish
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default PendingCardWarehouse;
