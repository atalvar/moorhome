import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export type DeliveryMethod = 'pickup' | 'delivery';

interface ReservationItem extends Product {
  deliveryMethod?: DeliveryMethod;
}

interface ReservationContextType {
  reservedItems: ReservationItem[];
  reservedProductIds: string[];
  addToReservation: (product: Product) => void;
  removeFromReservation: (productId: string) => void;
  updateDeliveryMethod: (productId: string, method: DeliveryMethod) => void;
  clearReservation: () => void;
  confirmReservation: (customerInfo: CustomerInfo) => void;
  totalItems: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

const RESERVED_IDS_KEY = 'reserved_product_ids';

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservedItems, setReservedItems] = useState<ReservationItem[]>([]);
  const [reservedProductIds, setReservedProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(RESERVED_IDS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(RESERVED_IDS_KEY, JSON.stringify(reservedProductIds));
  }, [reservedProductIds]);

  const addToReservation = (product: Product) => {
    if (reservedProductIds.includes(product.id)) return;
    
    setReservedItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev;
      return [...prev, { ...product, deliveryMethod: 'pickup' }];
    });
  };

  const removeFromReservation = (productId: string) => {
    setReservedItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateDeliveryMethod = (productId: string, method: DeliveryMethod) => {
    setReservedItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, deliveryMethod: method } : item
      )
    );
  };

  const clearReservation = () => setReservedItems([]);

  const confirmReservation = (customerInfo: CustomerInfo) => {
    // Mark all items as permanently reserved
    const newReservedIds = reservedItems.map((item) => item.id);
    setReservedProductIds((prev) => [...prev, ...newReservedIds]);
    setReservedItems([]);
  };

  const totalItems = reservedItems.length;

  return (
    <ReservationContext.Provider
      value={{
        reservedItems,
        reservedProductIds,
        addToReservation,
        removeFromReservation,
        updateDeliveryMethod,
        clearReservation,
        confirmReservation,
        totalItems,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};
