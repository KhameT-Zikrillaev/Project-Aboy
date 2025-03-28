import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SearchFormStartEnd from "@/components/SearchFormStartEnd/SearchFormStartEnd";
import { Pagination, Spin } from "antd";
import useFetch from "@/hooks/useFetch";
import WarehouseSendShopReportCard from "@/components/warehousesendShopReport";

const ReportDetailes = () => {
  const [selectedDates, setSelectedDates] = useState({ from: null, to: null });
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { name } = useParams();
  const shopId = sessionStorage.getItem("shopId"); 

  const startDate = selectedDates?.from;
  const endDate = selectedDates?.to;
  const isFetchEnabled = !!(shopId && startDate && endDate);

  const { data, isLoading } = useFetch(
    `cash-register/date-range/shop/${shopId}`,
    `cash-register/date-range/shop/${shopId}`,
    { startDate, endDate, page, limit },
    { enabled: isFetchEnabled }
  );

  const handleDateSearch = (from, to) => {
    setSelectedDates({ from, to });
    setPage(1);
  };

  return (
    <div className="mt-[120px] px-2">
       <div className="relative max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[110px]">
      <SearchFormStartEnd
        title={`${name} ҳисоботлари`}
        onSearch={handleDateSearch}
      />

      {!startDate || !endDate ? (
        <p className="text-center text-gray-500 text-[20px] pt-14">
          Илтимос, санани танланг
        </p>
      ) : isLoading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : data?.data[0].length ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data[0].map((report, index) => (
            <Link key={index} to={`/warehouse/report-seller-send/${name}/${report?.date}`}>
              <WarehouseSendShopReportCard  report={report} />
            </Link>
          ))}
          <div className="flex justify-center mt-4 col-span-full">
            <Pagination
              current={page}
              pageSize={limit}
              total={data?.data[1] || 0}
              onChange={(page) => setPage(page)}
              className="custom-pagination"
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">Ҳеч нарса йўқ</p>
      )}
    </div>
    </div>
  );
};

export default ReportDetailes;
