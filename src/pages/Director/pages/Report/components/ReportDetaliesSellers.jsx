import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SearchFormStartEnd from "@/components/SearchFormStartEnd/SearchFormStartEnd";
import { Pagination, Table } from "antd";

export default function ReportDetaliesSellers() {
  const [selectedDates, setSelectedDates] = useState({ from: null, to: null });
  const [page, setPage] = useState(1);
    const limit = 100;
    const {name} = useParams()
    const startDate = selectedDates?.from;
  const endDate = selectedDates?.to;
  // const isFetchEnabled = !!(shopId && startDate && endDate);
  const warehouseId = sessionStorage.getItem("warehouseId");

 const { data, isLoading, refetch } = useFetch(
     `cash-register/warehouse/${warehouseId}`,
     `cash-register/warehouse/${warehouseId}`,
     { 
      // startDate, 
      // endDate, 
      page, 
      limit },
    //  { enabled: isFetchEnabled }
   );

  const handleDateSearch = (from, to) => {
    setSelectedDates({ from, to });
    setPage(1);
  };

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
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
          {(page - 1) * limit + index + 1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Сана",
      dataIndex: "date",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Умумий тушум ($)",
      dataIndex: "totalIncome",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Қайтарилган сўмма ($)",
      dataIndex: "totalRefund",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Соф фойда ($)",
      dataIndex: "netTotal",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Магазин",
      dataIndex: "shop",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text || ""}</span>
      ),
    },
  ];


  return (
    <div className="mt-[120px] px-2">
      <div className="relative max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[110px]">
        <SearchFormStartEnd
          title={`${name} ҳисоботлари`}
          onSearch={handleDateSearch}
        />

        {!startDate || !endDate ? (
          <p className="text-center text-gray-500 text-[20px] pt-14">
            Илтимос, санани танланг
          </p>
        ) : (
          <div className="text-gray-100 w-full px-4">
            <Table
              columns={columns}
              dataSource={data?.data[0]}
              pagination={false}
              className="custom-table"
              rowClassName={() => "custom-row"}
              bordered
              loading={isLoading}
            />
            <div className="flex justify-center mt-5">
              <Pagination
                className="custom-pagination"
                current={page}
                total={data?.data[1] || 0}
                pageSize={limit}
                onChange={handlePageChange}
                itemRender={itemRender}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
