import api from "@/lib/axios";

/** BE trả { paymentUrl, orderId, amount } */
export interface CreatePaymentResponse {
  paymentUrl: string;
  orderId?: number;
  amount?: number;
  url?: string;
  message?: string;
}

export const PaymentAPI = {
  /** BE: GET /api/payment/create_payment/{orderId} trả { paymentUrl, orderId, amount } */
  getPaymentUrl: async (orderId: number): Promise<string> => {
    const res = await api.get<CreatePaymentResponse>(
      `/api/payment/create_payment/${orderId}`
    );
    const data = res.data as CreatePaymentResponse;
    const url = data?.paymentUrl ?? data?.url ?? (data as any)?.data?.paymentUrl;
    if (url) return url;
    throw new Error(data?.message ?? "Không lấy được URL thanh toán");
  },

  /** Xác nhận đã chuyển khoản (dùng khi BE chưa có VNPay redirect) */
  confirmTransfer: (paymentId: number) => {
    return api.patch(`/payments/${paymentId}/confirm`);
  },
};
