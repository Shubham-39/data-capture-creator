
import { Store, ShoppingCart, CreditCard, FileText } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export const Dashboard = () => {
  const { stores, orders, payments } = useStore();

  const stats = [
    {
      label: "Total Stores",
      value: stores.length,
      icon: Store,
      color: "bg-blue-500",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      label: "Pending Orders",
      value: orders.filter(order => order.status === "Pending").length,
      icon: ShoppingCart,
      color: "bg-yellow-500",
    },
    {
      label: "Total Payments",
      value: `$${payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}`,
      icon: CreditCard,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Performance</h3>
          <div className="space-y-3">
            {stores.map((store) => {
              const storeOrders = orders.filter(order => order.storeId === store.id);
              return (
                <div key={store.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-gray-600">{store.location}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {storeOrders.length} orders
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
