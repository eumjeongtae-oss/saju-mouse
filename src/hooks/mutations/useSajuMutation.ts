import { useMutation } from '@tanstack/react-query';
import { sajuApi } from '@/api/saju';
import type { SajuReadingRequest } from '@/types/api';

export function useSajuMutation() {
  return useMutation({
    mutationFn: (params: SajuReadingRequest) =>
      sajuApi.getReading(params).then((res) => res.data.data),
  });
}
