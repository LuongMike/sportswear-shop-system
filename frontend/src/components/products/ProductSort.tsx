interface ProductSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const ProductSort = ({ sortBy, onSortChange }: ProductSortProps) => {
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá thấp đến cao" },
    { value: "price_desc", label: "Giá cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
  ];

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Sắp xếp theo:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 6h16M4 10h16M4 14h16" />
          </svg>
        </button>
        <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductSort;
