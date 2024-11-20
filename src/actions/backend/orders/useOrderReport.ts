// hooks/useOrderReport.ts
import { useQuery } from "@tanstack/react-query";

interface OrderDetail {
  orderId: string;
  customerName: string;
  shippingCost: number;
  totalAmount: number;
  netTotal: number;
  status: string;
  createdAt: string;
  payment: {
    amount: number;
  };
}

interface Summary {
  totalOrders: number;
  totalShippingCost: number;
  totalAmount: number;
  totalNetAmount: number;
  totalPaymentAmount: number;
}

interface DailyReport {
  date: string;
  orders: OrderDetail[];
  summary: Summary;
}

interface ReportResponse {
  dailyReports: DailyReport[];
  summary: Summary;
  dateRange: {
    start: string;
    end: string;
  };
}

const useOrderReport = (startDate: Date | null, endDate: Date | null) => {
  return useQuery({
    queryKey: ['orderReport', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const url = `${baseUrl}/api/orders/report?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const data: ReportResponse = await response.json();


        return data;
      } catch (error) {
        console.error('Report fetch error:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch report');
      }
    },
    enabled: Boolean(startDate) && Boolean(endDate),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

export type { ReportResponse, DailyReport, OrderDetail, Summary };
export default useOrderReport;
