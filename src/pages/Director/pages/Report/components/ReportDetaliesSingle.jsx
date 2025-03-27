import React, { useState } from "react";
import { Pagination, Spin, Empty } from "antd";
import { useLocation } from "react-router-dom";
import bgsklad from "@/assets/images/bg-sklad.png";
import SearchFormStartEnd from "@/components/SearchFormStartEnd/SearchFormStartEnd";
import useFetch from "@/hooks/useFetch";
import useUserStore from "@/store/useUser";
import ReportCard from "@/components/reportCard";

export default function ReportDetaliesSingle() {
  const [selectedDates, setSelectedDates] = useState({ from: null, to: null });
  const [page, setPage] = useState(1);
  const limit = 9; // или динамическое значение как у вас было
  
  const location = useLocation();
  const shopId = location.state?.shopId;
  const { user } = useUserStore();

  const startDate = selectedDates?.from;
  const endDate = selectedDates?.to;
  const isFetchEnabled = !!(shopId && startDate && endDate);

  const { data, isLoading } = useFetch(
    `/cash-register/date-range/shop/${shopId}`,
    `/cash-register/date-range/shop/${shopId}`,
    { startDate, endDate, page, limit },
    { enabled: isFetchEnabled }
  );
  console.log(data)
  const handleDateSearch = (from, to) => {
    setSelectedDates({ from, to });
    setPage(1);
  };

  // Функция для динамического изменения количества элементов на странице
  const updateItemsPerPage = () => {
    return window.innerWidth < 768 ? 4 : 9;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-1 relative"
      style={{ backgroundImage: `url(${bgsklad})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>

      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[110px]">
  
        <SearchFormStartEnd 
          title="Hisobotlar omborlar" 
          showDatePicker={true} 
          onSearch={handleDateSearch}
        />
        
        {!startDate || !endDate ? (
          <p className="text-center text-white text-[20px] pt-14">
            Iltimos, sanani tanlang
          </p>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64 w-full">
            <Spin size="large" />
          </div>
        ) : data?.data?.length ? (
          <>
            <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full px-4">
              {data.data.map((item) => (
                <ReportCard key={item.id} item={item} />
              ))}
            </div>

            {data.total > limit && (
              <div className="my-0 mb-12 md:mb-2 flex justify-center">
                <Pagination
                  current={page}
                  total={data.total}
                  pageSize={limit}
                  onChange={(page) => setPage(page)}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            )}
          </>
        ) : (
          <Empty 
            description={<span className="text-white">Ma'lumot topilmadi</span>} 
            className="my-12"
          />
        )}
      </div>
    </div>
  );
}