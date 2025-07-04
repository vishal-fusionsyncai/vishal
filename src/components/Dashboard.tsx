import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: "Total eWay Bills",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: FileText,
      color: "blue"
    },
    {
      title: "Active Bills",
      value: "89",
      change: "+5%",
      changeType: "positive", 
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Extended Bills",
      value: "23",
      change: "+8%",
      changeType: "positive",
      icon: Clock,
      color: "yellow"
    },
    {
      title: "Expired Bills",
      value: "7",
      change: "-3%",
      changeType: "negative",
      icon: AlertCircle,
      color: "red"
    }
  ];

  const recentBills = [
    {
      ewayBillNo: "EWB001234567890",
      from: "Mumbai",
      to: "Delhi",
      vehicle: "MH12AB1234",
      status: "Active",
      validity: "2024-01-15 18:30"
    },
    {
      ewayBillNo: "EWB001234567891", 
      from: "Delhi",
      to: "Bangalore",
      vehicle: "DL10CD5678",
      status: "Extended",
      validity: "2024-01-16 20:45"
    },
    {
      ewayBillNo: "EWB001234567892",
      from: "Chennai",
      to: "Hyderabad", 
      vehicle: "TN09EF9012",
      status: "Active",
      validity: "2024-01-17 14:20"
    }
  ];

  // Today's expiring eWay Bills
  const todaysExpiringBills = [
    {
      ewayBillNo: "123456789012",
      vehicle: "MH04JK5678",
      validity: "2024-01-15 23:59:59",
      hoursToExpiry: 2,
      from: "Mumbai",
      to: "Pune"
    },
    {
      ewayBillNo: "234567890123",
      vehicle: "GJ05LM9012",
      validity: "2024-01-15 18:30:00",
      hoursToExpiry: 6,
      from: "Ahmedabad",
      to: "Surat"
    },
    {
      ewayBillNo: "345678901234",
      vehicle: "KA01AB3456",
      validity: "2024-01-15 20:00:00",
      hoursToExpiry: 4,
      from: "Bangalore",
      to: "Mysore"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-green-100 text-green-800',
      'Extended': 'bg-yellow-100 text-yellow-800',
      'Expired': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Last updated: {new Date().toLocaleString()}
        </Badge>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Expiring Bills Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Expiring eWay Bills ({todaysExpiringBills.length})
            </CardTitle>
            <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-100">
              Extend All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-200">
                  <th className="text-left py-3 px-4 font-medium text-red-700">eWay Bill No.</th>
                  <th className="text-left py-3 px-4 font-medium text-red-700">Route</th>
                  <th className="text-left py-3 px-4 font-medium text-red-700">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-red-700">Validity</th>
                  <th className="text-left py-3 px-4 font-medium text-red-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysExpiringBills.map((bill, index) => (
                  <tr key={index} className="border-b border-red-100 hover:bg-red-100">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">
                      {bill.ewayBillNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {bill.from} → {bill.to}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                      {bill.vehicle}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {bill.validity}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        {bill.hoursToExpiry}h left
                      </span>
                    </td>
                  </tr>
                ))}
                {todaysExpiringBills.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-green-600">
                      No eWay Bills expiring today!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bills Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent eWay Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">eWay Bill No.</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Route</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Valid Until</th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map((bill, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">
                      {bill.ewayBillNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {bill.from} → {bill.to}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                      {bill.vehicle}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {bill.validity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
