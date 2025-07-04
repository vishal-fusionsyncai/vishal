
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [reportType, setReportType] = useState('');
  const [gstin, setGstin] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'eway-summary', label: 'eWay Bill Summary' },
    { value: 'expired-bills', label: 'Expired Bills Report' },
    { value: 'extended-bills', label: 'Extended Bills Report' },
    { value: 'vehicle-wise', label: 'Vehicle-wise Report' },
    { value: 'route-wise', label: 'Route-wise Report' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'extended', label: 'Extended' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const mockReportData = [
    {
      month: 'January 2024',
      totalBills: 156,
      activeBills: 89,
      extendedBills: 23,
      expiredBills: 7,
      cancelledBills: 37,
      totalValue: '₹45,67,890'
    },
    {
      month: 'December 2023',
      totalBills: 143,
      activeBills: 67,
      extendedBills: 19,
      expiredBills: 12,
      cancelledBills: 45,
      totalValue: '₹38,92,340'
    }
  ];

  const generateReport = async () => {
    if (!reportType || !fromDate || !toDate) {
      toast({
        title: "Error",
        description: "Please select report type and date range",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setReportData(mockReportData);
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    }, 1500);
  };

  const exportReport = (format: string) => {
    toast({
      title: "Exporting",
      description: `Report is being exported as ${format.toUpperCase()}`,
    });
  };

  const getStatusBadge = (count: number, type: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      extended: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Calendar className="mr-1 h-3 w-3" />
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Report Generation Form */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">
                Report Type <span className="text-red-500">*</span>
              </Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from-date">
                From Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-date">
                To Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN (Optional)</Label>
              <Input
                id="gstin"
                placeholder="Enter GSTIN"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generateReport}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportData.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Report Results
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportReport('pdf')}
              >
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportReport('excel')}
              >
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reportData.map((data, index) => (
                <div key={index} className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.month}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{data.totalBills}</div>
                      <div className="text-sm text-gray-600">Total Bills</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{data.activeBills}</div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{data.extendedBills}</div>
                      <div className="text-sm text-gray-600">Extended</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{data.expiredBills}</div>
                      <div className="text-sm text-gray-600">Expired</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{data.cancelledBills}</div>
                      <div className="text-sm text-gray-600">Cancelled</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{data.totalValue}</div>
                      <div className="text-sm text-gray-600">Total Value</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bills</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-green-600">57% of total</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₹45.6L</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
