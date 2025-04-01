import React, { useState} from "react";
import { Pagination, Table } from "antd";
import "antd/dist/reset.css";
import bgsklad from "@/assets/images/bg-sklad.png";
import SearchFormStartEnd from "@/components/SearchFormStartEnd/SearchFormStartEnd";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
export default function ReportWarehouseSend() {
  const [selectedDates, setSelectedDates] = useState({ from: null, to: null });
  const [page, setPage] = useState(1);
  const limit = 100;
  const { user } = useUserStore();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const startDate = selectedDates?.from;
  const endDate = selectedDates?.to;
  const isFetchEnabled = !!(startDate && endDate);

  const { data, isLoading, refetch } = useFetch(
    `warehouse-transfers/transfer/${user?.warehouse?.id}`,
    `warehouse-transfers/transfer/${user?.warehouse?.id}`,
    { fromDate: startDate, toDate: endDate, page, limit },
    { enabled: isFetchEnabled }
  );

  console.log(data?.data);
  

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
      title: "Юборган омбор",
      dataIndex: "sourceWarehouse",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.name}</span>
      ),
    },
    {
      title: "Қабул қилган омбор",
      dataIndex: "destinationWarehouse",
      render: (text) => (
        <span className="text-gray-100 font-semibold">
          {text?.name}
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
          {(page - 1) * limit + index + 1}
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
        <span className="text-gray-100 font-semibold">{text.batch_number}</span>
      ),
    },
    {
      title: "Рулон  сони",
      dataIndex: "quantity",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
  ];

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.id]); // Faqat bitta qator ochiladi
    } else {
      setExpandedRowKeys([]); // Barchasini yopish
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
      <div className="w-full max-w-[1440px] mx-auto flex flex-col  mt-[110px]">
        <SearchFormStartEnd
          title={`${user?.warehouse?.name} ҳисоботлари`}
          onSearch={handleDateSearch}
        />
        <Table
          columns={columns}
          dataSource={data?.data?.transfers}
          pagination={false}
          rowKey="id"
          className="custom-table custom-table-inner"
          rowClassName={() => "custom-row"}
          bordered
          loading={isLoading}
          expandable={{
            expandedRowKeys,
            onExpand: handleExpand,
            expandedRowRender: (record) =>
              record?.items && record?.items.length > 0 ? (
                <Table
                  columns={columnsNested}
                  dataSource={record?.items || []}
                  pagination={false}
                />
              ) : null,
          }}
        />
        <div className="flex justify-center mt-5">
          <Pagination
            className="custom-pagination"
            current={page}
            total={data?.data?.total || 0}
            pageSize={limit}
            onChange={handlePageChange}
            itemRender={itemRender}
          />
        </div>
      </div>
    </div>
  );
}
