import React from "react";

const HeroBanner = () => {
  return (
    <div className="relative bg-gray-100 h-[80vh] flex items-center justify-center mt-4">
      <img
        src="https://cdn.shopify.com/s/files/1/0456/5070/6581/files/LP_12.12_KV_DESK_NEW_VN.jpg?v=1765186097&width=1440"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 text-center">
        {/* <h1 className="text-4xl font-bold text-white">
          PUMA Black Friday Deals
        </h1>
        <p className="text-lg text-white mt-2">
          Giảm đến 50% - Xem tất cả sản phẩm ngay!
        </p> */}
        {/*<button className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Mua ngay
        </button>*/}
      </div>
    </div>
  );
};

export default HeroBanner;
