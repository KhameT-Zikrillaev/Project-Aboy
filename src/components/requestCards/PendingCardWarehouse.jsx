import React from "react";
import { Card, Tooltip, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import useUserStore from "@/store/useUser";
import api from "@/services/api";
import { toast } from "react-toastify";

const PendingCardWarehouse = ({ item, fetchRequests }) => {
  const { user } = useUserStore();
  const formatDate = (date) => (date ? format(new Date(date), "dd.MM.yyyy HH:mm") : "Номаълум сана");

  const deleteRequest = async () => {
    try {
      const endpoint = item?.shop ? `shop-requests/remove-request/${item?.id}` : `warehouse-requests/remove-request/${item?.id}`;
      await api.delete(endpoint);
      fetchRequests();
      toast.success("Сўров муваффақиятли ўчирилди");
    } catch {
      toast.error("Сўров ўчиришда хатолик юз берди");
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
                  <Tooltip title="Сўров юборувчи омбор">
                    <span>
                      {item?.sourceWarehouse?.name ||
                        item?.shop?.name ||
                        "Номаълум"}
                    </span>
                  </Tooltip>
                  <ArrowRightOutlined className="mx-2 text-yellow-400" />
                  <Tooltip title="Қабул қилувчи омбор">
                    <span>
                      {item?.status === "rejected"
                        ? "Рад этилди"
                        : "Қабул қилинди"}
                    </span>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Сўров юборувчи омбор">
                    <span>
                      {item?.destinationWarehouse?.name ||
                        item?.shop?.name ||
                        "Номаълум"}
                    </span>
                  </Tooltip>
                  <ArrowRightOutlined className="mx-2 text-yellow-400" />
                  <Tooltip title="Қабул қилувчи омбор">
                    <span>{user?.warehouse?.name || "Номаълум"}</span>
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
            Бекор қилинган
          </h4> : item?.status === "approved" ? <h4 className="text-sm font-medium text-green-400 mb-2">
          Қабул қилинган
          </h4> : <h4 className="text-sm font-medium text-yellow-300 mb-2">
          Сўралган маҳсулотлар
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
                      {product?.product?.article || "Номаълум"}
                    </span>
                    <span className="text-sm">
                      {Math.floor(product?.quantity)} дона
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>
                    Партия: {product?.product?.batch_number || "Номаълум"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>
                    Нарх: {product?.product?.price?.toLocaleString()} $
                    </span>
                    <span>
                    Жами:{" "}
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
              Сўралган маҳсулотлар мавжуд эмас
            </p>
          )}
        </div>

          <div className="flex justify-end gap-2 mt-3">
            <Button type="primary"  onClick={deleteRequest}>
            Ўқидим
              </Button>
          </div>
      </div>
    </Card>
  );
};

export default PendingCardWarehouse;
