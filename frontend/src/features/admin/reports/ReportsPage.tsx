import { useQuery } from "@tanstack/react-query";
import { TrendingUp, ShoppingCart, Users, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import api from "@/lib/axios";

function formatStartDateInput(date: Date) {
  // yyyy-MM-ddT00:00:00
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T00:00:00`;
}

function formatEndDateInput(date: Date) {
  // yyyy-MM-ddT23:59:59
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T23:59:59`;
}
// Định nghĩa kiểu dữ liệu trả về từ API
interface DashboardReport {
  totalRevenue: number;
  totalOrders: number;
  newUsers: number;
  pendingOrders: number;
}

export function ReportsPage() {

  function getAccessToken() {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return null;
    try {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.accessToken || null;
    } catch {
      return null;
    }
  }
  // State ngày
  const today = new Date();
  const [startDate, setStartDate] = React.useState(formatStartDateInput(today));
  const [endDate, setEndDate] = React.useState(formatEndDateInput(today));

  const { data, isError, refetch, isFetching } =
    useQuery<DashboardReport>({
      queryKey: ["admin-reports-simple", startDate, endDate],
      queryFn: async () => {
        const params = new URLSearchParams({
          startDate: startDate,
          endDate: endDate,
        });

        const bearToken = getAccessToken();

        const res = await api.get(`/api/admin/reports/dashboard?${params}`, {
          headers: {
            Authorization: `Bearer ${bearToken}`,
          },
        });
        console.log(res);
        
        if (res.status !== 200) throw new Error("API error");

        return res?.data;
      },
      retry: 1,
    });

  const totalRevenue = data?.totalRevenue ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const newUsers = data?.newUsers ?? 0;
  const pendingOrders = data?.pendingOrders ?? 0;

  console.log("Data: ", data);
  

  return (
    <div className="space-y-6 p-6 w-full max-w-none">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Báo cáo thống kê
          </h2>
          <p className="text-sm text-muted-foreground">
            Tổng hợp nhanh các chỉ số chính.
          </p>
        </div>
        {isError && (
          <Badge variant="outline" className="text-xs px-3 py-1 border-dashed">
            Đang hiển thị dữ liệu mặc định (API lỗi)
          </Badge>
        )}
      </div>
      {/* Bộ lọc ngày */}
      <form
        className="flex gap-4 items-center mb-4 flex-wrap"
        onSubmit={(e) => {
          e.preventDefault();
          refetch();
        }}
      >
        <label className="flex items-center gap-2 text-sm">
          Từ ngày:
          <input
            type="date"
            value={startDate.slice(0, 10)}
            onChange={(e) => setStartDate(e.target.value + "T00:00:00")}
            className="border rounded px-2 py-1"
            max={endDate.slice(0, 10)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          Đến ngày:
          <input
            type="date"
            value={endDate.slice(0, 10)}
            onChange={(e) => setEndDate(e.target.value + "T00:00:00")}
            className="border rounded px-2 py-1"
            min={startDate.slice(0, 10)}
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          disabled={isFetching}
        >
          {isFetching ? "Đang tải..." : "Xem báo cáo"}
        </button>
      </form>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="py-0 border-l-4 border-l-green-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Doanh thu
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString("vi-VN")}₫
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trong khoảng thời gian đã chọn
            </p>
          </CardContent>
        </Card>
        <Card className="py-0 border-l-4 border-l-blue-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đơn hàng đã tạo
            </p>
          </CardContent>
        </Card>
        <Card className="py-0 border-l-4 border-l-purple-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Người dùng mới
            </CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{newUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đăng ký mới
            </p>
          </CardContent>
        </Card>
        <Card className="py-0 border-l-4 border-l-orange-500">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Đơn chờ xử lý
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cần xử lý
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart - Thống kê tổng quan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Biểu đồ tổng quan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Doanh thu bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Doanh thu</span>
                  <span className="font-medium">{totalRevenue.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                    style={{ width: totalRevenue > 0 ? '100%' : '0%' }}
                  />
                </div>
              </div>

              {/* Đơn hàng bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Đơn hàng</span>
                  <span className="font-medium">{totalOrders} đơn</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: totalOrders > 0 ? `${Math.min((totalOrders / Math.max(totalOrders, 100)) * 100, 100)}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Người dùng mới bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Người dùng mới</span>
                  <span className="font-medium">{newUsers} người</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000"
                    style={{ width: newUsers > 0 ? `${Math.min((newUsers / Math.max(newUsers, 50)) * 100, 100)}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Đơn chờ xử lý bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Đơn chờ xử lý</span>
                  <span className="font-medium">{pendingOrders} đơn</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                    style={{ width: pendingOrders > 0 ? `${Math.min((pendingOrders / Math.max(totalOrders, 1)) * 100, 100)}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Tỷ lệ đơn hàng */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Tỷ lệ đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              {/* Circular Progress */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Đơn đã xử lý (xanh) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#22c55e"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${((totalOrders - pendingOrders) / Math.max(totalOrders, 1)) * 440} 440`}
                    className="transition-all duration-1000"
                  />
                  {/* Đơn chờ xử lý (cam) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#f97316"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(pendingOrders / Math.max(totalOrders, 1)) * 440} 440`}
                    strokeDashoffset={`-${((totalOrders - pendingOrders) / Math.max(totalOrders, 1)) * 440}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{totalOrders}</span>
                  <span className="text-xs text-muted-foreground">Tổng đơn</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-medium">Đã xử lý</p>
                    <p className="text-lg font-bold text-green-600">{totalOrders - pendingOrders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Chờ xử lý</p>
                    <p className="text-lg font-bold text-orange-600">{pendingOrders}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Tỷ lệ hoàn thành: {totalOrders > 0 ? Math.round(((totalOrders - pendingOrders) / totalOrders) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Tóm tắt báo cáo</h3>
              <p className="text-blue-100 text-sm">
                Từ {startDate.slice(0, 10)} đến {endDate.slice(0, 10)}
              </p>
            </div>
            <div className="flex gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-3xl font-bold">{totalRevenue.toLocaleString("vi-VN")}₫</p>
                <p className="text-blue-100 text-sm">Doanh thu</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{totalOrders}</p>
                <p className="text-blue-100 text-sm">Đơn hàng</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString("vi-VN") : 0}₫
                </p>
                <p className="text-blue-100 text-sm">Giá trị TB/đơn</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
