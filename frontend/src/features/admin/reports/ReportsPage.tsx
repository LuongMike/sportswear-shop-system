import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { OrderAPI, type Order } from "@/services/orderApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatCurrency";
import { MOCK_ADMIN_ORDERS } from "@/data/mockAdminOrders";

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    // keep digits, dot, comma, minus
    const cleaned = value.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getOrderDayKey(orderDate: string): string {
  const d = new Date(orderDate);
  if (Number.isNaN(d.getTime())) return "invalid";
  return dayKey(d);
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "Chờ xử lý";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPING":
      return "Đang giao";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status || "N/A";
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "SHIPPING":
      return "bg-purple-100 text-purple-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function ReportsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-reports", "orders"],
    queryFn: () => OrderAPI.getOrders(1, 500),
    retry: 1,
  });

  // Nếu API lỗi -> dùng dữ liệu mock; nếu thành công -> dùng dữ liệu thật
  const hasApiData = !!data && Array.isArray((data as any).orders);
  const orders: Order[] = hasApiData ? (data as any).orders : MOCK_ADMIN_ORDERS;

  const computed = useMemo(() => {
    const totalOrders = orders.length;

    let grossValue = 0;
    let completedRevenue = 0;
    const statusCounts = new Map<string, number>();

    const productAgg = new Map<
      string,
      { productName: string; qty: number; sales: number }
    >();

    for (const o of orders) {
      const orderValue = toNumber(o.totalFinalAmount);
      grossValue += orderValue;

      const s = o.status || "UNKNOWN";
      statusCounts.set(s, (statusCounts.get(s) ?? 0) + 1);

      if (s === "COMPLETED") {
        completedRevenue += orderValue;
      }

      for (const item of o.items ?? []) {
        const name = item.productName || "N/A";
        const qty = Number(item.quantity) || 0;
        const price = toNumber(item.price);
        const sales = qty * price;

        const current = productAgg.get(name) ?? {
          productName: name,
          qty: 0,
          sales: 0,
        };
        current.qty += qty;
        current.sales += sales;
        productAgg.set(name, current);
      }
    }

    const averageOrderValue = totalOrders > 0 ? grossValue / totalOrders : 0;

    const topProducts = Array.from(productAgg.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - idx));
      return d;
    });

    const revenueByDay = new Map<string, number>();
    for (const o of orders) {
      if (o.status !== "COMPLETED") continue;
      const k = getOrderDayKey(o.orderDate);
      revenueByDay.set(k, (revenueByDay.get(k) ?? 0) + toNumber(o.totalFinalAmount));
    }

    const chart = last7Days.map((d) => {
      const k = dayKey(d);
      return { key: k, label: formatDayLabel(d), value: revenueByDay.get(k) ?? 0 };
    });
    const chartMax = Math.max(0, ...chart.map((c) => c.value));

    const statusRows = Array.from(statusCounts.entries())
      .map(([status, count]) => ({
        status,
        label: getStatusLabel(status),
        count,
        percent: totalOrders > 0 ? (count / totalOrders) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalOrders,
      grossValue,
      completedRevenue,
      averageOrderValue,
      topProducts,
      chart,
      chartMax,
      statusRows,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Đang tải báo cáo...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 w-full max-w-none">
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Báo cáo thống kê</h2>
          <p className="text-sm text-muted-foreground">
            Tổng hợp nhanh theo đơn hàng (tối đa 500 đơn gần nhất).
          </p>
        </div>
        {isError && (
          <Badge variant="outline" className="text-xs px-3 py-1 border-dashed">
            Đang hiển thị dữ liệu demo (API lỗi)
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Doanh thu (Hoàn tất)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(computed.completedRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Tổng giá trị đơn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(computed.grossValue)}
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{computed.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Giá trị TB/đơn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(computed.averageOrderValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Doanh thu 7 ngày gần nhất</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tính theo các đơn có trạng thái <span className="font-medium">COMPLETED</span>.
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-44 flex items-end gap-2">
              {computed.chart.map((c) => {
                const pct =
                  computed.chartMax > 0 ? Math.round((c.value / computed.chartMax) * 100) : 0;
                return (
                  <div key={c.key} className="flex-1 min-w-0">
                    <div className="h-36 flex items-end">
                      <div
                        className="w-full rounded-md bg-blue-600/80 hover:bg-blue-600 transition-colors"
                        style={{ height: `${Math.max(4, pct)}%` }}
                        title={`${c.label}: ${formatCurrency(c.value)}`}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground text-center truncate">
                      {c.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 space-y-3">
            {computed.statusRows.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có dữ liệu.</div>
            ) : (
              computed.statusRows.map((row) => (
                <div key={row.status} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge className={getStatusBadgeClass(row.status)}>
                        {row.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground truncate">
                        {row.count} đơn
                      </span>
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {Math.round(row.percent)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top sản phẩm bán chạy</CardTitle>
            <p className="text-sm text-muted-foreground">
              Theo tổng số lượng trong các đơn đã lấy được.
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            {computed.topProducts.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có dữ liệu.</div>
            ) : (
              <div className="overflow-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950">
                    <tr className="text-left">
                      <th className="p-3 font-medium">Sản phẩm</th>
                      <th className="p-3 font-medium text-right">SL</th>
                      <th className="p-3 font-medium text-right">Doanh số</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computed.topProducts.slice(0, 5).map((p) => (
                      <tr key={p.productName} className="border-t">
                        <td className="p-3">{p.productName}</td>
                        <td className="p-3 text-right tabular-nums">{p.qty}</td>
                        <td className="p-3 text-right tabular-nums">
                          {formatCurrency(p.sales)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {orders.length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có dữ liệu.</div>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <div
                    key={o.orderId}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">#{o.orderCode}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.orderDate).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-none">
                      <Badge className={getStatusBadgeClass(o.status)}>
                        {getStatusLabel(o.status)}
                      </Badge>
                      <div className="text-sm font-semibold tabular-nums">
                        {formatCurrency(toNumber(o.totalFinalAmount))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
