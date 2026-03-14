Cấu trúc Components với ShadcnUI

1. Cấu trúc thư mục đề xuất:

src/

├── components/

│ ├── ui/ # ShadcnUI components

│ │ ├── button.tsx

│ │ ├── input.tsx

│ │ ├── card.tsx

│ │ ├── badge.tsx

│ │ ├── dialog.tsx

│ │ ├── dropdown-menu.tsx

│ │ ├── select.tsx

│ │ ├── sheet.tsx

│ │ ├── tabs.tsx

│ │ ├── toast.tsx

│ │ └── ...

│ ├── layout/ # Layout components

│ │ ├── header.tsx

│ │ ├── footer.tsx

│ │ ├── navbar.tsx

│ │ └── sidebar.tsx

│ ├── product/ # Product components

│ │ ├── product-card.tsx

│ │ ├── product-grid.tsx

│ │ ├── product-filter.tsx

│ │ ├── product-gallery.tsx

│ │ └── product-quick-view.tsx

│ ├── cart/ # Cart components

│ │ ├── cart-drawer.tsx

│ │ ├── cart-item.tsx

│ │ └── cart-summary.tsx

│ ├── forms/ # Form components

│ │ ├── search-form.tsx

│ │ ├── newsletter-form.tsx

│ │ ├── contact-form.tsx

│ │ └── auth-forms.tsx

│ └── common/ # Common components

│ ├── brand-carousel.tsx

│ ├── countdown-timer.tsx

│ ├── loading-spinner.tsx

│ ├── pagination.tsx

│ └── breadcrumb.tsx

├── pages/ # Page components

│ ├── home.tsx

│ ├── products.tsx

│ ├── product-detail.tsx

│ ├── cart.tsx

│ ├── account.tsx

│ ├── blog.tsx

│ └── contact.tsx

├── lib/

│ ├── utils.ts

│ └── types.ts

└── data/

    ├── products.ts

    ├── brands.ts

    └── categories.ts

2. Chi tiết Pages và Components sử dụng:

HOME PAGE (pages/home.tsx)

// ShadcnUI Components sử dụng:

- Card, CardContent, CardHeader

- Button

- Badge

- Carousel (custom với embla)

- Tabs, TabsContent, TabsList, TabsTrigger

// Custom Components:

- Header/Navbar

- Hero Banner với Countdown Timer

- Brand Carousel

- Product Grid

- Category Cards

- News Section

- Newsletter Form

- Footer

PRODUCTS PAGE (pages/products.tsx)

// ShadcnUI Components:

- Sheet (for mobile filters)

- Select (for sorting)

- Checkbox (for filters)

- Slider (for price range)

- Pagination

- Skeleton (loading states)

// Custom Components:

- Product Filter Sidebar

- Product Grid

- Product Card

- Sort Dropdown

- Breadcrumb

PRODUCT DETAIL PAGE (pages/product-detail.tsx)

// ShadcnUI Components:

- Dialog (for size guide)

- RadioGroup (for size/color selection)

- Button

- Badge

- Tabs (for description, reviews)

- Accordion (for specifications)

- Toast (for add to cart feedback)

// Custom Components:

- Product Gallery

- Product Info

- Size Selector

- Color Picker

- Quantity Selector

- Related Products

- Reviews Section

CART PAGE (pages/cart.tsx)

// ShadcnUI Components:

- Card

- Button

- Input (quantity)

- Separator

- Alert (empty cart message)

// Custom Components:

- Cart Item

- Cart Summary

- Shipping Calculator

- Recommended Products

ACCOUNT PAGE (pages/account.tsx)

// ShadcnUI Components:

- Tabs (for different sections)

- Form, Input, Label

- Button

- Card

- Table (for order history)

- Dialog (for edit forms)

// Custom Components:

- Profile Form

- Order History

- Address Book

- Wishlist
