
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkExtendProps {
  selectedBills: any[];
  onBack: () => void;
  onSuccess: () => void;
}

const BulkExtend = ({ selectedBills, onBack, onSuccess }: BulkExtendProps) => {
  const [formData, setFormData] = useState({
    reason: '',
    estimatedDeliveryDate: '',
    estimatedDeliveryTime: '',
    distanceLeft: '',
    remarks: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedBills, setProcessedBills] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const extensionReasons = [
    { value: 'accident', label: 'Accident' },
    { value: 'breakdown', label: 'Vehicle Breakdown' },
    { value: 'traffic', label: 'Traffic Jam' },
    { value: 'natural_calamity', label: 'Natural Calamity' },
    { value: 'law_order', label: 'Law & Order Problem' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const processBulkExtension = async () => {
    if (!formData.reason || !formData.estimatedDeliveryDate || !formData.distanceLeft) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const results: any[] = [];

    // Simulate processing each bill
    for (let i = 0; i < selectedBills.length; i++) {
      const bill = selectedBills[i];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;
      
      results.push({
        ...bill,
        success,
        message: success ? 'Extended successfully' : 'Extension failed - Invalid bill state'
      });
      
      setProgress(((i + 1) / selectedBills.length) * 100);
    }

    setProcessedBills(results);
    setIsProcessing(false);
    setShowResults(true);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    toast({
      title: "Bulk Extension Complete",
      description: `${successCount} bills extended successfully, ${failureCount} failed`,
    });
  };

  const handleFinish = () => {
    onSuccess();
  };

  if (showResults) {
    const successCount = processedBills.filter(r => r.success).length;
    const failureCount = processedBills.length - successCount;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Bulk Extension Results</h1>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-md bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Successful</h3>
                  <p className="text-2xl font-bold text-green-600">{successCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Failed</h3>
                  <p className="text-2xl font-bold text-red-600">{failureCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Extension Results Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">eWay Bill No.</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {processedBills.map((bill, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-mono text-sm text-blue-600">
                        {bill.ewayBillNo}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                        {bill.vehicle}
                      </td>
                      <td className="py-3 px-4">
                        {bill.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {bill.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700">
            Finish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Extend eWay Bills</h1>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </div>

      <Card className="border-0 shadow-md bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Selected Bills for Extension</h3>
          <p className="text-sm text-blue-800">
            You have selected <strong>{selectedBills.length}</strong> eWay Bills for bulk extension.
            All selected bills will be extended with the same parameters.
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <ArrowUpRight className="mr-2 h-5 w-5" />
            Bulk Extension Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason for Extension <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(value) => handleInputChange('reason', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {extensionReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance-left">
                  Distance Left (km) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="distance-left"
                  type="number"
                  placeholder="Enter distance in kilometers"
                  value={formData.distanceLeft}
                  onChange={(e) => handleInputChange('distanceLeft', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-date">
                  Estimated Delivery Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="delivery-date"
                  type="date"
                  value={formData.estimatedDeliveryDate}
                  onChange={(e) => handleInputChange('estimatedDeliveryDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-time">Estimated Delivery Time</Label>
                <Input
                  id="delivery-time"
                  type="time"
                  value={formData.estimatedDeliveryTime}
                  onChange={(e) => handleInputChange('estimatedDeliveryTime', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter any additional remarks for all selected bills"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Processing {selectedBills.length} eWay Bills...
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="button"
                onClick={processBulkExtension}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : `Extend ${selectedBills.length} Bills`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Selected Bills Preview */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Selected Bills Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">eWay Bill No.</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Current Validity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Expiry Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedBills.map((bill, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-mono text-sm text-blue-600">
                      {bill.ewayBillNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                      {bill.vehicle}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {bill.validity}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        bill.hoursToExpiry <= 6 ? 'bg-red-100 text-red-800' :
                        bill.hoursToExpiry <= 24 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {bill.hoursToExpiry}h left
                      </span>
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

export default BulkExtend;
