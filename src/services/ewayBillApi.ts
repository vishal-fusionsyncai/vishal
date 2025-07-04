
const API_BASE_URL = 'https://apisandbox.whitebooks.in/ewaybillapi/v1.03';

const API_CONFIG = {
  email: 'vishal.fusionsyncai@gmail.com',
  username: 'BVMGSP',
  password: 'Wbooks@0142',
  ip_address: '49.37.135.42',
  client_id: 'EWBS02467ad4-8f7e-4439-86fc-21bb168136d7',
  client_secret: 'EWBS9462e396-2371-4b73-97c0-e9c9b372f132',
  gstin: '29AAGCB1286Q000'
};

const getHeaders = () => ({
  'accept': '*/*',
  'ip_address': API_CONFIG.ip_address,
  'client_id': API_CONFIG.client_id,
  'client_secret': API_CONFIG.client_secret,
  'gstin': API_CONFIG.gstin,
  'Content-Type': 'application/json'
});

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface EwayBillData {
  ewayBillNo: string;
  vehicle: string;
  validity: string;
  hoursToExpiry: number;
  fromPlace?: string;
  fromState?: number;
  remainingDistance?: number;
}

export interface ExtendEwayBillRequest {
  ewbNo: number;
  vehicleNo: string;
  fromPlace: string;
  fromState: number;
  remainingDistance: number;
  transDocNo: string;
  transDocDate: string;
  transMode: string;
  extnRsnCode: number;
  extnRemarks: string;
  fromPincode: number;
  consignmentStatus: string;
  transitType?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
}

export interface UpdateVehicleRequest {
  ewbNo: number;
  vehicleNo: string;
  fromPlace: string;
  fromState: number;
  reasonCode: string;
  reasonRem: string;
  transDocNo: string;
  transDocDate: string;
  transMode: string;
}

export const ewayBillApi = {
  // Authentication
  async authenticate(): Promise<AuthResponse> {
    try {
      const url = `${API_BASE_URL}/authenticate?email=${encodeURIComponent(API_CONFIG.email)}&username=${API_CONFIG.username}&password=${encodeURIComponent(API_CONFIG.password)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, ...data };
    } catch (error) {
      console.error('Authentication error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  },

  // Get eWay Bill details
  async getEwayBill(ewbNo: string): Promise<EwayBillData | null> {
    try {
      const url = `${API_BASE_URL}/ewayapi/getewaybill?email=${encodeURIComponent(API_CONFIG.email)}&ewbNo=${ewbNo}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch eWay Bill: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to our format
      return {
        ewayBillNo: data.ewbNo || ewbNo,
        vehicle: data.vehicleNo || '',
        validity: data.validUpto || '',
        hoursToExpiry: data.hoursToExpiry || 0,
        fromPlace: data.fromPlace || '',
        fromState: data.fromState || 0,
        remainingDistance: data.remainingDistance || 0
      };
    } catch (error) {
      console.error('Get eWay Bill error:', error);
      return null;
    }
  },

  // Extend eWay Bill validity
  async extendEwayBill(requestData: ExtendEwayBillRequest): Promise<boolean> {
    try {
      const url = `${API_BASE_URL}/ewayapi/extendvalidity?email=${encodeURIComponent(API_CONFIG.email)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Failed to extend eWay Bill: ${response.status}`);
      }

      const data = await response.json();
      return data.success !== false;
    } catch (error) {
      console.error('Extend eWay Bill error:', error);
      return false;
    }
  },

  // Update vehicle details (Part B)
  async updateVehicle(requestData: UpdateVehicleRequest): Promise<boolean> {
    try {
      const url = `${API_BASE_URL}/ewayapi/vehewb?email=${encodeURIComponent(API_CONFIG.email)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update vehicle: ${response.status}`);
      }

      const data = await response.json();
      return data.success !== false;
    } catch (error) {
      console.error('Update vehicle error:', error);
      return false;
    }
  },

  // Bulk extend multiple eWay Bills
  async bulkExtendEwayBills(bills: EwayBillData[], extensionData: {
    currentPincode: string;
    currentPlace: string;
    remainingKm: string;
    reason: string;
    remarks: string;
  }): Promise<{ success: boolean; results: Array<{ ewbNo: string; success: boolean; error?: string }> }> {
    const results = [];
    
    for (const bill of bills) {
      try {
        const requestData: ExtendEwayBillRequest = {
          ewbNo: parseInt(bill.ewayBillNo),
          vehicleNo: bill.vehicle,
          fromPlace: extensionData.currentPlace,
          fromState: 29, // Default state
          remainingDistance: parseInt(extensionData.remainingKm),
          transDocNo: '12', // Default
          transDocDate: new Date().toLocaleDateString('en-GB'),
          transMode: '1', // Default
          extnRsnCode: parseInt(extensionData.reason),
          extnRemarks: extensionData.remarks,
          fromPincode: parseInt(extensionData.currentPincode),
          consignmentStatus: 'M',
          transitType: '',
          addressLine1: '',
          addressLine2: '',
          addressLine3: ''
        };

        const success = await this.extendEwayBill(requestData);
        results.push({
          ewbNo: bill.ewayBillNo,
          success
        });
      } catch (error) {
        results.push({
          ewbNo: bill.ewayBillNo,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    return {
      success: successCount > 0,
      results
    };
  }
};
