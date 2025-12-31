

const BASE_URL = "http://localhost:8080";

export const API = {
  CREATE_REQUEST: `${BASE_URL}/api/firefighter/request`,
  UPLOAD_SM20_LOG: (requestId: string) => `${BASE_URL}/api/firefighter/sm20-log/${requestId}`,
  UPLOAD_TRANSACTION_LOG: (requestId: string) => `${BASE_URL}/api/firefighter/transaction-log/${requestId}`,
  GET_REQUEST_BY_ID: (id: string) => `${BASE_URL}/api/firefighter/request/${id}`,
  
  // CDHDR-CDPOS endpoints
  UPLOAD_CDHDR: `${BASE_URL}/api/cdhdr-cdpos/upload-cdhdr`,
  UPLOAD_CDPOS: `${BASE_URL}/api/cdhdr-cdpos/upload-cdpos`,
  GET_UPLOAD_STATS: (analysisId: string) => `${BASE_URL}/api/cdhdr-cdpos/stats?analysisId=${analysisId}`,
  
  // Analysis endpoint
  ANALYZE_REQUEST: (id: string) => `${BASE_URL}/api/analysis/analyze/${id}`
};

// Type Definitions matching backend model
export interface RequestPayload {
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

export interface RequestResponse {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  recordsUploaded?: number;
  recordsMatched?: number;
  analysisId?: string;
  nextStep?: string;
  timestamp?: number;
  error?: string;
  errorType?: string;
  hint?: string;
}

export interface UploadStats {
  success: boolean;
  analysisId: string;
  statistics: {
    cdhdrRecords: number;
    cdposRecords: number;
    matchedRecords: number;
    unmatchedRecords: number;
  };
  timestamp: number;
}

/**
 * Create a new firefighter request
 */
export const createRequest = async (payload: RequestPayload): Promise<RequestResponse> => {
  try {
    console.log('=== Creating Request ===');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(API.CREATE_REQUEST, {
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
      throw new Error(`Failed to create request: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Request created successfully:', data);
    console.log('Analysis ID:', data.analysisID);
    return data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

/**
 * Get request by ID
 */
export const getRequestById = async (requestId: string): Promise<RequestResponse> => {
  try {
    console.log('Fetching request:', requestId);
    const response = await fetch(API.GET_REQUEST_BY_ID(requestId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch request: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching request:', error);
    throw error;
  }
};

/**
 * Upload SM20 audit log for a request
 */
export const uploadSM20Log = async (requestId: string, file: File): Promise<string> => {
  try {
    console.log('=== Uploading SM20 Log ===');
    console.log('Request ID:', requestId);
    console.log('File:', file.name, file.size, 'bytes');
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API.UPLOAD_SM20_LOG(requestId), {
      method: 'POST',
      body: formData,
    });

    console.log('SM20 upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SM20 upload error:', errorText);
      throw new Error(errorText || 'Failed to upload SM20 log');
    }

    const result = await response.text();
    console.log('SM20 upload success:', result);
    return result;
  } catch (error) {
    console.error('Error uploading SM20 log:', error);
    throw error;
  }
};

/**
 * Upload transaction usage log for a request
 */
export const uploadTransactionLog = async (requestId: string, file: File): Promise<string> => {
  try {
    console.log('=== Uploading Transaction Log ===');
    console.log('Request ID:', requestId);
    console.log('File:', file.name, file.size, 'bytes');
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API.UPLOAD_TRANSACTION_LOG(requestId), {
      method: 'POST',
      body: formData,
    });

    console.log('Transaction log upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Transaction log upload error:', errorText);
      throw new Error(errorText || 'Failed to upload transaction log');
    }

    const result = await response.text();
    console.log('Transaction log upload success:', result);
    return result;
  } catch (error) {
    console.error('Error uploading transaction log:', error);
    throw error;
  }
};

/**
 * Upload CDHDR file (must be uploaded before CDPOS)
 */
export const uploadCDHDR = async (analysisId: string, file: File): Promise<FileUploadResponse> => {
  try {
    console.log('=== Uploading CDHDR ===');
    console.log('Analysis ID:', analysisId);
    console.log('File:', file.name, file.size, 'bytes');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('analysisId', analysisId);

    const response = await fetch(API.UPLOAD_CDHDR, {
      method: 'POST',
      body: formData,
    });

    console.log('CDHDR upload response status:', response.status);

    const data = await response.json();
    console.log('CDHDR upload response:', data);

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
 * Upload CDPOS file (must be uploaded after CDHDR)
 */
export const uploadCDPOS = async (analysisId: string, file: File): Promise<FileUploadResponse> => {
  try {
    console.log('=== Uploading CDPOS ===');
    console.log('Analysis ID:', analysisId);
    console.log('File:', file.name, file.size, 'bytes');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('analysisId', analysisId);

    const response = await fetch(API.UPLOAD_CDPOS, {
      method: 'POST',
      body: formData,
    });

    console.log('CDPOS upload response status:', response.status);

    const data = await response.json();
    console.log('CDPOS upload response:', data);

    if (!response.ok) {
      if (response.status === 412) {
        throw new Error(data.hint || 'Please upload CDHDR file first before uploading CDPOS');
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
 * Get upload statistics for an analysis
 */
export const getUploadStats = async (analysisId: string): Promise<UploadStats> => {
  try {
    const response = await fetch(API.GET_UPLOAD_STATS(analysisId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to fetch upload statistics');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching upload stats:', error);
    throw error;
  }
};

/**
 * Trigger analysis for a request
 */
export const analyzeRequest = async (requestId: string): Promise<any> => {
  try {
    console.log('=== Triggering Analysis ===');
    console.log('Request ID:', requestId);
    
    const response = await fetch(API.ANALYZE_REQUEST(requestId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Analysis response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Analysis error:', errorData);
      throw new Error(errorData?.message || errorData?.error || 'Failed to analyze request');
    }

    const result = await response.json();
    console.log('Analysis result:', result);
    return result;
  } catch (error) {
    console.error('Error analyzing request:', error);
    throw error;
  }
};

export default {
  createRequest,
  getRequestById,
  uploadSM20Log,
  uploadTransactionLog,
  uploadCDHDR,
  uploadCDPOS,
  getUploadStats,
  analyzeRequest,
};