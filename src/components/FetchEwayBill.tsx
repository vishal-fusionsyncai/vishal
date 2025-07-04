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
import { Search, Calendar, Filter, Loader2 } from 'lucide-react';
import BulkExtend from './BulkExtend';
import { ewayBillApi, EwayBillData } from '@/services/ewayBillApi';
import { useToast } from '@/hooks/use-toast';

const FetchEwayBill = () => {
  const [ewayBills, setEwayBills] = useState<EwayBillData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBills, setFilteredBills] = useState<EwayBillData[]>([]);
  const [selectedBills, setSelectedBills] = useState<EwayBillData[]>([]);
  const [selectAll, setSelectAll] = useState<boolean | "indeterminate">(false);
  const [showBulkExtend, setShowBulkExtend] = useState(false);
  const [showTodaysExpiring, setShowTodaysExpiring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

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

  const handleFetchEwayBill = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter an eWay Bill number to search",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const billData = await ewayBillApi.getEwayBill(searchQuery.trim());
      
      if (billData) {
        // Check if bill already exists
        const existingBill = ewayBills.find(bill => bill.ewayBillNo === billData.ewayBillNo);
        if (!existingBill) {
          setEwayBills(prev => [...prev, billData]);
          toast({
            title: "Success",
            description: "eWay Bill fetched successfully",
          });
        } else {
          toast({
            title: "Info",
            description: "eWay Bill already exists in the list",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "eWay Bill not found or failed to fetch",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch eWay Bill. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetchEwayBill();
    }
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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Enter eWay Bill Number to fetch"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isSearching}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              </div>
              <Button 
                onClick={handleFetchEwayBill}
                disabled={isSearching || !searchQuery.trim()}
                className="min-w-[100px]"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Fetch'
                )}
              </Button>
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
            eWay Bill List ({ewayBills.length} total)
            {showTodaysExpiring && (
              <span className="text-sm font-normal text-orange-600 ml-2">
                (Today's Expiring - {filteredBills.length} bills)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading eWay Bills...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Your fetched eWay Bills.</TableCaption>
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
                        {ewayBills.length === 0 
                          ? "No eWay Bills fetched yet. Use the search above to fetch bills."
                          : showTodaysExpiring 
                            ? "No eWay Bills expiring today!" 
                            : "No eWay Bills found."
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
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
