import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Calendar, Filter } from 'lucide-react';
import BulkExtend from './BulkExtend';

interface EwayBill {
  ewayBillNo: string;
  vehicle: string;
  validity: string;
  hoursToExpiry: number;
}

const FetchEwayBill = () => {
  const [ewayBills, setEwayBills] = useState<EwayBill[]>([
    { ewayBillNo: '123456789012', vehicle: 'MH04JK5678', validity: '2023-12-31 23:59:59', hoursToExpiry: 2 },
    { ewayBillNo: '234567890123', vehicle: 'GJ05LM9012', validity: '2024-01-01 00:00:00', hoursToExpiry: 25 },
    { ewayBillNo: '345678901234', vehicle: 'KA01AB3456', validity: '2024-01-02 12:00:00', hoursToExpiry: 72 },
    { ewayBillNo: '456789012345', vehicle: 'TN07XY6789', validity: '2024-01-03 18:00:00', hoursToExpiry: 96 },
    { ewayBillNo: '567890123456', vehicle: 'DL08RS0123', validity: '2024-01-04 06:00:00', hoursToExpiry: 120 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBills, setFilteredBills] = useState<EwayBill[]>(ewayBills);
  const [selectedBills, setSelectedBills] = useState<EwayBill[]>([]);
  const [selectAll, setSelectAll] = useState<boolean | "indeterminate">(false);
  const [showBulkExtend, setShowBulkExtend] = useState(false);
  const [showTodaysExpiring, setShowTodaysExpiring] = useState(false);

  useEffect(() => {
    let results = ewayBills.filter(bill =>
      bill.ewayBillNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showTodaysExpiring) {
      // Filter bills expiring today (within 24 hours)
      results = results.filter(bill => bill.hoursToExpiry <= 24);
    }

    setFilteredBills(results);
  }, [searchQuery, ewayBills, showTodaysExpiring]);

  useEffect(() => {
    if (filteredBills.length > 0) {
      const allSelected = filteredBills.every(bill => selectedBills.find(b => b.ewayBillNo === bill.ewayBillNo));
      const noneSelected = selectedBills.length === 0;

      if (allSelected) {
        setSelectAll(true);
      } else if (noneSelected) {
        setSelectAll(false);
      } else {
        setSelectAll("indeterminate");
      }
    } else {
      setSelectAll(false);
    }
  }, [selectedBills, filteredBills]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedBills([...filteredBills]);
    } else {
      setSelectedBills([]);
    }
  };

  const handleSelectBill = (bill: any, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedBills(prev => [...prev, bill]);
    } else {
      setSelectedBills(prev => prev.filter(b => b.ewayBillNo !== bill.ewayBillNo));
    }
  };

  const handleBulkExtend = () => {
    setShowBulkExtend(true);
  };

  const handleBackToSearch = () => {
    setShowBulkExtend(false);
  };

  const handleExtensionSuccess = () => {
    setShowBulkExtend(false);
    setSelectedBills([]);
    setSelectAll(false);
  };

  const handleTodaysExpiringFilter = () => {
    setShowTodaysExpiring(!showTodaysExpiring);
    setSelectedBills([]);
    setSelectAll(false);
  };

  if (showBulkExtend) {
    return (
      <BulkExtend
        selectedBills={selectedBills}
        onBack={handleBackToSearch}
        onSuccess={handleExtensionSuccess}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Search eWay Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by eWay Bill No. or Vehicle No."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            </div>
            
            {/* Filter for Today's Expiring Bills */}
            <div className="flex items-center gap-4">
              <Button
                variant={showTodaysExpiring ? "default" : "outline"}
                onClick={handleTodaysExpiringFilter}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {showTodaysExpiring ? "Show All Bills" : "Today's Expiring Only"}
              </Button>
              
              {showTodaysExpiring && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Filter className="h-4 w-4" />
                  Showing bills expiring within 24 hours
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            eWay Bill List 
            {showTodaysExpiring && (
              <span className="text-sm font-normal text-orange-600 ml-2">
                (Today's Expiring - {filteredBills.length} bills)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your recent eWay Bills.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>eWay Bill No.</TableHead>
                  <TableHead>Vehicle No.</TableHead>
                  <TableHead>Current Validity</TableHead>
                  <TableHead>Expiry Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow key={bill.ewayBillNo}>
                    <TableCell className="font-medium">
                      <Checkbox
                        checked={!!selectedBills.find(b => b.ewayBillNo === bill.ewayBillNo)}
                        onCheckedChange={(checked) => handleSelectBill(bill, checked)}
                        aria-label={`Select bill ${bill.ewayBillNo}`}
                      />
                    </TableCell>
                    <TableCell>{bill.ewayBillNo}</TableCell>
                    <TableCell>{bill.vehicle}</TableCell>
                    <TableCell>{bill.validity}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        bill.hoursToExpiry <= 6 ? 'bg-red-100 text-red-800' :
                        bill.hoursToExpiry <= 24 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {bill.hoursToExpiry}h left
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {showTodaysExpiring 
                        ? "No eWay Bills expiring today!" 
                        : "No eWay Bills found."
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleBulkExtend}
              disabled={selectedBills.length === 0}
            >
              Bulk Extend ({selectedBills.length})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FetchEwayBill;
