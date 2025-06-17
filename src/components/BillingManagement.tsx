
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const BillingManagement = () => {
  const { orders, bills, addBill, exportToExcel } = useStore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    itemizedCost: 0,
    tax: 0,
    paymentStatus: 'Pending' as 'Pending' | 'Paid' | 'Partial',
  });

  const total = formData.itemizedCost + formData.tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderId || formData.itemizedCost <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid data",
        variant: "destructive",
      });
      return;
    }

    addBill({
      ...formData,
      total,
    });
    setFormData({ orderId: '', itemizedCost: 0, tax: 0, paymentStatus: 'Pending' });
    setIsAdding(false);
    toast({
      title: "Success",
      description: "Bill generated successfully and exported to Excel!",
    });
  };

  const handleExport = () => {
    exportToExcel('bills', bills);
    toast({
      title: "Success",
      description: "Bills data exported to Excel!",
    });
  };

  const getOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order ? `#${order.id} - ${order.customer}` : 'Unknown Order';
  };

  // Auto-calculate tax (assuming 10% tax rate)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tax: prev.itemizedCost * 0.1,
    }));
  }, [formData.itemizedCost]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Billing Management</h2>
        <div className="space-x-2">
          <Button onClick={handleExport} variant="outline">
            Export to Excel
          </Button>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate Bill
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate New Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="order">Order</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, orderId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        #{order.id} - {order.customer} - ${order.total.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="itemizedCost">Itemized Cost</Label>
                <Input
                  id="itemizedCost"
                  type="number"
                  step="0.01"
                  value={formData.itemizedCost}
                  onChange={(e) => setFormData({ ...formData, itemizedCost: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter itemized cost"
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax (10% auto-calculated)</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  value={formData.tax.toFixed(2)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="total">Total Amount</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={total.toFixed(2)}
                  readOnly
                  className="bg-gray-50 font-semibold"
                />
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select onValueChange={(value: 'Pending' | 'Paid' | 'Partial') => setFormData({ ...formData, paymentStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Generate Bill</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">All Bills</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itemized Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{bill.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getOrderDetails(bill.orderId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${bill.itemizedCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${bill.tax.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${bill.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      bill.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      bill.paymentStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bill.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
