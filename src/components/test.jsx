import React from 'react'

export default function test() {
  return (
    <div>test</div>
  )
}
// import React, { useState, useEffect } from "react";
// import { DatePicker, Input, Button, message, List, Tag} from "antd";
// import { FaPencilAlt } from "react-icons/fa";
// import SearchForm from "@/components/SearchForm/SearchForm";
// import useFetch from "@/hooks/useFetch";
// import useApiMutation from "@/hooks/useApiMutation";

// const { TextArea } = Input;

// export default function Seller() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(12);
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [comment, setComment] = useState("");
//   const [price, setPrice] = useState("");
//   const [errors, setErrors] = useState({ date: false, comment: false, price: false });
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchParams, setSearchParams] = useState({});
//   const [searchValue, setSearchValue] = useState(""); // Добавлено состояние для значения поиска
//   const [showNotFound, setShowNotFound] = useState(false); // Добавляем состояние для отображени
//   const [deleteId, setDeleteId] = useState(null);
//   // Запрос пользователей с пагинацией и фильтрацией
//   const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useFetch(
//     'users', 
//     'users', 
//     {
//       page: currentPage,
//       limit: pageSize,
//       role: 'seller',
//       name: searchParams.name || ''
//     }
//   );

//   const { data: debtorsData, isLoading: debtorsLoading, refetch: refetchDebtors } = useFetch('debtors', 'debtors', {});
  
//   const users = usersData?.data?.users || [];
//   const totalUsers = usersData?.data?.total || 0;
//   const totalPages = Math.ceil(totalUsers / pageSize);

//   // Создаем карту долгов по seller_id
//   const [debtsMap, setDebtsMap] = useState({});
  
//   useEffect(() => {
//     if (debtorsData) {
//       const map = {};
//       debtorsData.forEach(debtor => {
//         if (debtor.seller_id && debtor.debts?.length > 0) {
//           map[debtor.seller_id] = debtor.debts;
//         }
//       });
//       setDebtsMap(map);
//     }
//   }, [debtorsData]);

//   useEffect(() => {
//     if (users.length > 0) {
//       setFilteredData(users);
//     }
//   }, [users]);

//   const loadMoreUsers = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(prev => prev + 1);
//     }
//   };

//   const toggleExpand = (id) => {
//     if (expandedCard === id) {
//       setExpandedCard(null);
//     } else {
//       setExpandedCard(id);
//     }
//   };
//   useEffect(() => {
//     if (users.length > 0) {
//       setFilteredData(users);
//       setShowNotFound(false); // Скрываем сообщение, если пользователи найдены
//     } else {
//       setFilteredData([]);
//       setShowNotFound(true); // Показываем сообщение, если ничего не найдено
//     }
//   }, [users]);

//   const { mutate, isLoading: isSending } = useApiMutation({
//     url: 'debtors',
//     method: 'POST',
//     onSuccess: () => {
//       message.success('Данные успешно отправлены!');
//       setExpandedCard(null);
//       setSelectedDate(null);
//       setComment("");
//       setPrice("");
//       refetchDebtors(); // Обновляем список долгов после добавления
//     },
//     onError: (error) => {
//       message.error(Ошибка: ${error.message || 'Не удалось отправить данные'});
//     }
//   });

//   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~для удалить~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`


//   const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation({
//     url: debtors, // Используем deleteId из state
//     method: 'DELETE',
//     onSuccess: () => {
//       message.success('Долг успешно удален!');
//       refetchDebtors(); // Перезагружаем список долгов
//       setDeleteId(null); // Очищаем state после успешного удаления
//     },
//     onError: (error) => {
//       message.error(Ошибка: ${error.message || 'Не удалось удалить'});
//       setDeleteId(null);
//     },
//   });

//   const handleDelete = (id) => {
//       deleteMutate({id} ); // Отправляем запрос через 1 секунду
//   };

//   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setErrors((prev) => ({ ...prev, date: false }));
//   };

//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//     setErrors((prev) => ({ ...prev, comment: false }));
//   };

//   const handlePriceChange = (e) => {
//     setPrice(e.target.value);
//     setErrors((prev) => ({ ...prev, price: false }));
//   };

//   const handleMark = (userId) => {
//     if (!selectedDate || !comment.trim() || !price || isNaN(Number(price))) {
//       setErrors({
//         date: !selectedDate,
//         comment: !comment.trim(),
//         price: !price || isNaN(Number(price))
//       });
//       return;
//     }
  
//     const payload = {
//       sellerId: userId,
//       debts: [{
//         deadline: selectedDate.toISOString(),
//         price: Number(price),
//         comment: comment
//       }]
//     };
  
//     mutate(payload);
//   };

//   const handleSearch = (searchParams) => {
  
//     setSearchParams({ name: searchParams.name });
//     setSearchValue(searchParams.name); // Сохраняем значение поиска
//     setCurrentPage(1);
   
//   };

//   // Функция для подсчета общей суммы долга
//   const calculateTotalDebt = (debts) => {
//     return debts?.reduce((total, debt) => total + (debt.price || 0), 0) || 0;
//   };

//   // Форматирование даты
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   if (usersLoading && currentPage === 1) {
//     return <div>Загрузка...</div>;
//   }


//   return (
//     <div className="DirectorSeller pt-[150px] p-4">
//       <SearchForm
//         data={users}
//         onSearch={handleSearch}
//         name="" // Передаем текущее значение поиска
//         title="Sotuvchilar"
//         showDatePicker={false}
//         searchFields={['name', 'phone']}
//         searchByNameOnly={true}
//       />
// {showNotFound && !usersLoading && (
//   <div className="text-center text-gray-400">Пользователь не найден</div>
// )}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {filteredData.map((user) => {
//           const userDebts = debtsMap[user.id] || [];
//           const totalDebt = calculateTotalDebt(userDebts);

//           return (
//             <div
//               key={user.id}
//               className="block bg-gray-800 text-white p-4 rounded-lg transition"
//             >
//               <div className="flex flex-col sm:flex-row justify-between items-center">
//                 <div>
//                   <h4 className="text-lg font-semibold">{user.name}</h4>
//                   <p className="text-sm text-gray-300">{user.phone}</p>
//                   {userDebts.length > 0 && (
//                     <Tag color="red" className="mt-1">
//                       Общий долг: {totalDebt}
//                     </Tag>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => toggleExpand(user.id)}
//                   className="flex border-gray-300 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl items-center cursor-pointer gap-2 text-white hover:text-gray-300 transition"
//                 >
//                   {expandedCard === user.id ? (
//                     "×"
//                   ) : (
//                     <>
//                       <FaPencilAlt className="text-lg" />
//                       <span>Belgilash</span>
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Список долгов пользователя */}
//               {userDebts.length > 0 && (
//   <div className="mt-4 border-t border-gray-300 pt-4">
//     <h5 className="text-base font-semibold text-gray-800 mb-3">Долги:</h5>
//     <List
//       size="small"
//       dataSource={userDebts}
//       renderItem={(debt) => (
//         <List.Item className="py-2 px-3 rounded-lg bg-gray-600 hover:bg-gray-100 transition mb-2">
//           <div className="w-full flex flex-col">
//             <div className="flex justify-between items-center mb-1">
//               <span className="text-sm font-medium text-white">
//                 {debt.comment || "Без комментария"}
//               </span>
//               <span className="text-sm font-semibold text-white">
//                 {debt.price}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-xs text-white">
//                 До: {formatDate(debt.deadline)}
//               </span>
//               <Button 
//                 type="primary" 
//                 danger
//                 size="small"
//                 className="ml-2"
//                 onClick={() => handleDelete(debt.id)}
//               >
//                 O'chirish
//               </Button>
//             </div>
//           </div>
//         </List.Item>
//       )}
//     />
//   </div>
// )}

//               {expandedCard === user.id && (
//                 <div className="mt-4">
//                   <DatePicker
//                     onChange={handleDateChange}
//                     className="w-full mb-2 bg-gray-800 text-white"
//                     style={{ backgroundColor: "#1F2937", color: "white" }}
//                     required
//                   />
//                   {errors.date && (
//                     <p className="text-red-500 text-sm mb-2">
//                       Пожалуйста, выберите дату!
//                     </p>
//                   )}
                  
//                   <Input
//                     type="number"
//                     placeholder="Цена"
//                     value={price}
//                     onChange={handlePriceChange}
//                     className="mb-2 bg-gray-800 text-white"
//                     style={{ backgroundColor: "#1F2937", color: "white" }}
//                     required
//                   />
//                   {errors.price && (
//                     <p className="text-red-500 text-sm mb-2">
//                       Пожалуйста, введите корректную цену!
//                     </p>
//                   )}
                  
//                   <TextArea
//                     rows={2}
//                     placeholder="Комментарий"
//                     value={comment}
//                     onChange={handleCommentChange}
//                     className="mb-2 bg-gray-800 text-white"
//                     style={{ backgroundColor: "#1F2937", color: "white" }}
//                     required
//                   />
//                   {errors.comment && (
//                     <p className="text-red-500 text-sm mb-2">
//                       Пожалуйста, введите комментарий!
//                     </p>
//                   )}
//                   <Button
//                     type="primary"
//                     className="w-full"
//                     onClick={() => handleMark(user.id)}
//                     style={{
//                       backgroundColor: "#364153",
//                       borderColor: "#364153",
//                       marginTop: "10px",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#2b3445")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.backgroundColor = "#364153")
//                     }
//                     loading={isSending}
//                   >
//                     Belgilash
//                   </Button>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       {currentPage < totalPages && (
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={loadMoreUsers}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//           >
//             Yana
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }