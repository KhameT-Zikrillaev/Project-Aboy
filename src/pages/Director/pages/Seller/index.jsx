import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, message, List, Tag, Modal } from "antd";
import { FaPencilAlt } from "react-icons/fa";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";
import { toast } from 'react-toastify';
const { TextArea } = Input;

export default function Seller() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({ date: null, comment: "", price: "" });
  const [errors, setErrors] = useState({});
  const [searchParams, setSearchParams] = useState({});

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useFetch(
    "users",
    "users",
    { page: currentPage, limit: 12, role: "seller", name: searchParams.name || "" }
  );

  const { data: debtorsData, refetch: refetchDebtors } = useFetch("debtors", "debtors", {});
  const users = usersData?.data?.users || [];

  const debtsMap = debtorsData?.data?.reduce((acc, debtor) => {
    if (debtor.seller_id && debtor.debts?.length) {
      acc[debtor.seller_id] = debtor.debts;
    }
    return acc;
  }, {}) || {};

  const { mutate, isLoading: isSending } = useApiMutation({
    url: "debtors",
    method: "POST",
    onSuccess: () => {
      message.success("Tovar muvaffaqiyatli qo'shildi!");
      resetForm();
      refetchDebtors();
      setIsModalVisible(false);
    },
    onError: (error) => message.error(`Xatolik: ${error.message || "Tovar qo'shishda xatolik"}`)
  });

  const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation({
    url: "debtors",
    method: "DELETE",
    onSuccess: () => {
      message.success("Qarz muvaffaqiyatli o'chirildi!");
      refetchDebtors();
    },
    onError: (error) => message.error(`Xatolik: ${error.message || "Qarz o'chirishda xatolik"}`)
  });

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleSubmit = () => {
    const { date, comment, price } = form;
    const newErrors = {
      date: !date,
      comment: !comment.trim(),
      price: !price || isNaN(Number(price)),
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true) && selectedUser) {
      mutate({
        sellerId: selectedUser.id,
        debts: [{ deadline: date.toISOString(), price: Number(price), comment }]
      });
    }
  };

  const handleDelete = (id) => deleteMutate({ id });

  const { mutate: sendConfirm, isLoading: isSendingConfirm } = useApiMutation({
    url: "debtors/send-sms",
    method: "POST",
    onSuccess: () => {
      toast.success("Xabar muvaffaqiyatli yuborildi!");
      refetchDebtors();
    },
    onError: (error) => toast.error(`Xatolik: ${error.message || "Tovar qo'shishda xatolik"}`),
  });

  const handleConfirm = (debtId, sellerId) => {
    sendConfirm({ sellerId, debtId });
  };

  const resetForm = () => {
    setForm({ date: null, comment: "", price: "" });
    setSelectedUser(null);
  };

  const calculateTotalDebt = (debts) =>
    debts?.reduce((total, debt) => total + (debt.price || 0), 0) || 0;

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetForm();
  };

  return (
    <div className="DirectorSeller pt-[150px] p-4">
      <SearchForm
        data={users}
        onSearch={(params) => {
          setSearchParams({ name: params.name });
          setCurrentPage(1);
        }}
        title="Sotuvchilar"
        searchFields={["name", "phone"]}
        searchByNameOnly={true}
      />

      {users.length === 0 && !usersLoading && (
        <div className="text-center text-gray-400">Sotuvchilar topilmadi</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: "1fr" }}>
        {users.map((user) => {
          const userDebts = debtsMap[user.id] || [];
          const totalDebt = calculateTotalDebt(userDebts);

          return (
            <div 
              key={user.id} 
              className="bg-gray-800 text-white p-4 rounded-lg transition flex flex-col"
              style={{ minHeight: "100%" }}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-semibold">{user.name}</h4>
                  <p className="text-sm text-gray-300">{user.phone}</p>
                  {userDebts.length > 0 && (
                    <Tag>Hamma qarzi: <span className="text-red-500">{totalDebt}</span> $</Tag>
                  )}
                </div>
                <button
                  onClick={() => showModal(user)}
                  className="flex p-2 bg-gray-700 hover:bg-gray-600 rounded-xl items-center gap-2"
                >
                  <FaPencilAlt />
                  <span>Belgilash</span>
                </button>
              </div>

              <div className="flex-grow overflow-y-auto max-h-40 my-2">
                {userDebts.length > 0 ? (
                  <List
                    dataSource={userDebts}
                    renderItem={(debt) => (
                      <List.Item className="bg-gray-600 mt-2 rounded-lg mb-2">
                        <div className="w-full p-2 gap-2 flex flex-col text-white justify-between">
                          <div className="flex rounded-lg justify-between border border-b-1  border-white/20 p-1 items-center">
                          <span >
                            {debt.price} $
                          </span>
                          <span >
                            {formatDate(debt.deadline)}
                          </span>
                          </div>
                       
                         <div className="flex justify-between items-center gap-2">
                         <span className="p-1 rounded-lg">
                            {debt.comment || "Без комментария"}
                          </span>
                          <span className="text-green-500">{debt?.isSent ? "Ogohlantirildi" : ""}</span>
                         </div>
                      
                          <div className="flex justify-end w-full gap-4">
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleConfirm(debt.id, user.id)}
                              loading={isDeleting}
                            >
                              Eslatnoma Xabar yuborish
                            </Button>

                            <Button
                              type="primary"
                              className="w-32"
                              danger
                              size="small"
                              onClick={() => handleDelete(debt.id)}
                              loading={isDeleting}
                            >
                              O'chirish
                            </Button>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="text-gray-400 text-center">Qarzi yo'q</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно для добавления долга */}
      <Modal
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={isSending}
        okText="Belgilash"
        cancelText="Bekor qilish"
        width={600}
        bodyStyle={{ backgroundColor: '#1F2937', color: 'white' }}
      >
        <div className="text-white p-4 rounded-lg flex flex-col gap-4">
          <div>
            <DatePicker
              value={form.date}
              onChange={(date) => handleFormChange("date", date)}
              className="w-full"
              style={{ backgroundColor: "#374151", color: "white" }}
            />
            {errors.date && <p className="text-red-500">Sanani tanlang!</p>}
          </div>

          <div>
            <Input
              value={form.price}
              onChange={(e) => handleFormChange("price", e.target.value)}
              placeholder="Narx"
              type="number"
              style={{ backgroundColor: "#374151", color: "white" }}
            />
            {errors.price && <p className="text-red-500">Narx yozing!</p>}
          </div>

          <div>
            <TextArea
              value={form.comment}
              onChange={(e) => handleFormChange("comment", e.target.value)}
              placeholder="Komment"
              style={{ backgroundColor: "#374151", color: "white" }}
              rows={4}
            />
            {errors.comment && <p className="text-red-500">Komment yozib keting!</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
}