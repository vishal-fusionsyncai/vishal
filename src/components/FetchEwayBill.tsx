
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Eye, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FetchEwayBill = () => {
  const [searchType, setSearchType] = useState('eway');
  const [searchValue, setSearchValue] = useState('');
  const [gstin, setGstin] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const mockResults = [
    {
      ewayBillNo: "EWB001234567890",
      docNo: "INV-2024-001",
      docDate: "2024-01-15",
      from: "Mumbai, Maharashtra",
      to: "Delhi, Delhi",
      vehicle: "MH12AB1234",
      status: "Active",
      validity: "2024-01-16 18:30",
      distance: "1,400 km",
      remainingDistance: "850 km",
      value: "₹1,25,000"
    },
    {
      ewayBillNo: "EWB001234567891", 
      docNo: "INV-2024-002",
      docDate: "2024-01-14",
      from: "Delhi, Delhi",
      to: "Bangalore, Karnataka",
      vehicle: "DL10CD5678",
      status: "Extended",
      validity: "2024-01-17 20:45",
      distance: "2,100 km",
      remainingDistance: "1,200 km",
      value: "₹85,500"
    }
  ];

  const handleSearch = async () => {
    if (!searchValue && searchType !== 'report') {
      toast({
        title: "Error",
        description: "Please enter a search value",
        variant: "destructive"
      });
      return;
    }

    if (searchType === 'report' && (!gstin || !fromDate || !toDate)) {
      toast({
        title: "Error", 
        description: "Please fill all required fields for report",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setResults(mockResults);
      toast({
        title: "Success",
        description: `Found ${mockResults.length} eWay Bills`,
      });
    }, 1500);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Fetch eWay Bill</h1>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Search eWay Bills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={searchType} onValueChange={setSearchType}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="eway">eWay Bill No.</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle No.</TabsTrigger>
              <TabsTrigger value="consolidated">Consolidated</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="eway" className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eway-no">eWay Bill Number</Label>
                  <Input
                    id="eway-no"
                    placeholder="Enter eWay Bill Number (e.g., EWB001234567890)"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="vehicle" className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehicle-no">Vehicle Number</Label>
                  <Input
                    id="vehicle-no"
                    placeholder="Enter Vehicle Number (e.g., MH12AB1234)"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="consolidated" className="mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="consolidated-no">Consolidated eWay Bill Number</Label>
                  <Input
                    id="consolidated-no"
                    placeholder="Enter Consolidated eWay Bill Number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="report" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    placeholder="Enter GSTIN"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="from-date">From Date</Label>
                  <Input
                    id="from-date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="to-date">To Date</Label>
                  <Input
                    id="to-date"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Search Results ({results.length})
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Distance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((bill, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm text-blue-600">
                        {bill.ewayBillNo}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{bill.from}</div>
                          <div className="text-gray-600">↓</div>
                          <div className="font-medium">{bill.to}</div>
                        </div>
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
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <div>{bill.distance}</div>
                        <div className="text-gray-600 text-xs">
                          {bill.remainingDistance} remaining
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FetchEwayBill;
