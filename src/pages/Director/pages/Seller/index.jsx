import React, { useState, useEffect } from "react";
import { DatePicker, Input, Button, message } from "antd";
import { FaPencilAlt } from "react-icons/fa";
import SearchForm from "@/components/SearchForm/SearchForm";
import useFetch from "@/hooks/useFetch";
import useApiMutation from "@/hooks/useApiMutation";

const { TextArea } = Input;

export default function Seller() {
  const [visibleShops, setVisibleShops] = useState(12);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({ date: false, comment: false });
  const [filteredData, setFilteredData] = useState([]); // Исходные данные
  const [filteredBySearch, setFilteredBySearch] = useState([]); // Отфильтрованные данные

  const { data, isLoading, refetch } = useFetch('shop', 'shop', {});
  const shops = data?.data?.shops || [];

  // Инициализация данных при загрузке
  useEffect(() => {
    if (shops.length > 0) {
      setFilteredData(shops);
      setFilteredBySearch(shops); // Изначально отображаем все магазины
    }
  }, [shops]);

  const loadMoreShops = () => {
    setVisibleShops((prevVisibleShops) => prevVisibleShops + 12);
  };

  const toggleExpand = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  const { mutate, isLoading: isSending } = useApiMutation({
    url: 'Storefront-product',
    method: 'PATCH',
    onSuccess: () => {
      message.success('Данные успешно отправлены!');
      setExpandedCard(null);
      setSelectedDate(null);
      setComment("");
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

  const handleMark = (shopId) => {
    let hasError = false;
    const newErrors = { date: false, comment: false };

    if (!selectedDate) {
      newErrors.date = true;
      hasError = true;
    }
    if (!comment.trim()) {
      newErrors.comment = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const payload = {
      shopID: shopId,
      description: comment,
      date: selectedDate.format("YYYY-MM-DD")
    };

    mutate(payload);
  };

  // Обработчик поиска
  const handleSearch = (searchResults) => {
    setFilteredBySearch(searchResults);
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="DirectorSeller pt-[150px] p-4">
      {/* Передаем исходные данные и функцию для обработки поиска */}
      <SearchForm
        data={filteredData}
        onSearch={handleSearch}
        name=""
        title="Sotuvchilar"
        showDatePicker={false} // Отключаем DatePicker
      />

      <div className="grid grid-cols-2 gap-4">
        {filteredBySearch.slice(0, visibleShops).map((shop) => (
          <div
            key={shop.id}
            className="block bg-gray-800 text-white p-4 rounded-lg transition"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">{shop.name}</h4>
                <p className="text-sm text-gray-300">{shop.warehouseName}</p>
              </div>
              <button
                onClick={() => toggleExpand(shop.id)}
                className="flex border-gray-300 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl items-center cursor-pointer gap-2 text-white hover:text-gray-300 transition"
              >
                {expandedCard === shop.id ? (
                  "×"
                ) : (
                  <>
                    <FaPencilAlt className="text-lg" />
                    <span>Belgilash</span>
                  </>
                )}
              </button>
            </div>
            {expandedCard === shop.id && (
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
                  onClick={() => handleMark(shop.id)}
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
      {visibleShops < filteredBySearch.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreShops}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Yana
          </button>
        </div>
      )}
    </div>
  );
}