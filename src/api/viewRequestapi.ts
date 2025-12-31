

const BASE_URL = "http://localhost:8080";



export interface RequestListItem {
  analysisId: string;
  itsmNumber: string;
  client: string;
  system: string;
  requestedFor: string;
  requestedDate: string;
  usedDate: string;
}

export interface RequestDetails {
  analysisId: string;
  itsmNumber: string;
  client: string;
  system: string;
  requestedFor: string;
  requestedOnBehalfOf: string;
  requestedDate: string;
  usedDate: string;
  tcodes: string;
  reason: string;
  activities: string;
  transactionUsage: TransactionUsage[];
  auditLogs: AuditLog[];
  changeDocLogs: ChangeDocLog[];
  aiInsights: AIInsights;
}

export interface TransactionUsage {
  timestamp: string;
  transaction: string;
  description: string;
  user: string;
  client: string;
  system: string;
}

export interface AuditLog {
  timestamp: string;
  action: string;
  terminal: string;
  object: string;
  program: string;
  details: string;
}

export interface ChangeDocLog {
  timestamp: string;
  table: string;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
}

export interface AIInsights {
  activityAlignment: number;
  ownership: string;
  justification: string;
  riskScore: number;
  redFlags: string[];
  recommendations: string[];
  keyInsights: string[];
}

export interface CreateRequestPayload {
  itsmNumber: string;
  client: string;
  system: string;
  requestedFor: string;
  requested_on_behalfof: string;
  requestedDate: string;
  usedDate: string;
  tcodes: string;
  reason: string;
  activities_to_be_performed: string;
}

export interface CreateRequestResponse {
  analysisID: string;
  itsmNumber: string;
  client: string;
  system: string;
  requestedFor: string;
  requested_on_behalfof: string;
  requestedDate: string;
  usedDate: string;
  tcodes: string;
  reason: string;
  activities_to_be_performed: string;
}

// ==================== API FUNCTIONS ====================

/**
 * Get all firefighter requests
 */
export const getAllRequests = async (): Promise<RequestListItem[]> => {
  try {
    console.log('Fetching all requests...');
    const response = await fetch(`${BASE_URL}/api/firefighter/requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch requests: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Requests fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

/**
 * Get detailed information for a specific request including all logs and analysis
 */
export const getRequestDetails = async (analysisId: string): Promise<RequestDetails> => {
  try {
    console.log('Fetching request details for:', analysisId);
    const response = await fetch(`${BASE_URL}/api/firefighter/request/${analysisId}/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch request details: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Request details fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching request details:', error);
    throw error;
  }
};

/**
 * Get basic request information
 */
export const getRequestById = async (analysisId: string): Promise<CreateRequestResponse> => {
  try {
    console.log('Fetching request by ID:', analysisId);
    const response = await fetch(`${BASE_URL}/api/firefighter/request/${analysisId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch request: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Request fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching request:', error);
    throw error;
  }
};

/**
 * Create a new firefighter request
 */
export const createRequest = async (payload: CreateRequestPayload): Promise<CreateRequestResponse> => {
  try {
    console.log('Creating request with payload:', payload);
    
    const response = await fetch(`${BASE_URL}/api/firefighter/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to create request: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Request created:', data);
    return data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

/**
 * Upload SM20 audit log
 */
export const uploadSM20Log = async (requestId: string, file: File): Promise<string> => {
  try {
    console.log('Uploading SM20 log for request:', requestId);
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/api/firefighter/sm20-log/${requestId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload SM20 log');
    }

    return response.text();
  } catch (error) {
    console.error('Error uploading SM20 log:', error);
    throw error;
  }
};

/**
 * Upload transaction usage log
 */
export const uploadTransactionLog = async (requestId: string, file: File): Promise<string> => {
  try {
    console.log('Uploading transaction log for request:', requestId);
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/api/firefighter/transaction-log/${requestId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload transaction log');
    }

    return response.text();
  } catch (error) {
    console.error('Error uploading transaction log:', error);
    throw error;
  }
};

/**
 * Upload CDHDR file
 */
export const uploadCDHDR = async (analysisId: string, file: File): Promise<any> => {
  try {
    console.log('Uploading CDHDR for analysis:', analysisId);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('analysisId', analysisId);

    const response = await fetch(`${BASE_URL}/api/cdhdr-cdpos/upload-cdhdr`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload CDHDR file');
    }

    return data;
  } catch (error) {
    console.error('Error uploading CDHDR:', error);
    throw error;
  }
};

/**
 * Upload CDPOS file
 */
export const uploadCDPOS = async (analysisId: string, file: File): Promise<any> => {
  try {
    console.log('Uploading CDPOS for analysis:', analysisId);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('analysisId', analysisId);

    const response = await fetch(`${BASE_URL}/api/cdhdr-cdpos/upload-cdpos`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 412) {
        throw new Error(data.hint || 'Please upload CDHDR file first');
      }
      throw new Error(data.error || 'Failed to upload CDPOS file');
    }

    return data;
  } catch (error) {
    console.error('Error uploading CDPOS:', error);
    throw error;
  }
};

/**
 * Trigger analysis for a request
 */
export const analyzeRequest = async (requestId: string): Promise<any> => {
  try {
    console.log('Triggering analysis for request:', requestId);
    
    const response = await fetch(`${BASE_URL}/api/analysis/analyze/${requestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || errorData?.error || 'Failed to analyze request');
    }

    const result = await response.json();
    console.log('Analysis completed:', result);
    return result;
  } catch (error) {
    console.error('Error analyzing request:', error);
    throw error;
  }
};

export default {
  getAllRequests,
  getRequestDetails,
  getRequestById,
  createRequest,
  uploadSM20Log,
  uploadTransactionLog,
  uploadCDHDR,
  uploadCDPOS,
  analyzeRequest,
};