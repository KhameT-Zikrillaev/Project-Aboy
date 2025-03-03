import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const fetchData = async (url, params = {}) => {
  const { data } = await api.get(url, { params });
  return data;
};

const useFetch = (key, url, params = {}, options = {}) => {
  return useQuery({
    queryKey: [key, params],
    queryFn: () => fetchData(url, params),
    ...options,
  });
};

export default useFetch;