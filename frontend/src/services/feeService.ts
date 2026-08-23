import { apiClient } from './api';
import { FeeRecord, PaymentTransaction } from '../types';

export const feeService = {
  getAll: async (): Promise<FeeRecord[]> => {
    const response = await apiClient.get<FeeRecord[]>('/fees/');
    return response.data;
  },

  getById: async (id: string): Promise<FeeRecord> => {
    const response = await apiClient.get<FeeRecord>(`/fees/${id}/`);
    return response.data;
  },

  recordPayment: async (feeId: string, paymentData: Omit<PaymentTransaction, 'id' | 'receiptNo'>): Promise<{ fee: FeeRecord; transaction: PaymentTransaction }> => {
    const response = await apiClient.post<{ fee: FeeRecord; transaction: PaymentTransaction }>(`/fees/${feeId}/pay/`, paymentData);
    return response.data;
  },
};
