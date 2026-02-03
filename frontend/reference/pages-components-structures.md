# 🇻🇳 CẤU TRÚC PAGES VÀ COMPONENTS CỦA SUPERSPORTS.COM.VN

Tài liệu này mô tả chi tiết cấu trúc các trang (Pages) và các thành phần giao diện (Components) được sử dụng trên website SuperSports.com.vn.

---

## 1. 🏠 TRANG CHỦ (Homepage)

Đây là trang đích chính của website.

| Components Sử Dụng       | Mô Tả                                                                             |
| :----------------------- | :-------------------------------------------------------------------------------- |
| **Header**               | Logo, Navigation Menu, Search, Account, Cart.                                     |
| **Hero Banner**          | Khu vực quảng cáo nổi bật với Countdown timer và các banner khuyến mãi.           |
| **Brand Showcase**       | Hiển thị các thương hiệu lớn: Nike, Adidas, Hoka, Under Armour, Columbia, Speedo. |
| **Category Grid**        | Lưới danh mục sản phẩm chính: Running, Training, Fashion, Outdoor, Gender-based.  |
| **Product Grid**         | Hiển thị các Sản phẩm nổi bật (Featured products) kèm theo chiết khấu (discount). |
| **New Collections**      | Bộ sưu tập sản phẩm mới ra mắt.                                                   |
| **Featured Collections** | Bộ sưu tập sản phẩm được làm nổi bật.                                             |
| **Brand Highlights**     | Khu vực làm nổi bật một số thương hiệu quan trọng.                                |
| **Sports Categories**    | Các môn thể thao được yêu thích.                                                  |
| **News Section**         | Khu vực tin tức với các tabs (Nổi bật, Khuyến mãi, Mẹo thời trang).               |
| **Newsletter Signup**    | Form đăng ký nhận bản tin/voucher.                                                |
| **Footer**               | Thông tin công ty, liên kết điều hướng, phương thức thanh toán.                   |

---

## 2. 🛍️ TRANG DANH MỤC SẢN PHẨM (Collections)

Các trang dùng để hiển thị danh sách sản phẩm theo một tiêu chí cụ thể (danh mục, thương hiệu, ưu đãi, v.v.).

| Loại Trang   | URL Mẫu                                                      |
| :----------- | :----------------------------------------------------------- |
| Hàng mới     | `/collections/hang-moi`                                      |
| Giới tính    | `/collections/nam`, `/collections/nu`, `/collections/tre-em` |
| Phụ kiện     | `/collections/phu-kien`                                      |
| Ưu đãi       | `/collections/uu-dai`                                        |
| Thương hiệu  | `/collections/nike`, `/collections/adidas`                   |
| Môn thể thao | `/collections/chay-bo`, `/collections/bong-da`               |

**Components Sử Dụng:**

- **Breadcrumb Navigation:** Điều hướng người dùng biết vị trí hiện tại.
- **Filter Sidebar:** Bộ lọc sản phẩm theo Giá, Thương hiệu, Size, Màu sắc.
- **Sort Options:** Tùy chọn sắp xếp (Giá, Tên, Mới nhất).
- **Product Grid:** Hiển thị danh sách sản phẩm dạng lưới.
- **Product Card:** Hiển thị thông tin cơ bản của sản phẩm (Hình ảnh, Tên, Giá, Discount, Rating).
- **Pagination:** Cơ chế phân trang cho danh sách sản phẩm.
- **View Toggle:** Chuyển đổi giữa chế độ xem lưới (Grid) và danh sách (List).

---

## 3. 👕 TRANG CHI TIẾT SẢN PHẨM (Product Detail)

Trang hiển thị thông tin chi tiết của một sản phẩm.

| Chi Tiết         | URL Pattern                |
| :--------------- | :------------------------- |
| **Cấu trúc URL** | `/products/[product-slug]` |

**Components Sử Dụng:**

- **Product Gallery:** Hình ảnh chính và ảnh thumbnail của sản phẩm.
- **Product Info:** Tên, Giá, và Mô tả chi tiết sản phẩm.
- **Size Selector:** Lựa chọn kích cỡ với modal hướng dẫn.
- **Color Options:** Lựa chọn màu sắc sản phẩm.
- **Quantity Selector:** Chọn số lượng cần mua.
- **Add to Cart Button:** Nút thêm sản phẩm vào giỏ hàng.
- **Product Specs:** Thông số kỹ thuật chi tiết của sản phẩm.
- **Rating & Reviews:** Khu vực đánh giá và nhận xét của khách hàng.
- **Related Products:** Gợi ý các sản phẩm có liên quan.
- **Recently Viewed:** Danh sách sản phẩm người dùng đã xem gần đây.

---

## 4. 🛒 TRANG GIỎ HÀNG (Cart)

Trang tổng hợp các sản phẩm đã chọn trước khi thanh toán.

| Chi Tiết | URL     |
| :------- | :------ |
| **URL**  | `/cart` |

**Components Sử Dụng:**

- **Cart Items List:** Danh sách các sản phẩm trong giỏ hàng.
- **Quantity Controls:** Controls để Tăng/Giảm số lượng sản phẩm.
- **Remove Item:** Chức năng Xóa sản phẩm khỏi giỏ.
- **Price Summary:** Bảng tóm tắt Tổng tiền và Giảm giá.
- **Shipping Calculator:** Tính toán phí vận chuyển.
- **Checkout Button:** Nút chuyển đến trang thanh toán.
- **Recommended Products:** Gợi ý sản phẩm bổ sung.

---

## 5. 👤 TRANG TÀI KHOẢN (Account)

Khu vực quản lý thông tin cá nhân và lịch sử mua hàng.

| Chi Tiết | URL        |
| :------- | :--------- |
| **URL**  | `/account` |

**Components Sử Dụng:**

- **Login Form:** Form đăng nhập.
- **Register Form:** Form đăng ký tài khoản mới.
- **Profile Info:** Hiển thị và chỉnh sửa thông tin cá nhân.
- **Order History:** Xem lịch sử các đơn hàng đã đặt.
- **Address Book:** Quản lý sổ địa chỉ giao hàng.
- **Wishlist:** Danh sách sản phẩm yêu thích đã lưu.

---

## 6. 📰 TRANG TIN TỨC (Blog)

Nơi đăng tải các bài viết, tin tức, và mẹo thời trang/thể thao.

| Loại Trang       | URL Mẫu                 |
| :--------------- | :---------------------- |
| Trang Blog chính | `/blogs/news`           |
| Tin Khuyến mãi   | `/blogs/tin-khuyen-mai` |
| Mẹo Thời trang   | `/blogs/meo-thoi-trang` |

**Components Sử Dụng:**

- **Article List:** Danh sách các bài viết.
- **Article Card:** Card tóm tắt bài viết với thumbnail.
- **Category Tabs:** Phân loại tin tức.
- **Article Detail:** Chi tiết nội dung một bài viết.
- **Related Articles:** Bài viết liên quan.
- **Social Share:** Nút chia sẻ bài viết lên mạng xã hội.

---

## 7. ℹ️ TRANG THÔNG TIN TĨNH (Static Pages)

Các trang chứa nội dung tĩnh về công ty, chính sách, và hỗ trợ.

| Trang              | URL Mẫu                                 |
| :----------------- | :-------------------------------------- |
| Giới thiệu         | `/pages/gioi-thieu-ve-supersports`      |
| Hệ thống cửa hàng  | `/pages/danh-sach-cua-hang`             |
| Hỗ trợ/FAQ         | `/pages/ho-tro-giai-dap-thac-mac`       |
| Điều khoản         | `/pages/dieu-khoan-va-dieu-kien`        |
| Chính sách bảo mật | `/pages/chinh-sach-bao-mat-supersports` |
| Tra cứu đơn hàng   | `/pages/tra-cuu-don-hang`               |

**Components Sử Dụng:**

- **Page Content:** Khu vực chứa nội dung tĩnh.
- **Contact Form:** Form liên hệ (có thể dùng trên trang Hỗ trợ).
- **Store Locator:** Bản đồ/Chức năng tìm kiếm cửa hàng.
- **FAQ Section:** Khu vực Hỏi đáp thường gặp.

---

## 8. 🌐 COMPONENTS DÙNG CHUNG (Shared Components)

Các thành phần được sử dụng lặp lại trên nhiều trang để đảm bảo tính nhất quán và tái sử dụng.

- **Search Modal:** Popup/Modal tìm kiếm sản phẩm.
- **Size Guide Modal:** Modal hướng dẫn chọn kích cỡ (dùng trên trang Chi tiết SP).
- **Cookie Notice:** Thanh thông báo về việc sử dụng cookie.
- **Loading Spinner:** Biểu tượng trạng thái tải (loading).
- **Error Boundary:** Cơ chế xử lý lỗi giao diện.
- **Notification Toast:** Thông báo nhỏ (ví dụ: "Thêm vào giỏ hàng thành công").
- **Back to Top:** Nút quay lại đầu trang.

---
