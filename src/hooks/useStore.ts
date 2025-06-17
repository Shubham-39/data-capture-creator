
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export interface Store {
  id: string;
  name: string;
  location: string;
  type: 'Location' | 'Franchise';
  createdAt: Date;
}

export interface Order {
  id: string;
  storeId: string;
  customer: string;
  items: string;
  quantity: number;
  status: 'Pending' | 'Preparing' | 'Delivered';
  orderDate: Date;
  total: number;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  mode: 'Cash' | 'UPI' | 'Card' | 'Online';
  type: 'Partial' | 'Full';
  paymentDate: Date;
}

export interface Bill {
  id: string;
  orderId: string;
  itemizedCost: number;
  tax: number;
  total: number;
  paymentStatus: 'Pending' | 'Paid' | 'Partial';
  createdAt: Date;
}

export const useStore = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  // Load initial data
  useEffect(() => {
    const initialStores: Store[] = [
      {
        id: '1',
        name: 'Downtown Store',
        location: 'Main Street, Downtown',
        type: 'Location',
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Mall Franchise',
        location: 'Shopping Mall, North',
        type: 'Franchise',
        createdAt: new Date(),
      },
    ];

    const initialOrders: Order[] = [
      {
        id: '1001',
        storeId: '1',
        customer: 'John Doe',
        items: 'Pizza, Burger, Coke',
        quantity: 3,
        status: 'Delivered',
        orderDate: new Date(),
        total: 25.99,
      },
      {
        id: '1002',
        storeId: '2',
        customer: 'Jane Smith',
        items: 'Sandwich, Coffee',
        quantity: 2,
        status: 'Preparing',
        orderDate: new Date(),
        total: 12.50,
      },
    ];

    setStores(initialStores);
    setOrders(initialOrders);
  }, []);

  const addStore = (store: Omit<Store, 'id' | 'createdAt'>) => {
    const newStore: Store = {
      ...store,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setStores(prev => [...prev, newStore]);
    exportToExcel('stores', [...stores, newStore]);
  };

  const addOrder = (order: Omit<Order, 'id' | 'orderDate'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      orderDate: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
    exportToExcel('orders', [...orders, newOrder]);
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'paymentDate'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      paymentDate: new Date(),
    };
    setPayments(prev => [...prev, newPayment]);
    exportToExcel('payments', [...payments, newPayment]);
  };

  const addBill = (bill: Omit<Bill, 'id' | 'createdAt'>) => {
    const newBill: Bill = {
      ...bill,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setBills(prev => [...prev, newBill]);
    exportToExcel('bills', [...bills, newBill]);
  };

  const exportToExcel = (type: string, data: any[]) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, type);
      XLSX.writeFile(wb, `${type}_${new Date().toISOString().split('T')[0]}.xlsx`);
      console.log(`${type} data exported to Excel successfully!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const deleteStore = (storeId: string) => {
    setStores(prev => prev.filter(store => store.id !== storeId));
  };

  return {
    stores,
    orders,
    payments,
    bills,
    addStore,
    addOrder,
    addPayment,
    addBill,
    updateOrderStatus,
    deleteStore,
    exportToExcel,
  };
};
