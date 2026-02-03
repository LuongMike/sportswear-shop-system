import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  muaSam: {
    title: "Mua sắm",
    items: [
      { label: "Nam", href: "/collections/nam" },
      { label: "Nữ", href: "/collections/nu" },
      { label: "Trẻ Em", href: "/collections/tre-em" },
      { label: "Thương Hiệu", href: "/brands" },
      { label: "Hàng Mới", href: "/collections/new-arrivals" },
    ],
  },
  hoTro: {
    title: "Hỗ trợ",
    items: [
      { label: "Đăng nhập", href: "/login" },
      { label: "Hướng dẫn đặt hàng", href: "/ho-tro/dat-hang" },
      { label: "Chính sách đổi trả", href: "/ho-tro/doi-tra" },
      { label: "Phương thức thanh toán", href: "/ho-tro/thanh-toan" },
      { label: "Câu hỏi thường gặp", href: "/ho-tro/faq" },
    ],
  },
  lienHe: {
    title: "Liên hệ",
    items: [
      { icon: Mail, text: "hotro@sportshop.vn" },
      { icon: Phone, text: "1900 xxxx" },
      {
        icon: MapPin,
        text: "123 Đường ABC, Quận 1, TP.HCM",
      },
    ],
  },
};

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-900 text-gray-300">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-red-500 transition-colors"
            >
              SPORTSHOP
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Cửa hàng thể thao chính hãng - Giày, quần áo và phụ kiện cho mọi
              môn thể thao.
            </p>
          </div>

          {/* Mua sắm */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {footerLinks.muaSam.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.muaSam.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {footerLinks.hoTro.title}
            </h3>
            <ul className="space-y-2">
              {footerLinks.hoTro.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {footerLinks.lienHe.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.lienHe.items.map((item) => (
                <li key={item.text} className="flex items-start gap-2">
                  <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                  <span className="text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SPORTSHOP. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/chinh-sach/bao-mat"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              to="/chinh-sach/dieu-khoan"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
