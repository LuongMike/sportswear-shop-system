import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  product: any; // Tạm thời để any để khớp với log thực tế của bạn
}

const TABS = [
  { id: "description", label: "MÔ TẢ SẢN PHẨM" },
  { id: "return-policy", label: "QUY ĐỊNH ĐỔI TRẢ" },
  { id: "care-guide", label: "HƯỚNG DẪN CHĂM SÓC" },
];

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  if (!product)
    return <div className="mt-12 h-40 bg-gray-50 animate-pulse rounded-lg" />;

  // Mapping dữ liệu từ log thực tế
  const productName = product.productName || product.name;
  const description = product.description;
  const categoryName = product.categoryName;
  const sportName = product.sportName;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      {/* Tabs Header */}
      <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-4 text-sm font-bold uppercase tracking-wide transition-colors relative",
              activeTab === tab.id
                ? "text-black"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="min-h-[300px]">
        {activeTab === "description" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột trái: Thông số từ API (Category, Sport) */}
            <div className="md:col-span-1">
              <div className="border border-gray-300 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-300 bg-[#f5f5f5]">
                      <td className="py-3 px-4 font-bold w-2/5 border-r border-gray-300">
                        Danh mục
                      </td>
                      <td className="py-3 px-4">{categoryName || "N/A"}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 font-bold border-r border-gray-300">
                        Môn thể thao
                      </td>
                      <td className="py-3 px-4">{sportName || "N/A"}</td>
                    </tr>
                    {/* Hiển thị thêm SKU của variant đầu tiên nếu cần */}
                    <tr className="border-t border-gray-300 bg-[#f5f5f5]">
                      <td className="py-3 px-4 font-bold border-r border-gray-300">
                        Mã sản phẩm
                      </td>
                      <td className="py-3 px-4">
                        {product.variants?.[0]?.sku || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cột phải: Tên và Mô tả */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold uppercase mb-4">
                  {productName}
                </h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">
                  {description || "Đang cập nhật mô tả cho sản phẩm này..."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Các tab khác giữ nguyên nội dung tĩnh */}
        {activeTab === "return-policy" && (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed max-w-4xl">
            <h3 className="text-xl font-bold uppercase mb-4 text-black">
              QUY ĐỊNH ĐỔI TRẢ HÀNG
            </h3>

            <div className="bg-red-50 p-4 text-red-700 rounded border border-red-100">
              <span className="font-bold">Lưu ý:</span> Trong thời gian khuyến
              mãi, thời gian giao hàng có thể chậm hơn dự kiến. Rất mong quý
              khách thông cảm.
            </div>

            <p>
              <span className="font-bold">Sản phẩm áp dụng:</span> Tất cả sản
              phẩm được giao dịch tại Website chính thức.
            </p>

            <div>
              <span className="font-bold">Sản phẩm không áp dụng:</span>

              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Đồ lót, đồ bơi, phụ kiện cá nhân (tất, khẩu trang...).</li>

                <li>
                  Sản phẩm đã qua sử dụng, mất tem mác hoặc hư hỏng do tác động
                  bên ngoài.
                </li>
              </ul>
            </div>

            <p>
              <span className="font-bold">Thời gian đổi trả:</span> 30 ngày
              (hàng nguyên giá) và 10 ngày (hàng giảm giá).
            </p>
          </div>
        )}

        {/* Tab 3: Hướng dẫn chăm sóc */}

        {activeTab === "care-guide" && (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-xl font-bold uppercase mb-4">
              HƯỚNG DẪN CHĂM SÓC
            </h3>

            <ul className="list-disc pl-5 space-y-3">
              <li>
                Giặt máy ở chế độ nhẹ nhàng với nhiệt độ nước không quá 30°C.
              </li>

              <li>Không sử dụng chất tẩy mạnh hoặc bột giặt có độ kiềm cao.</li>

              <li>
                Lộn trái sản phẩm khi phơi dưới ánh nắng nhẹ để giữ màu lâu hơn.
              </li>

              <li>
                Ủi ở nhiệt độ thấp (dưới 110°C) và không ủi trực tiếp lên hình
                in/thêu.
              </li>

              <li>
                Đảm bảo sản phẩm khô hoàn toàn trước khi cất giữ để tránh ẩm
                mốc.
              </li>
            </ul>
          </div>
        )}

        {/* Tab 4: Hướng dẫn bảo quản */}

        {activeTab === "preservation" && (
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <div>
              <h4 className="font-bold text-base mb-2 uppercase">
                Đối với chất liệu phổ thông (Cotton, Polyester)
              </h4>

              <ul className="list-disc pl-5 space-y-2">
                <li>Nên giặt bằng tay để giữ form dáng sản phẩm tốt nhất.</li>

                <li>Tránh ngâm sản phẩm quá lâu trong nước xà phòng.</li>

                <li>
                  Phân loại màu sáng và tối trước khi giặt để tránh hiện tượng
                  loang màu.
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded">
              <span className="font-bold underline text-blue-900">
                LƯU Ý CÔNG NGHỆ:
              </span>

              <p className="mt-2 text-blue-800">
                Đối với các sản phẩm có công nghệ đặc biệt (DRY-EX, làm mát,
                chống nắng...), tuyệt đối không dùng chất làm mềm vải vì sẽ làm
                bít lỗ thoát khí và giảm hiệu năng của vải.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
