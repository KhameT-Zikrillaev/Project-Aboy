import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, message } from "antd";
import { FaPencilAlt } from "react-icons/fa";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";

const { TextArea } = Input;

export default function Seller() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({ date: false, comment: false, price: false });
  const [filteredData, setFilteredData] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  // Запрос пользователей с пагинацией и фильтрацией
  const { data: usersData, isLoading: usersLoading, refetch } = useFetch(
    'users', 
    'users', 
    {
      page: currentPage,
      limit: pageSize,
      role: 'seller',
      name: searchParams.name || '' // Передаем только имя
    }
  );
   console.log(usersData);
  const users = usersData?.data?.users || [];
  const totalUsers = usersData?.data?.total || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  useEffect(() => {
    if (users.length > 0) {
      setFilteredData(users);
    }
  }, [users]);

  const loadMoreUsers = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const toggleExpand = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  const { mutate, isLoading: isSending } = useApiMutation({
    url: 'debtors',
    method: 'POST',
    onSuccess: () => {
      message.success('Данные успешно отправлены!');
      setExpandedCard(null);
      setSelectedDate(null);
      setComment("");
      setPrice("");
    },
    onError: (error) => {
      message.error(`Ошибка: ${error.message || 'Не удалось отправить данные'}`);
    }
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setErrors((prev) => ({ ...prev, date: false }));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setErrors((prev) => ({ ...prev, comment: false }));
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    setErrors((prev) => ({ ...prev, price: false }));
  };

  const handleMark = (userId) => {
    // Валидация
    if (!selectedDate || !comment.trim() || !price || isNaN(Number(price))) {
      setErrors({
        date: !selectedDate,
        comment: !comment.trim(),
        price: !price || isNaN(Number(price))
      });
      return;
    }
  
    // Формируем payload ТОЧНО как в примере API
    const payload = {
      sellerId: userId,
      debts: [{
        deadline: selectedDate.toISOString(), // просто используйте toISOString() без замены
        price: Number(price),
        comment: comment
      }]
    };
  
    console.log("Отправляемые данные:", JSON.stringify(payload, null, 2));
    mutate(payload);
  };
  const handleSearch = (searchParams) => {
    setSearchParams({ name: searchParams.name });
    setCurrentPage(1);
    refetch(); // Важно вызвать повторный запрос после изменения параметров
  };

  if (usersLoading && currentPage === 1) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="DirectorSeller pt-[150px] p-4">
      <SearchForm
        data={users}
        onSearch={handleSearch}
        name=""
        title="Sotuvchilar"
        showDatePicker={false}
        searchFields={['name', 'phone']}
        searchByNameOnly={true}
      />

      <div className="grid grid-cols-2 gap-4">
        {filteredData.map((user) => (
          <div
            key={user.id}
            className="block bg-gray-800 text-white p-4 rounded-lg transition"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-300">{user.phone}</p>
              </div>
              <button
                onClick={() => toggleExpand(user.id)}
                className="flex border-gray-300 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl items-center cursor-pointer gap-2 text-white hover:text-gray-300 transition"
              >
                {expandedCard === user.id ? (
                  "×"
                ) : (
                  <>
                    <FaPencilAlt className="text-lg" />
                    <span>Belgilash</span>
                  </>
                )}
              </button>
            </div>
            {expandedCard === user.id && (
              <div className="mt-4">
                <DatePicker
                  onChange={handleDateChange}
                  className="w-full mb-2 bg-gray-800 text-white"
                  style={{ backgroundColor: "#1F2937", color: "white" }}
                  required
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mb-2">
                    Пожалуйста, выберите дату!
                  </p>
                )}
                
                <Input
                  type="number"
                  placeholder="Цена"
                  value={price}
                  onChange={handlePriceChange}
                  className="mb-2 bg-gray-800 text-white"
                  style={{ backgroundColor: "#1F2937", color: "white" }}
                  required
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mb-2">
                    Пожалуйста, введите корректную цену!
                  </p>
                )}
                
                <TextArea
                  rows={2}
                  placeholder="Комментарий"
                  value={comment}
                  onChange={handleCommentChange}
                  className="mb-2 bg-gray-800 text-white"
                  style={{ backgroundColor: "#1F2937", color: "white" }}
                  required
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mb-2">
                    Пожалуйста, введите комментарий!
                  </p>
                )}
                <Button
                  type="primary"
                  className="w-full"
                  onClick={() => handleMark(user.shop.id)}
                  style={{
                    backgroundColor: "#364153",
                    borderColor: "#364153",
                    marginTop: "10px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2b3445")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#364153")
                  }
                >
                  Belgilash
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {currentPage < totalPages && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreUsers}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Yana
          </button>
        </div>
      )}
    </div>
  );
}