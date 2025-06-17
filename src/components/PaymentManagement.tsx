
import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const PaymentManagement = () => {
  const { orders, payments, addPayment, exportToExcel } = useStore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    amount: 0,
    mode: 'Cash' as 'Cash' | 'UPI' | 'Card' | 'Online',
    type: 'Full' as 'Partial' | 'Full',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderId || formData.amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid data",
        variant: "destructive",
      });
      return;
    }

    addPayment(formData);
    setFormData({ orderId: '', amount: 0, mode: 'Cash', type: 'Full' });
    setIsAdding(false);
    toast({
      title: "Success",
      description: "Payment recorded successfully and exported to Excel!",
    });
  };

  const handleExport = () => {
    exportToExcel('payments', payments);
    toast({
      title: "Success",
      description: "Payments data exported to Excel!",
    });
  };

  const getOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    return order ? `#${order.id} - ${order.customer}` : 'Unknown Order';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Management</h2>
        <div className="space-x-2">
          <Button onClick={handleExport} variant="outline">
            Export to Excel
          </Button>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Record New Payment</CardTitle>
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
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter payment amount"
                />
              </div>
              <div>
                <Label htmlFor="mode">Payment Mode</Label>
                <Select onValueChange={(value: 'Cash' | 'UPI' | 'Card' | 'Online') => setFormData({ ...formData, mode: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Payment Type</Label>
                <Select onValueChange={(value: 'Partial' | 'Full') => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full">Full Payment</SelectItem>
                    <SelectItem value="Partial">Partial Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Record Payment</Button>
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
          <h3 className="text-lg font-semibold">All Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getOrderDetails(payment.orderId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.mode === 'Cash' ? 'bg-green-100 text-green-800' :
                      payment.mode === 'UPI' ? 'bg-blue-100 text-blue-800' :
                      payment.mode === 'Card' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {payment.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.type === 'Full' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.paymentDate.toLocaleDateString()}
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
