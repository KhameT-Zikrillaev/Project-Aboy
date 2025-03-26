import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, message, List, Tag } from "antd";
import { FaPencilAlt } from "react-icons/fa";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";

const { TextArea } = Input;

export default function Seller() {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState(null);
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
  const totalPages = Math.ceil((usersData?.data?.total || 0) / 12);

  // Карта долгов
  const debtsMap = debtorsData?.reduce((acc, debtor) => {
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

  // ✅ Упрощение обработки формы
  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  const handleSubmit = (userId) => {
    const { date, comment, price } = form;
    const newErrors = {
      date: !date,
      comment: !comment.trim(),
      price: !price || isNaN(Number(price)),
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      mutate({
        sellerId: userId,
        debts: [{ deadline: date.toISOString(), price: Number(price), comment }]
      });
    }
  };

  const handleDelete = (id) => deleteMutate({ id });

  const resetForm = () => {
    setForm({ date: null, comment: "", price: "" });
    setExpandedCard(null);
  };

  const calculateTotalDebt = (debts) =>
    debts?.reduce((total, debt) => total + (debt.price || 0), 0) || 0;

  const formatDate = (date) => new Date(date).toLocaleDateString();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => {
          const userDebts = debtsMap[user.id] || [];
          const totalDebt = calculateTotalDebt(userDebts);

          return (
            <div key={user.id} className="bg-gray-800 text-white p-4 rounded-lg transition">
              <div className="flex justify-between  items-center">
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-semibold">{user.name}</h4>
                  <p className="text-sm text-gray-300">{user.phone}</p>
                  {userDebts.length > 0 && (
                    <Tag >Obshiy qarzi: <span className="text-red-500">{totalDebt}</span> so'm</Tag>
                  )}
                </div>
                <button
                  onClick={() => setExpandedCard(expandedCard === user.id ? null : user.id)}
                  className="flex p-2 bg-gray-700 hover:bg-gray-600 rounded-xl items-center gap-2"
                >
                  {expandedCard === user.id ? "×" : <FaPencilAlt />}
                  <span>Belgilash</span>
                </button>
              </div>

              {/* Список долгов */}
              {userDebts.length > 0 && (
                <List
                  dataSource={userDebts}
                  renderItem={(debt) => (
                    <List.Item className="bg-gray-600 mt-2 rounded-lg mb-2">
                      <div className="w-full  p-2 gap-2 flex flex-col text-white justify-between">
                        <span className="border border-b-1 p-1 rounded-lg border-white/20">{debt.price} so'm</span>
                        <span className="border border-b-1 p-1 rounded-lg border-white/20">{debt.comment || "Без комментария"}</span>             
                        <Button
                          type="primary"
                          className="w-32 ml-auto"
                          danger
                          size="small"
                          onClick={() => handleDelete(debt.id)}
                          loading={isDeleting}
                        >
                          O'chirish
                        </Button>
                      </div>
                    </List.Item>
                  )}
                />
              )}

              {/* Форма добавления долга */}
              {expandedCard === user.id && (
                <div className="mt-4 text-white p-4 rounded-lg flex flex-col gap-1">
                  <DatePicker
                    value={form.date}
                    onChange={(date) => handleFormChange("date", date)}
                    className="w-full mb-2"
                    style={{ backgroundColor: "#1F2937", color: "white" }}
                  />
                  {errors.date && <p className="text-red-500">Sanani tanlang!</p>}

                  <Input
                    value={form.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    className="mb-2"
                    placeholder="Цена"
                    type="number"
                    style={{ backgroundColor: "#1F2937", color: "white" }}
                  />
                  {errors.price && <p className="text-red-500">Narx yozing!</p>}

                  <TextArea
                    value={form.comment}
                    onChange={(e) => handleFormChange("comment", e.target.value)}
                    className="mb-2"
                    placeholder="Комментарий"
                    style={{ backgroundColor: "#1F2937", color: "white" }}
                  />
                  {errors.comment && <p className="text-red-500">Komment yozib keting!</p>}

                  <Button
                    type="primary"
                    onClick={() => handleSubmit(user.id)}
                    loading={isSending}
                    style={{ backgroundColor: "#4A5C6F", color: "white" }}
                  >
                    Belgilash
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
