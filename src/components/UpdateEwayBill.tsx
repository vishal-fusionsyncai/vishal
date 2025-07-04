
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UpdateEwayBill = () => {
  const [formData, setFormData] = useState({
    ewayBillNo: '',
    updateType: '',
    newVehicleNumber: '',
    transporterDocNumber: '',
    transporterName: '',
    reason: '',
    remarks: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateTypes = [
    { value: 'vehicle', label: 'Update Vehicle Number' },
    { value: 'transporter', label: 'Update Transporter Details' },
    { value: 'both', label: 'Update Both Vehicle & Transporter' }
  ];

  const updateReasons = [
    { value: 'vehicle_change', label: 'Vehicle Change' },
    { value: 'breakdown', label: 'Vehicle Breakdown' },
    { value: 'transporter_change', label: 'Transporter Change' },
    { value: 'route_change', label: 'Route Change' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!formData.ewayBillNo || !formData.updateType || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if ((formData.updateType === 'vehicle' || formData.updateType === 'both') && !formData.newVehicleNumber) {
      toast({
        title: "Error",
        description: "Vehicle number is required for vehicle update",
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
        description: "eWay Bill updated successfully",
      });
      
      // Reset form
      setFormData({
        ewayBillNo: '',
        updateType: '',
        newVehicleNumber: '',
        transporterDocNumber: '',
        transporterName: '',
        reason: '',
        remarks: ''
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Update eWay Bill</h1>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Edit className="mr-2 h-5 w-5" />
            Update Form
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
                <Label htmlFor="update-type">
                  Update Type <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.updateType} 
                  onValueChange={(value) => handleInputChange('updateType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select update type" />
                  </SelectTrigger>
                  <SelectContent>
                    {updateTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.updateType === 'vehicle' || formData.updateType === 'both') && (
                <div className="space-y-2">
                  <Label htmlFor="new-vehicle-number">
                    New Vehicle Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-vehicle-number"
                    placeholder="Enter new vehicle number"
                    value={formData.newVehicleNumber}
                    onChange={(e) => handleInputChange('newVehicleNumber', e.target.value)}
                    className="font-mono"
                  />
                </div>
              )}

              {(formData.updateType === 'transporter' || formData.updateType === 'both') && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="transporter-name">Transporter Name</Label>
                    <Input
                      id="transporter-name"
                      placeholder="Enter transporter name"
                      value={formData.transporterName}
                      onChange={(e) => handleInputChange('transporterName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transporter-doc">Transporter Document Number</Label>
                    <Input
                      id="transporter-doc"
                      placeholder="Enter transporter document number"
                      value={formData.transporterDocNumber}
                      onChange={(e) => handleInputChange('transporterDocNumber', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason for Update <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(value) => handleInputChange('reason', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {updateReasons.map((reason) => (
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
                onClick={handleUpdate}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isLoading ? "Updating..." : "Update eWay Bill"}
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
      <Card className="border-0 shadow-md bg-green-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-green-900 mb-2">Update Guidelines</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Vehicle number can be updated multiple times</li>
            <li>• Transporter details can be updated when changing transporters</li>
            <li>• Valid reason must be provided for each update</li>
            <li>• Updates should be done in real-time for accuracy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateEwayBill;
