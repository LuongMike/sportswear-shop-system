import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PaymentAPI } from "@/services/payment.api";
import { updateLatestOrder } from "@/utils/orderStorage";

export default function PaymentPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const confirmMutation = useMutation({
    mutationFn: () => PaymentAPI.confirmTransfer(Number(paymentId)),
    onSuccess: () => {
      toast.success("Đã gửi xác nhận chuyển khoản");
      navigate("/account/orders");
    },
    onError: () => {
      updateLatestOrder({
        status: "PENDING",
      });

      toast.info("Đang dùng dữ liệu demo (chuyển khoản)");
      navigate("/account/orders");
    },
  });

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Thanh toán chuyển khoản</h1>

      <div className="text-sm space-y-1 mb-4">
        <p>
          <b>Ngân hàng:</b> Vietcombank
        </p>
        <p>
          <b>STK:</b> 0123 456 789
        </p>
        <p>
          <b>Chủ TK:</b> NGUYEN VAN A
        </p>
        <p className="text-red-500">Nội dung: PAY-{paymentId}</p>
      </div>

      <div className="mb-4">
        <img src="/qr-bank.png" alt="QR" className="mx-auto w-48" />
      </div>

      <Button
        className="w-full"
        onClick={() => confirmMutation.mutate()}
        disabled={confirmMutation.isPending}
      >
        Tôi đã chuyển khoản
      </Button>
    </div>
  );
}
