import React from 'react';
import bgsklad from '@/assets/images/bg-sklad.png';
import { useParams, useLocation } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { Spin, Tag, Card, Pagination, Button } from 'antd';
import ImageModal from '@/components/modal/ImageModal';
import userStore from '@/store/useUser';
import { toast } from 'react-toastify';
import useApiMutation from '@/hooks/useApiMutation';
import CashCard from '@/components/cashCard';
import dayjs from 'dayjs';

export default function CashregisterDetailes() {
    // const { name } = useParams();
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const location = useLocation();
    const shopId = location.state?.shopId;
    const itemsPerPage = 10;
    const user = userStore();
    const todayDate = dayjs().format('YYYY-MM-DD');

    const { data: cashRegisterData, isLoading: isCashRegisterLoading, error: cashRegisterError, refetch: refetchCashRegister } = useFetch(
        shopId ? `cash-transaction/shop/${shopId}/date/${todayDate}/status` : null,
        shopId ? `cash-transaction/shop/${shopId}/date/${todayDate}/status` : null,
        {},
        {
            enabled: !!shopId, // Запрос выполнится только если shopId есть
        }
    );

    // Отладочные сообщения

    const filteredData = cashRegisterData?.data?.isActive ? cashRegisterData.data.transactions : [];
    const currentData = Array.isArray(filteredData) ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

    const { mutate, isLoading: isSending } = useApiMutation({
        url: 'cash-transaction/daily-report',
        method: 'POST',
        onSuccess: (data) => {
            toast.success('Kassa muvaffaqiyatli yopildi!');
            refetchCashRegister(); // Обновляем данные после закрытия кассы
        },
        onError: (error) => {
            toast.error(`Xatolik: ${error.message || 'Kassa yopishda xatolik'}`);
            console.error('Xatolik: ', error);
        }
    });

    const handleCloseCash = () => {
        const body = {
            shopId: shopId,
            date: todayDate,
            closedBy: user?.user?.id
        };

        mutate(body, {
            onSuccess: () => {
                setTimeout(() => {
                    refetchCashRegister({ force: true }); // Обновляем данные после закрытия кассы
                }, 2000);
            },
            onError: (error) => {
                toast.error(`Xatolik: ${error.message || 'Kassa yopishda xatolik'}`);
                console.error('Xatolik: ', error);
            }
        });
    };

    return (
        <div className="min-h-screen bg-cover bg-center p-1 relative" style={{ backgroundImage: `url(${bgsklad})` }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-0"></div>
            <div className="relative z-0 max-w-[1440px] mx-auto flex flex-col items-center justify-center mt-[120px]">
                {isCashRegisterLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {!cashRegisterData?.data?.isActive ? (
                            <div className="text-white text-lg">Kassa yopildi</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
                                {currentData?.map((item) => (
                                    <CashCard key={item?.id} transaction={item} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                <ImageModal
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    imageUrl={selectedImage}
                />

                {filteredData?.length > 0 && !isCashRegisterLoading && (
                    <div className="my-4 flex justify-center">
                        <Pagination
                            current={currentPage}
                            total={filteredData.length}
                            pageSize={itemsPerPage}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                            className="custom-pagination"
                        />
                    </div>
                )}

                {filteredData?.length > 0 && !isCashRegisterLoading && (
                    <Button
                        type="primary"
                        style={{ background: "#17212b" }}
                        onClick={handleCloseCash}
                        loading={isSending}
                        disabled={isSending}
                    >
                        Kassa yopish
                    </Button>
                )}
            </div>
        </div>
    );
}