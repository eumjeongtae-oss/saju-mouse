import { apiClient } from './client';
import type { ApiResponse, SajuReading, SajuReadingRequest } from '@/types/api';

export const sajuApi = {
  getReading: (params: SajuReadingRequest) =>
    apiClient.post<ApiResponse<SajuReading>>('/saju/reading', params),
};
