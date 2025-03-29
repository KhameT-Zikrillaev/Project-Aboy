import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { Pagination, Spin, Table } from "antd";
import RepordCardShop from "@/components/reportCardShop/RepordCardShop";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ReportDetailesSingle = () => {
  const shopId = sessionStorage.getItem("shopId");
  const { date } = useParams();
  const [page, setPage] = useState(1);
  const limit = 100;
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  console.log(expandedRowKeys);

  const { data, isLoading } = useFetch(
    `cash-register/date/${date}/shop/${shopId}`,
    `cash-register/date/${date}/shop/${shopId}`
  );

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.id]); // Faqat bitta qator ochiladi
    } else {
      setExpandedRowKeys([]); // Barchasini yopish
    }
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
      title: "Магазин",
      dataIndex: "shop",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.name}</span>
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
          {(page - 1) * limit + index + 1}
        </span>
      ),
      width: 70,
    },
    {
      title: "Артикле",
      dataIndex: "article",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
      ),
    },
    {
      title: "Партия",
      dataIndex: "batch_number",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text}</span>
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


  return (
    <div className="mt-[120px]">
      <div className="text-gray-100 w-full px-4">
        <Table
          columns={columns}
          dataSource={data?.data?.transactions}
          pagination={false}
          rowKey="id"
          className="custom-table"
          rowClassName={() => "custom-row custom-row-click"}
          bordered
          loading={isLoading}
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
        <div className="flex justify-center mt-5">
          <Pagination
            className="custom-pagination"
            current={page}
            total={data?.data?.transactions?.length || 0}
            pageSize={limit}
            onChange={handlePageChange}
            itemRender={itemRender}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportDetailesSingle;
