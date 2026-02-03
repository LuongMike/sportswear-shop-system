import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";

const CartSheet = () => {
  const {
    cart,
    fetchCart,
    removeItem,
    updateQuantity,
    isLoading,
    updatingItems,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalItems = cart?.totalItems || 0;
  const totalPrice = Number(cart?.totalPrice || 0);

  const isUpdating = (itemId: number) => updatingItems.includes(itemId);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
          <ShoppingBag className="h-5 w-5 text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-xl font-bold">
            Giỏ hàng của tôi ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && !cart ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Giỏ hàng của bạn đang trống
            </div>
          ) : (
            <div className="space-y-6">
              {cart?.items.map((item) => (
                <div key={item.itemId} className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 border border-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.variant.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase mb-1">
                        {item.product.brandName}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        {item.variant.color?.name} / {item.variant.size?.name}
                      </div>
                      <div className="font-bold text-gray-900">
                        {formatCurrency(Number(item.variant.price))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded-sm h-8">
                        <button
                          onClick={() =>
                            updateQuantity(item.itemId, item.quantity - 1)
                          }
                          className="px-2 h-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            item.quantity <= 1 || isUpdating(item.itemId)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {isUpdating(item.itemId) ? (
                            <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-black rounded-full animate-spin"></span>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.itemId, item.quantity + 1)
                          }
                          className="px-2 h-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isUpdating(item.itemId)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="text-sm text-red-500 underline hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUpdating(item.itemId)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalItems > 0 && (
          <div className="border-t p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between text-base font-medium text-gray-900">
              <p>Tạm tính</p>
              <p className="text-xl font-bold">{formatCurrency(totalPrice)}</p>
            </div>
            <div className="space-y-3">
              <Link
                to="/checkout"
                className="block w-full bg-[#0f172a] text-white h-12 rounded-sm font-bold uppercase hover:bg-[#1e293b] transition-colors text-center leading-[3rem]"
              >
                Thanh toán
              </Link>
            </div>
            <div className="mt-6"></div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
