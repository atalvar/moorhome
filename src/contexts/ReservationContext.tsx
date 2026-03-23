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

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface ReservationContextType {
  reservedItems: Product[];
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  addToReservation: (product: Product) => void;
  removeFromReservation: (productId: string) => void;
  clearReservation: () => void;
  confirmReservation: (customerInfo: CustomerInfo) => Promise<boolean>;
  totalItems: number;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservedItems, setReservedItems] = useState<Product[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');

  const addToReservation = (product: Product) => {
    setReservedItems((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromReservation = (productId: string) => {
    setReservedItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearReservation = () => {
    setReservedItems([]);
    setDeliveryMethod('pickup');
  };

  const confirmReservation = async (customerInfo: CustomerInfo): Promise<boolean> => {
    const items = reservedItems.map((item) => ({
      product_id: item.id,
      delivery_method: deliveryMethod,
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
    setDeliveryMethod('pickup');
    return true;
  };

  const totalItems = reservedItems.length;

  return (
    <ReservationContext.Provider
      value={{
        reservedItems,
        deliveryMethod,
        setDeliveryMethod,
        addToReservation,
        removeFromReservation,
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
