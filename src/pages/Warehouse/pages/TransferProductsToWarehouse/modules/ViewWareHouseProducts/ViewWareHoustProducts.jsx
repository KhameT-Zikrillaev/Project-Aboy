import React, { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { Table, Spin, Empty, Tag, Pagination } from "antd";
import SearchForm from "@/components/SearchForm/SearchForm";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function ViewWareHoustProducts({ idwarehouse }) {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const { data, isLoading, refetch } = useFetch(
    "warehouse-products/all-products",
    "warehouse-products/all-products",
    {
      page: currentPage,
      limit: pageSize,
      warehouseId: idwarehouse,
      ...(searchQuery && { article: searchQuery })
    },
    {
      enabled: !!idwarehouse,
    }
  );

  useEffect(() => {
    if (data?.data?.data) {
      setFilteredData(data.data.data);
    } else {
      setFilteredData([]);
    }
  }, [data]);

  const onSearch = (searchParams) => {
    const searchValue = searchParams.article || "";
    setSearchQuery(searchValue);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const itemRender = (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
          <LeftOutlined />
        </button>
      );
    }
    if (type === "next") {
      return (
        <button style={{ color: "white", border: "none", cursor: "pointer" }}>
          <RightOutlined />
        </button>
      );
    }
    return originalElement;
  };

  const columns = [
    {
      title: "№",
      key: "index",
      width: 50,
      render: (_, __, index) => (
        <span className="text-gray-100">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Artikul/Nomi",
      dataIndex: "article",
      key: "article",
      render: (text, record) => (
        <span className="text-gray-100">
          {text || record?.name || 'Без названия'}
        </span>
      ),
    },
    {
      title: "Partiya",
      dataIndex: "batch_number",
      key: "batch_number",
      render: (text) => (
        <Tag color="blue" className="text-gray-100">
          {text || 'N/A'}
        </Tag>
      ),
    },
    {
      title: "Narxi ($)",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-100">{text || 0} $</span>
      ),
    },
    {
      title: "Rulon soni",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => (
        <span className="text-gray-100">{text || 0} ta</span>
      ),
    },
    {
      title: "Rasm",
      dataIndex: "image_url",
      key: "image_url",
      render: (text) => (
        <div 
          className="max-h-[60px] max-w-[60px] cursor-pointer"
          onClick={() => setSelectedImage(text)}
        >
          <img
            className="h-auto w-full object-cover"
            src={text}
            crossOrigin="anonymous"
            alt="product"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'placeholder-image-url';
            }}
          />
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <div className="p-4 w-full">
      <SearchForm
        title="Товарлар"
        showDatePicker={false}
        searchBy="article"
        onSearch={onSearch}
        placeholder="Артикул бўйича қидириш"
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center text-white justify-center h-64">
              <Empty style={{ color: 'white' }} description="Товар топилмади" />
            </div>
          ) : (
            <div className="w-full px-4">
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={false}
                className="custom-table"
                rowClassName={() => "custom-row"}
                bordered
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              />
            </div>
          )}
        </>
      )}

      {!isLoading && data?.data?.total > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data?.data?.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="custom-pagination"
            itemRender={itemRender}
          />
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[80vh] overflow-auto bg-white rounded-lg shadow-xl">
            <img 
              src={selectedImage} 
              crossOrigin='anonymous' 
              alt="Увеличенное изображение" 
              className="w-full h-full" 
            />
          </div>
          <button 
            className="absolute top-3 right-2 bg-white/50 cursor-pointer text-white w-8 h-8 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}