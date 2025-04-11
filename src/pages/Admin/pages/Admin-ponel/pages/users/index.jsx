import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Pagination } from "antd";
import { EditOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Input } from "antd";
import ModalComponent from "@/components/modal/Modal";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import { Select } from "antd";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from "react-toastify";

const { Option } = Select;

const { Search } = Input;

const Statistics = () => {
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storageSingleData, setStorageSingleData] = useState(null);
  const [formType, setFormType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useFetch('users', 'users', { limit, page, name: searchQuery, role: userRole });

  const { mutate: deleteUser } = useApiMutation({
      url: "users", // Asosiy API endpoint
      method: "DELETE",

      onSuccess: () => {
        refetch();
        toast.success("Фойдаланувчи муваффақиятли ўчирилди!");
      },
      onError: (error) => {
        toast.error("Фойдаланувчини ўчиришда хатолик юз берди");
      },
    });
  
    const handleDelete = (id) => {
      deleteUser({ id });
    };

  const handleChange = (value) => {
    setUserRole(value);
  };

  const showModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setStorageSingleData(null);
  };

  const handleEdit = (record) => {
    setStorageSingleData(record);
    showModal("edit");
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
      render: (_, __, index) => <span className="text-gray-100 font-semibold">{(page - 1) * limit + index + 1}</span>,
      width: 70,
    },
    {
      title: "Фойдаланувчи номи",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="text-gray-100 font-semibold">{text}</span>,
    },
    {
      title: "Тельфон рақами",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span className="text-gray-100 font-semibold">{text}</span>,
    },
    {
      title: "Фойдаланувчи роли",
      dataIndex: "role",
      key: "role",
      render: (text) => <span className="text-gray-100 font-semibold">{text}</span>,
    },
    {
      title: "Ҳаракатлар",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="edit-btn"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Ўчиришни тасдиқлайсизми?"
            onConfirm={() => handleDelete(record?.id)}
            okText="Ҳа"
            cancelText="Йўқ"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} className="edit-btn" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="text-3xl font-bold text-gray-100">Фойдаланувчилар</div>
        <div className="flex gap-3 items-center">
          <Search
            placeholder="Қидириш"
            onSearch={onSearch}
            enterButton
            className="custom-search"
          />
          <Select
            value={userRole}
            placeholder="Рол танланг"
            className="custom-select-filter"
            onChange={handleChange}
            dropdownClassName="custom-dropdown"
          >
            <Option value="staff">Омборчи</Option>
            <Option value="seller">Сотувчи</Option>
            <Option value="user">Сотувчи 2</Option>
            <Option value="admin">Админ</Option>
          </Select>
          <Button
            type="primary"
            style={{
              backgroundColor: "#364153",
              color: "#f3f4f6",
              fontWeight: "500",
              padding: "17px 20px",
              borderRadius: "8px",
              fontSize: "20px",
            }}
            className="hover:bg-[#0056b3] hover:border-[#004494] focus:bg-[#004494]"
            onClick={() => showModal("add")}
          >
            Қўшиш
          </Button>
        </div>
      </div>
      <div className="text-gray-100">
        <Table
          columns={columns}
          dataSource={data?.data?.users}
          pagination={false}
          className="custom-table"
          rowClassName={() => "custom-row"}
          loading={isLoading}
          bordered
        />
        <div className="flex justify-center mt-5">
          <Pagination
            className="custom-pagination"
            current={page}
            total={10}
            pageSize={limit}
            onChange={(page) => setPage(page)}
            itemRender={itemRender}
          />
        </div>
      </div>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={onClose}
        title={
          formType === "add" ? "Фойдаланувчи қўшиш" : "Фойдаланувчини таҳрирлаш"
        }
      >
        {formType === "add" ? (
          <AddUser onClose={onClose} refetch={refetch} />
        ) : (
          <EditUser onClose={onClose} refetch={refetch} storageSingleData={storageSingleData} />
        )}
      </ModalComponent>
    </div>
  );
};

export default Statistics;
