import React, { useState } from "react";
import { Card, Tooltip, Button, Checkbox } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUser";
import api from "@/services/api";
import { toast } from "react-toastify";

const PendingCardWarehouse = ({ item, fetchRequests }) => {
  const { user } = useUserStore();
  const [shopList, setShopList] = useState({});

  const formatDate = (date) =>
    date ? format(new Date(date), "dd.MM.yyyy HH:mm") : "Номаълум сана";

  const fetchShops = async (productId) => {
    try {
      const response = await api.get(
        `shop-product/all-shops/${user?.warehouse?.id}/${productId}`
      );
      setShopList((prev) => ({
        ...prev,
        [productId]: response?.data?.data || [],
      }));
    } catch {
      toast.error("Маълумот юклашда хатолик юз берди");
    }
  };

  const sendSelectedShops = async (productId) => {
    const selectedShops = shopList[productId]?.filter((shop) => shop.selected);
    if (!selectedShops?.length)
      return toast.warning("Илтимос, камида битта дўконни танланг");
    try {
      const data = {
        shopIds: selectedShops?.map((shop) => shop?.id),
      };

      await api({
        url: `shop-product/remove-shops/${user?.warehouse?.id}/${productId}`,
        method: "DELETE",
        data,
      });
      fetchRequests()
      setShopList({});
      toast.success("Витринадан маҳсулот ўчирилди");
    } catch {
      toast.error("Витринадан маҳсулот ўчиришда хатолик юз берди");
    }
  };

  const deleteRequest = async () => {
    try {
      const endpoint = item?.shop
        ? `shop-requests/remove-request/${item?.id}`
        : `warehouse-requests/remove-request/${item?.id}`;
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
            Сотилган маҳсулотлар
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
                    <span>Нарх: {product?.price?.toLocaleString()} $</span>
                    <span>
                      Жами:{" "}
                      {(product?.price * product?.quantity)?.toLocaleString()} $
                    </span>
                  </div>
                  <div className="flex justify-end">
                  <Button
                    type="primary"
                    onClick={() => fetchShops(product?.product?.id)}
                    className="text-blue-400 mt-2"
                  >
                    Витринада кўриш
                  </Button>
                  </div>
                  {shopList[product?.product?.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 max-h-40 overflow-y-auto"
                    >
                      {shopList[product?.product?.id]?.map((shop, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 p-2 border border-gray-600 rounded-md bg-black/30 hover:bg-black/40 transition-all"
                        >
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Checkbox
                              onChange={(e) => {
                                setShopList((prev) => ({
                                  ...prev,
                                  [product?.product?.id]: prev[
                                    product?.product?.id
                                  ]?.map((s) =>
                                    s.id === shop.id
                                      ? { ...s, selected: e.target.checked }
                                      : s
                                  ),
                                }));
                              }}
                              checked={shop.selected || false}
                            />
                          </motion.div>
                          <span className="text-sm">{shop?.name}</span>
                        </motion.div>
                      ))}
                      {
                        shopList[product?.product?.id]?.length > 0 ? <div className="flex justify-end"><Button
                        danger
                        type="primary"
                        size="small"
                        className="mt-2"
                        onClick={() => sendSelectedShops(product?.product?.id)}
                      >
                        Ўчириш
                      </Button></div> : <div className="w-full text-center">Витринада мавжуд эмас</div>
                      }
                      
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Сотилган маҳсулотлар мавжуд эмас
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button type="primary" onClick={deleteRequest}>
            Ўқидим
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PendingCardWarehouse;
