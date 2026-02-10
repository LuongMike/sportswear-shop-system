import api from "@/lib/axios";

export const PaymentAPI = {
  confirmTransfer(paymentId: number) {
    return api.patch(`/payments/${paymentId}/confirm`);
  },
};
