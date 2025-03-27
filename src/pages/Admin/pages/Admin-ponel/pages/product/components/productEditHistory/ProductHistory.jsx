import React, { useState } from "react";
import { Table, Pagination } from "antd";
import {
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import useFetch from "@/hooks/useFetch";
import { GrFormPreviousLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
const { Search } = Input;

const ProductHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading  } = useFetch("products/history", "products/history", {page, limit, article: searchQuery} );

  const handlePageChange = (page) => {
    setPage(page);
    refetch();
  };

  const onSearch = (value) => setSearchQuery(value);  

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
      title: "Artikul",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.action == "DELETE" ? text?.oldData?.article : text?.newData?.article}</span>
      ),
    },
    {
      title: "Partiya",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.action == "DELETE" ? text?.oldData?.batch_number : text?.newData?.batch_number}</span>
      ),
    },
    {
      title: "Rulon soni",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.action == "DELETE" ? "-" : text?.newData?.quantity}</span>
      ),
    },
    {
      title: "Narxi",
      render: (text) => (
        <span className="text-gray-100 font-semibold">{text?.action == "DELETE" ? text?.oldData?.price : text?.newData?.price}</span>
      ),
    },
    {
      title: "Rasm",
      render: (text) => (
        <div className="max-h-[80px] max-w-[80px]">
          <img className="h-auto w-full" src={`${text?.action == "DELETE" ? text?.oldData?.image_url : text?.newData?.image_url}`} crossOrigin="anonymous" />
        </div>
      ),
    },
    {
        title: "Izoh",
        render: (text) => (
            <span className="text-gray-100 font-semibold">{text?.action == "DELETE" ? "Mahsulot o'chirildi" : text?.action == "CREATE" ? "Mahsulot yaratildi" : text?.newData?.comment}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "action",
        key: "action",
        render: (text) => (
            <span className="text-gray-100 font-semibold">{text === "DELETE" ? "O'chirildi" : text === "CREATE" ? "Yaratildi" : "Tahrirlandi"}</span>
        ),
      },
  ];



  return (
    <div className="p-5">
      <div onClick={() => navigate(-1)} className="flex text-gray-100 mb-5 text-[20px] cursor-pointer font-semibold"><GrFormPreviousLink  className="text-[25px]"/> Orqaga </div>
      <div className="flex justify-between items-center mb-5">
        <div className="text-3xl font-bold  text-gray-100">Tahrirlangan mahsulotlar</div>
        <div className="flex gap-3 items-center">
          <Search
            placeholder="Qidirish"
            onSearch={onSearch}
            enterButton
            className="custom-search"
          />
        </div>
      </div>
      <div className="text-gray-100">
        <Table
          columns={columns}
          dataSource={data?.data}
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
            total={data?.data?.length}
            pageSize={limit}
            onChange={handlePageChange}
            itemRender={itemRender}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductHistory;
