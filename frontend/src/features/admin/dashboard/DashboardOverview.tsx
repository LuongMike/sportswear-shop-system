import { Card } from "@/components/ui/card";

export function DashboardOverview() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 space-y-2">
          <span className="text-sm font-medium text-muted-foreground">
            Tổng doanh thu
          </span>
          <div className="text-2xl font-bold">45.231.000₫</div>
        </Card>
        <Card className="p-6 space-y-2">
          <span className="text-sm font-medium text-muted-foreground">
            Đơn hàng mới
          </span>
          <div className="text-2xl font-bold">+12</div>
        </Card>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-96 flex items-center justify-center text-muted-foreground">
        Khu vực hiển thị biểu đồ doanh thu
      </div>
    </div>
  );
}
