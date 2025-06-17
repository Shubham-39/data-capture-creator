
import { Store, ShoppingCart, CreditCard, FileText, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "stores", label: "Store Management", icon: Store },
    { id: "orders", label: "Order Management", icon: ShoppingCart },
    { id: "payments", label: "Payment Handling", icon: CreditCard },
    { id: "billing", label: "Billing", icon: FileText },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Business Manager</h1>
        {user && (
          <p className="text-sm text-gray-600 mt-1">Welcome, {user.email}</p>
        )}
      </div>
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
