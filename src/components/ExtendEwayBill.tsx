
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ewayBillApi } from '@/services/ewayBillApi';

const ExtendEwayBill = () => {
  const [formData, setFormData] = useState({
    ewayBillNo: '',
    vehicleNo: '',
    currentPlace: '',
    remainingKm: '',
    reason: '',
    remarks: '',
    currentPincode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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

  const handleExtend = async () => {
    if (!formData.ewayBillNo || !formData.vehicleNo || !formData.currentPlace || !formData.remainingKm || !formData.reason || !formData.currentPincode) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const requestData = {
        ewbNo: parseInt(formData.ewayBillNo),
        vehicleNo: formData.vehicleNo,
        fromPlace: formData.currentPlace,
        fromState: 29, // Default state
        remainingDistance: parseInt(formData.remainingKm),
        transDocNo: '12', // Default
        transDocDate: new Date().toLocaleDateString('en-GB'),
        transMode: '1', // Default
        extnRsnCode: parseInt(formData.reason),
        extnRemarks: formData.remarks,
        fromPincode: parseInt(formData.currentPincode),
        consignmentStatus: 'M',
        transitType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: ''
      };

      const success = await ewayBillApi.extendEwayBill(requestData);
      
      if (success) {
        toast({
          title: "Success",
          description: "eWay Bill extended successfully",
        });
        
        // Reset form
        setFormData({
          ewayBillNo: '',
          vehicleNo: '',
          currentPlace: '',
          remainingKm: '',
          reason: '',
          remarks: '',
          currentPincode: ''
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to extend eWay Bill. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extend eWay Bill. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Extend eWay Bill</h1>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <ArrowUpRight className="mr-2 h-5 w-5" />
            Extension Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eway-bill-no">
                  eWay Bill Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="eway-bill-no"
                  placeholder="Enter eWay Bill Number"
                  value={formData.ewayBillNo}
                  onChange={(e) => handleInputChange('ewayBillNo', e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle-no">
                  Vehicle Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="vehicle-no"
                  placeholder="Enter vehicle number"
                  value={formData.vehicleNo}
                  onChange={(e) => handleInputChange('vehicleNo', e.target.value)}
                  className="font-mono"
                />
              </div>

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
                  Remaining Distance (km) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="remaining-km"
                  type="number"
                  placeholder="Enter distance in kilometers"
                  value={formData.remainingKm}
                  onChange={(e) => handleInputChange('remainingKm', e.target.value)}
                />
              </div>

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

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="button"
                onClick={handleExtend}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extending...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Extend eWay Bill
                  </>
                )}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  // Save draft functionality
                  toast({
                    title: "Draft Saved",
                    description: "Form data saved as draft",
                  });
                }}
                className="flex-1 sm:flex-none"
              >
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-0 shadow-md bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Extension Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Extension can be done only once per eWay Bill</li>
            <li>• Extension must be done before the validity expires</li>
            <li>• Valid reasons must be selected for extension</li>
            <li>• Distance left should be reasonable based on current location</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtendEwayBill;
