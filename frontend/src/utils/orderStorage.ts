import type { Order } from "@/services/orderApi";

const KEY = "latest_order";

export const saveLatestOrder = (order: Order) => {
  localStorage.setItem(KEY, JSON.stringify(order));
};

export const getLatestOrder = (): Order | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const updateLatestOrder = (patch: Partial<Order>) => {
  const current = getLatestOrder();
  if (!current) return;

  const updated = { ...current, ...patch };
  saveLatestOrder(updated as Order);
};

export const clearLatestOrder = () => {
  localStorage.removeItem(KEY);
};
