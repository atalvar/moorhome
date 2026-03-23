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
    // 1. Create reservation record
    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .insert({
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address || null,
      })
      .select()
      .single();

    if (resError || !reservation) return false;

    // 2. Create reservation items
    const items = reservedItems.map((item) => ({
      reservation_id: reservation.id,
      product_id: item.id,
      delivery_method: item.deliveryMethod,
    }));

    const { error: itemsError } = await supabase
      .from('reservation_items')
      .insert(items);

    if (itemsError) return false;

    // 3. Mark products as reserved
    const productIds = reservedItems.map((item) => item.id);
    const { error: updateError } = await supabase
      .from('products')
      .update({ is_reserved: true })
      .in('id', productIds);

    if (updateError) return false;

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
