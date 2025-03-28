import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/useFetch'
import { Pagination, Spin } from 'antd';
import RepordCardShop from '@/components/reportCardShop/RepordCardShop';

const ReportDetailesSingle = () => {
    const shopId = sessionStorage.getItem("shopId");
    const {date} = useParams();
    const [page, setPage] = useState(1);
      const limit = 10;

    const { data, isLoading } = useFetch(`cash-register/date/${date}/shop/${shopId}`, `cash-register/date/${date}/shop/${shopId}`)
    
  return (
    <div className='mt-[120px]'>
      {
        isLoading ? (
          <div className="flex justify-center mt-20">
            <Spin size="large" />
          </div>
        ) : data?.data?.transactions?.length ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
            {data?.data?.transactions?.map((report) => (
                <RepordCardShop key={report.id} item={report}></RepordCardShop>
            ))}
            <div className="flex justify-center mt-4 col-span-full">
              <Pagination
                current={page}
                pageSize={limit}
                total={data?.data?.totalTransactions || 0}
                onChange={(page) => setPage(page)}
                className="custom-pagination"
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">Ҳеч нарса йўқ</p>
        )
      }
    </div>
  )
}

export default ReportDetailesSingle