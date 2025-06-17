
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { StoreManagement } from "@/components/StoreManagement";
import { OrderManagement } from "@/components/OrderManagement";
import { PaymentManagement } from "@/components/PaymentManagement";
import { BillingManagement } from "@/components/BillingManagement";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "stores":
        return <StoreManagement />;
      case "orders":
        return <OrderManagement />;
      case "payments":
        return <PaymentManagement />;
      case "billing":
        return <BillingManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
