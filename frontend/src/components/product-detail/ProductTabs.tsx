import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductDetailResponse } from "@/types/api";

interface ProductTabsProps {
  product: ProductDetailResponse;
}

const TABS = [
  { id: "description", label: "MÔ TẢ SẢN PHẨM" },
  { id: "return-policy", label: "QUY ĐỊNH ĐỔI TRẢ" },
  { id: "care-guide", label: "HƯỚNG DẪN CHĂM SÓC" },
  { id: "preservation", label: "HƯỚNG DẪN BẢO QUẢN" },
];

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      {/* Tabs Header */}
      <div className="flex flex-wrap gap-8 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-4 text-sm font-bold uppercase tracking-wide transition-colors relative",
              activeTab === tab.id
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
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
        {/* Tab 1: Mô tả sản phẩm */}
        {activeTab === "description" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Attributes Table */}
            <div className="md:col-span-1">
              <div className="border border-gray-300 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {product.attributes.map((attr, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          "border-b border-gray-300 last:border-0",
                          idx % 2 === 0 ? "bg-[#f5f5f5]" : "bg-white"
                        )}
                      >
                        <td className="py-3 px-4 font-bold text-gray-900 w-2/5 align-top border-r border-gray-300">
                          {attr.name}
                        </td>
                        <td className="py-3 px-4 text-gray-900 align-top">
                          {attr.value.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Product Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-bold uppercase mb-4">
                  {product.name}
                </h3>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {product.specifications && (
                <div>
                  <h4 className="text-lg font-bold uppercase mb-3">THÔNG SỐ</h4>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.specifications}
                  </div>
                </div>
              )}

              {product.note && (
                <div>
                  <h4 className="text-lg font-bold uppercase mb-3">LƯU Ý</h4>
                  <div className="text-gray-600 leading-relaxed italic">
                    {product.note}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Quy định đổi trả */}
        {activeTab === "return-policy" && (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-xl font-bold uppercase mb-4">
              QUY ĐỊNH ĐỔI TRẢ HÀNG
            </h3>
            <p className="text-red-600 font-medium">
              Lưu ý: Trong thời gian diễn ra chương trình khuyến mãi, thời gian
              giao hàng có thể kéo dài hơn so với dự kiến. Rất mong Quý khách
              thông cảm cho sự bất tiện này.
            </p>
            <p>
              <span className="font-bold">Sản phẩm áp dụng:</span> Tất cả sản
              phẩm được giao dịch tại Website Supersports Việt Nam
            </p>
            <div>
              <span className="font-bold">Sản phẩm không áp dụng:</span>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Áo Bra Tập Luyện, Đồ Bơi, Đồ Lót, Phụ Kiện, Dụng Cụ (Ngoại trừ
                  các Phụ kiện bơi lội như: Mắt kính bơi, nhét tai, chân vịt,
                  phao).
                </li>
                <li>
                  Không áp dụng cho các sản phẩm mua trực tiếp tại hệ thống cửa
                  hàng của Supersports.
                </li>
              </ul>
            </div>
            <p>
              <span className="font-bold">Thời gian đổi trả hàng:</span> Trong
              vòng 30 ngày (đối với sản phẩm nguyên giá) và 10 ngày (đối với sản
              phẩm khuyến mãi) kể từ ngày khách hàng nhận được sản phẩm từ đơn
              vị vận chuyển.
            </p>
            <p>
              Tham khảo thêm thông tin tại{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Chính sách đổi trả hàng
              </a>
            </p>
          </div>
        )}

        {/* Tab 3: Hướng dẫn chăm sóc */}
        {activeTab === "care-guide" && (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>Bảo quản quần áo ở nơi thoáng mát và khô ráo</li>
              <li>
                Nếu cần thiết, ủi ở nhiệt độ thấp để tránh làm hỏng logo hoặc
                thiết kế, không ủi trực tiếp vào các hình in trên áo.
              </li>
              <li>
                Hạn chế ủi hoặc sử dụng máy sấy, phơi khô dưới bóng râm, tránh
                tiếp xúc trực tiếp với ánh nắng mặt trời gây bạc màu quần áo.
              </li>
              <li>
                Đảm bảo quần áo khô hoàn toàn trước khi bảo quản, tránh tình
                trạng ẩm mốc
              </li>
              <li>
                Có thể sử dụng túi đựng để giữ quần áo của bạn luôn trong tình
                trạng tốt nhất
              </li>
            </ul>
          </div>
        )}

        {/* Tab 4: Hướng dẫn bảo quản */}
        {activeTab === "preservation" && (
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h4 className="font-bold text-base">
              Dành cho loại quần áo thường (Chất liệu: Cotton, Polyester,
              Nylon,...)
            </h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nên giặt bằng tay hoặc sử dụng máy giặt ở chế độ nhẹ</li>
              <li>
                Sử dụng nước lạnh hoặc ấm để tránh vải bị co rút và mất màu
              </li>
              <li>Lật ngược áo trước khi giặt để bảo vệ màu sắc</li>
              <li>
                Phân loại quần áo màu sáng và màu tối để tránh bị loang màu
              </li>
              <li>Không sử dụng các chất giặt tẩy mạnh</li>
              <li>Hạn chế sử dụng các chất làm mềm vải</li>
              <li>
                Kiểm tra và tuân thủ hướng dẫn chăm sóc trên nhãn mác để đảm bảo
                bạn đang giữ vải ở tình trạng tốt nhất
              </li>
            </ul>
            <p className="mt-4">
              <span className="font-bold underline">Lưu ý:</span> Đối với các
              loại quần áo sử dụng công nghệ như: làm mát, giữ ấm, chống nắng,
              chống thấm... không sử dụng chất làm mềm vải hoặc chất tẩy, không
              để tiếp xúc trực tiếp với nhiệt độ quá cao để tránh làm ảnh hưởng
              đến hiệu suất của sản phẩm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
