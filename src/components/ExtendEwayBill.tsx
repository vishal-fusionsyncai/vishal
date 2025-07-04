
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExtendEwayBill = () => {
  const [formData, setFormData] = useState({
    ewayBillNo: '',
    reason: '',
    estimatedDeliveryDate: '',
    estimatedDeliveryTime: '',
    distanceLeft: '',
    vehicleNumber: '',
    transporterDocNumber: '',
    remarks: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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

  const handleExtend = async () => {
    if (!formData.ewayBillNo || !formData.reason || !formData.estimatedDeliveryDate || !formData.distanceLeft) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "eWay Bill extended successfully",
      });
      
      // Reset form
      setFormData({
        ewayBillNo: '',
        reason: '',
        estimatedDeliveryDate: '',
        estimatedDeliveryTime: '',
        distanceLeft: '',
        vehicleNumber: '',
        transporterDocNumber: '',
        remarks: ''
      });
    }, 1500);
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
                <Label htmlFor="vehicle-number">Vehicle Number</Label>
                <Input
                  id="vehicle-number"
                  placeholder="Enter vehicle number"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="transporter-doc">Transporter Document Number</Label>
                <Input
                  id="transporter-doc"
                  placeholder="Enter transporter document number"
                  value={formData.transporterDocNumber}
                  onChange={(e) => handleInputChange('transporterDocNumber', e.target.value)}
                />
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
                <ArrowUpRight className="mr-2 h-4 w-4" />
                {isLoading ? "Extending..." : "Extend eWay Bill"}
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
