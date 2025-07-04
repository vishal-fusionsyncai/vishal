
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ewayBillApi, EwayBillData } from '@/services/ewayBillApi';

interface BulkExtendProps {
  selectedBills: EwayBillData[];
  onBack: () => void;
  onSuccess: () => void;
}

const BulkExtend = ({ selectedBills, onBack, onSuccess }: BulkExtendProps) => {
  const [formData, setFormData] = useState({
    currentPincode: '',
    currentPlace: '',
    remainingKm: '',
    reason: '',
    remarks: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{ ewbNo: string; success: boolean; error?: string }> | null>(null);
  const { toast } = useToast();

  const extensionReasons = [
    { value: '1', label: 'Natural Calamity' },
    { value: '2', label: 'Law and Order Problem' },
    { value: '3', label: 'Accident' },
    { value: '4', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulkExtend = async () => {
    if (!formData.currentPincode || !formData.currentPlace || !formData.remainingKm || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await ewayBillApi.bulkExtendEwayBills(selectedBills, formData);
      setResults(response.results);
      
      const successCount = response.results.filter(r => r.success).length;
      const failureCount = response.results.length - successCount;
      
      if (successCount > 0) {
        toast({
          title: "Bulk Extension Completed",
          description: `Successfully extended ${successCount} eWay Bills${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
        });
      } else {
        toast({
          title: "Extension Failed",
          description: "All eWay Bills failed to extend. Please check the details and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process bulk extension. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setResults(null);
    setFormData({
      currentPincode: '',
      currentPlace: '',
      remainingKm: '',
      reason: '',
      remarks: ''
    });
  };

  if (results) {
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Extension Results</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {successCount > 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Extension Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-blue-800">Total Processed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-800">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{failureCount}</div>
                <div className="text-sm text-red-800">Failed</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Detailed Results:</h3>
              {results.map((result, index) => (
                <div
                  key={result.ewbNo}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-mono text-sm">{result.ewbNo}</span>
                  </div>
                  <span className={`text-xs ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Extended Successfully' : result.error || 'Extension Failed'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleStartOver} variant="outline">
                Extend More Bills
              </Button>
              <Button onClick={onSuccess}>
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Extend eWay Bills</h1>
      </div>

      {/* Selected Bills Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Bills ({selectedBills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedBills.map((bill) => (
              <div key={bill.ewayBillNo} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-mono text-sm font-semibold">{bill.ewayBillNo}</div>
                <div className="text-xs text-gray-600">{bill.vehicle}</div>
                <div className="text-xs text-orange-600">{bill.hoursToExpiry}h left</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Extension Form */}
      <Card>
        <CardHeader>
          <CardTitle>Extension Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current-pincode">
                  Current PIN Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="current-pincode"
                  placeholder="Enter current PIN code"
                  value={formData.currentPincode}
                  onChange={(e) => handleInputChange('currentPincode', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-place">
                  Current Place <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="current-place"
                  placeholder="Enter current place"
                  value={formData.currentPlace}
                  onChange={(e) => handleInputChange('currentPlace', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remaining-km">
                  Remaining KM <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="remaining-km"
                  type="number"
                  placeholder="Enter remaining distance in KM"
                  value={formData.remainingKm}
                  onChange={(e) => handleInputChange('remainingKm', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason <span className="text-red-500">*</span>
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter any additional remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="button"
                onClick={handleBulkExtend}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Extend All Bills
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkExtend;
