import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const fetchData = async (url, params = {}) => {
  const { data } = await api.get(url, { params });
  return data;
};


const useFetch = (key, url, params = {}, options = {}) => {
  return useQuery({
    queryKey: [key, JSON.stringify(params)], // params obyektini stabilizatsiya qilamiz
    queryFn: () => fetchData(url, params),
    keepPreviousData: true, // Eski ma'lumotni saqlab turadi
    staleTime: 5000, // 5 sekund davomida ma'lumot eski hisoblanmaydi
    retry: false, // Xatolik bo‘lsa, qayta urinmaydi
    refetchOnWindowFocus: false, // Oynani yangilaganda qayta zapros ketmasin
    ...options,
  });
};

export default useFetch;
