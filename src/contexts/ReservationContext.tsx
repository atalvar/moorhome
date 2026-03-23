import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  category: string;
  image: string;
  description: string;
  is_reserved?: boolean;
}

export type DeliveryMethod = 'pickup' | 'delivery';

export interface ReservationItem extends Product {
  deliveryMethod: DeliveryMethod;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface ReservationContextType {
  reservedItems: ReservationItem[];
  addToReservation: (product: Product) => void;
  removeFromReservation: (productId: string) => void;
  updateDeliveryMethod: (productId: string, method: DeliveryMethod) => void;
  clearReservation: () => void;
  confirmReservation: (customerInfo: CustomerInfo) => Promise<boolean>;
  totalItems: number;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservedItems, setReservedItems] = useState<ReservationItem[]>([]);

  const addToReservation = (product: Product) => {
    setReservedItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
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

  const confirmReservation = async (customerInfo: CustomerInfo): Promise<boolean> => {
    const items = reservedItems.map((item) => ({
      product_id: item.id,
      delivery_method: item.deliveryMethod,
    }));

    const { data, error } = await supabase.functions.invoke('create-reservation', {
      body: {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address || null,
        items,
      },
    });

    if (error || data?.error) return false;

    setReservedItems([]);
    return true;
  };

  const totalItems = reservedItems.length;

  return (
    <ReservationContext.Provider
      value={{
        reservedItems,
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
