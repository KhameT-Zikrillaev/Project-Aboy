import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

const useApiMutation = ({ url, method = 'POST', onSuccess, onError, isFormData = false }) => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      if (method === 'DELETE') {
        if (!data?.id) throw new Error('ID required for DELETE request');
        return await api.delete(`${url}/${data.id}`);
      }

      let requestData = data;
      let headers = {};

      if (isFormData) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof File) {
            // Agar qiymat fayl bo'lsa, formData-ga qo‘shamiz
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            // Agar oddiy string, number yoki boolean bo‘lsa, string ko‘rinishida qo‘shamiz
            formData.append(key, String(value));
          }
        });

        requestData = formData;
        headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await api({
        url,
        method,
        data: requestData,
        headers,
      });

      return response.data;
    },
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useApiMutation;
