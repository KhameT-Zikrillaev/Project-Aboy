import React, { useState } from "react";
import bgsklad from "@/assets/images/bg-sklad.png";
import { useLocation, useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { Spin, Pagination, Button, Table } from "antd";
import ImageModal from "@/components/modal/ImageModal";
import userStore from "@/store/useUser";
import { toast } from "react-toastify";
import useApiMutation from "@/hooks/useApiMutation";
import dayjs from "dayjs";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function CashregisterDetailes() {
  // const { name } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const shopId = location.state?.shopId;
  const itemsPerPage = 10;
  const user = userStore();
  const todayDate = dayjs().format("YYYY-MM-DD");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const {name} = useParams()

  const {
    data: cashRegisterData,
    isLoading: isCashRegisterLoading,
    refetch: refetchCashRegister,
  } = useFetch(
    shopId ? `cash-transaction/shop/${shopId}/date/${todayDate}/status` : null,
    shopId ? `cash-transaction/shop/${shopId}/date/${todayDate}/status` : null,
    {},
    {
      enabled: !!shopId, // Запрос выполнится только если shopId есть
    }
  );
  // Отладочные сообщения

  const filteredData = cashRegisterData?.data?.isActive
    ? cashRegisterData.data.transactions
    : [];
  const currentData = Array.isArray(filteredData)
    ? filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const { mutate, isLoading: isSending } = useApiMutation({
    url: "cash-transaction/daily-report",
    method: "POST",
    onSuccess: () => {
      toast.success("Касса муваффақиятли ёпилди!");
      refetchCashRegister(); // Обновляем данные после закрытия кассы
    },
    onError: () => {
      toast.error("Касса ёпишда хатолик");
    },
  });

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.id]); // Faqat bitta qator ochiladi
    } else {
      setExpandedRowKeys([]); // Barchasini yopish
    }
  };

  const handleCloseCash = () => {
    const body = {
      shopId: shopId,
      date: todayDate,
      closedBy: user?.user?.id,
    };

    mutate(body, {
      onSuccess: () => {
        setTimeout(() => {
          refetchCashRegister({ force: true }); // Обновляем данные после закрытия кассы
        }, 2000);
      },
    });
  };

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button
          style={{
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LeftOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button
          style={{
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
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
      width: 70,
    },
    {
      title: "Магазин",
      render: ( ) => (
        <span className="text-gray-100 font-semibold">{name}</span>
      ),
    },
    {
      title: "Умумий тушум ($)",
      dataIndex: "order",
      render: (text) => (
        <span className="text-gray-100 font-semibold">
          {text?.total_amount}
        </span>
      ),
    },
    {
      title: "Сана",
      dataIndex: "createdAt",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
  ];

  const columnsNested = [
    {
      title: "№",
      render: (_, __, index) => (
        <span className="text-gray-100 font-semibold">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Артикле",
      dataIndex: "product",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.article}</span>
      ),
    },
    {
      title: "Партия",
      dataIndex: "product",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.batch_number}</span>
      ),
    },
    {
      title: "Рулон  сони",
      dataIndex: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{Math.floor(text)}</span>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
        {isCashRegisterLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {!cashRegisterData?.data?.isActive ? (
              <div className="text-white text-lg">Касса ёпилди</div>
            ) : (
              <div className="w-full">
                <Table
                columns={columns}
                dataSource={filteredData}
                pagination={false}
                rowKey="id"
                className="custom-table custom-table-inner"
                rowClassName={() => "custom-row"}
                bordered
                loading={isCashRegisterLoading}
                expandable={{
                  expandedRowKeys,
                  onExpand: handleExpand,
                  expandedRowRender: (record) =>
                    record?.order?.items && record?.order?.items.length > 0 ? (
                      <Table
                        columns={columnsNested}
                        dataSource={record?.order?.items}
                        pagination={false}
                      />
                    ) : null,
                }}
              />
              </div>
            )}
          </>
        )}

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage}
        />

        {filteredData?.length > 0 && !isCashRegisterLoading && (
          <div className="my-4 flex justify-center">
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

        {filteredData?.length > 0 && !isCashRegisterLoading && (
          <Button
            type="primary"
            style={{ background: "#17212b" }}
            onClick={handleCloseCash}
            loading={isSending}
            disabled={isSending}
          >
            Касса ёпиш
          </Button>
        )}
      </div>
    </div>
  );
}
