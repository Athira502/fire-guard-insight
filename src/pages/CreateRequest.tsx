

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CalendarIcon, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  createRequest, 
  uploadSM20Log, 
  uploadTransactionLog, 
  uploadCDHDR, 
  uploadCDPOS,
  analyzeRequest 
} from "../api/requestService";

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadState {
  sm20: UploadStatus;
  transaction: UploadStatus;
  cdhdr: UploadStatus;
  cdpos: UploadStatus;
  analysis: UploadStatus;
}

const CreateRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
 
  const [itsmNumber, setItsmNumber] = useState("");
  const [client, setClient] = useState("");
  const [system, setSystem] = useState("");
  const [requestedFor, setRequestedFor] = useState("");
  const [requestedOnBehalfOf, setRequestedOnBehalfOf] = useState("");
  const [requestedDate, setRequestedDate] = useState<Date>();
  const [usedDate, setUsedDate] = useState<Date>();
  const [requestedTcodes, setRequestedTcodes] = useState("");
  const [reason, setReason] = useState("");
  const [activities, setActivities] = useState("");

  const [sm20Log, setSm20Log] = useState<File | null>(null);
  const [transactionUsageLog, setTransactionUsageLog] = useState<File | null>(null);
  const [cdhdrLog, setCdhdrLog] = useState<File | null>(null);
  const [cdposLog, setCdposLog] = useState<File | null>(null);

  const [uploadStatus, setUploadStatus] = useState<UploadState>({
    sm20: 'pending',
    transaction: 'pending',
    cdhdr: 'pending',
    cdpos: 'pending',
    analysis: 'pending'
  });

  const updateUploadStatus = (key: keyof UploadState, status: UploadStatus) => {
    setUploadStatus(prev => ({ ...prev, [key]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itsmNumber || !client || !system || !requestedFor || !requestedOnBehalfOf || 
        !requestedDate || !usedDate || !requestedTcodes || !reason || !activities) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      
      console.log("===== STEP 1: Creating Request =====");
      const requestPayload = {
        itsmNumber,
        client,
        system,
        requestedFor,
        requested_on_behalfof: requestedOnBehalfOf,
        requestedDate: format(requestedDate, "yyyy-MM-dd"),
        usedDate: format(usedDate, "yyyy-MM-dd"),
        tcodes: requestedTcodes,
        reason,
        activities_to_be_performed: activities,
      };

      const createdRequest = await createRequest(requestPayload);
      const analysisId = createdRequest.analysisID;
      
      toast.success(`Request created: ${analysisId}`);
      console.log("Request created with ID:", analysisId);

      let hasUploadErrors = false;
      let cdhdrUploadSuccess = false;

      
      if (sm20Log) {
        console.log("===== STEP 2: Uploading SM20 Log =====");
        updateUploadStatus('sm20', 'uploading');
        try {
          await uploadSM20Log(analysisId, sm20Log);
          updateUploadStatus('sm20', 'success');
          toast.success("✓ SM20 log uploaded");
          console.log("SM20 log uploaded successfully");
        } catch (err: any) {
          hasUploadErrors = true;
          updateUploadStatus('sm20', 'error');
          toast.error(`✗ SM20 log failed: ${err.message}`);
          console.error("SM20 upload error:", err);
        }
      }

     
      if (transactionUsageLog) {
        console.log("===== STEP 3: Uploading Transaction Log =====");
        updateUploadStatus('transaction', 'uploading');
        try {
          await uploadTransactionLog(analysisId, transactionUsageLog);
          updateUploadStatus('transaction', 'success');
          toast.success("✓ Transaction log uploaded");
          console.log("Transaction log uploaded successfully");
        } catch (err: any) {
          hasUploadErrors = true;
          updateUploadStatus('transaction', 'error');
          toast.error(`✗ Transaction log failed: ${err.message}`);
          console.error("Transaction log upload error:", err);
        }
      }

     
       if (cdhdrLog) {
        console.log("===== STEP 4: Uploading CDHDR =====");
        updateUploadStatus('cdhdr', 'uploading');
        try {
          const response = await uploadCDHDR(analysisId, cdhdrLog);
          updateUploadStatus('cdhdr', 'success');
          cdhdrUploadSuccess = true; 
          toast.success(`✓ CDHDR uploaded: ${response.recordsUploaded} records`);
          console.log("CDHDR uploaded successfully:", response);
        } catch (err: any) {
          hasUploadErrors = true;
          updateUploadStatus('cdhdr', 'error');
          toast.error(`✗ CDHDR failed: ${err.message}`);
          console.error("CDHDR upload error:", err);
        }
      }
      
      if (cdposLog && cdhdrLog) {
        if (cdhdrUploadSuccess) {
          console.log("===== STEP 5: Uploading CDPOS =====");
          updateUploadStatus('cdpos', 'uploading');
          try {
            const response = await uploadCDPOS(analysisId, cdposLog);
            updateUploadStatus('cdpos', 'success');
            toast.success(`✓ CDPOS uploaded: ${response.recordsMatched} records`);
            console.log("CDPOS uploaded successfully:", response);
          } catch (err: any) {
            hasUploadErrors = true;
            updateUploadStatus('cdpos', 'error');
            toast.error(`✗ CDPOS failed: ${err.message}`);
            console.error("CDPOS upload error:", err);
          }
        } else {
          toast.warning("⚠ CDPOS skipped: CDHDR upload failed");
          console.log("CDPOS upload skipped - CDHDR failed");
        }
      } else if (cdposLog && !cdhdrLog) {
        toast.warning("⚠ CDPOS skipped: Upload CDHDR first");
        console.log("CDPOS upload skipped - no CDHDR file");
      }
      
      console.log("===== STEP 6: Triggering Analysis =====");
      if (!hasUploadErrors) {
        updateUploadStatus('analysis', 'uploading');
        try {
          toast.info("🔍 Starting analysis...");
          const analysisResult = await analyzeRequest(analysisId);
          updateUploadStatus('analysis', 'success');
          toast.success("✓ Analysis completed!");
          console.log("Analysis completed successfully:", analysisResult);
        } catch (err: any) {
          updateUploadStatus('analysis', 'error');
          toast.error(`✗ Analysis failed: ${err.message}`);
          console.error("Analysis error:", err);
        }
      } else {
        toast.warning("⚠ Analysis skipped due to upload errors");
        console.log("Analysis skipped - upload errors detected");
      }

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error: any) {
      console.error("===== REQUEST CREATION FAILED =====");
      console.error("Error:", error);
      toast.error(error.message || "Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Create Firefighter Request
            </CardTitle>
            <CardDescription>
              Fill in the details for your firefighter access request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="itsm">ITSM Number *</Label>
                  <Input
                    id="itsm"
                    value={itsmNumber}
                    onChange={(e) => setItsmNumber(e.target.value)}
                    placeholder="e.g., ITSM0123456"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select value={client} onValueChange={setClient} required disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tarento">Tarento</SelectItem>
                      <SelectItem value="Implema">Implema</SelectItem>
                      <SelectItem value="ATOS">ATOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system">System *</Label>
                  <Select value={system} onValueChange={setSystem} required disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ECC">ECC</SelectItem>
                      <SelectItem value="S4HANA">S4HANA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedFor">Requested For *</Label>
                  <Input
                    id="requestedFor"
                    value={requestedFor}
                    onChange={(e) => setRequestedFor(e.target.value)}
                    placeholder="Who is this request for"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedOnBehalfOf">Requested On Behalf Of *</Label>
                  <Input
                    id="requestedOnBehalfOf"
                    value={requestedOnBehalfOf}
                    onChange={(e) => setRequestedOnBehalfOf(e.target.value)}
                    placeholder="On behalf of whom"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Requested Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !requestedDate && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {requestedDate ? format(requestedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={requestedDate}
                        onSelect={setRequestedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Used Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !usedDate && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {usedDate ? format(usedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={usedDate}
                        onSelect={setUsedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tcodes">Requested TCodes *</Label>
                <Input
                  id="tcodes"
                  value={requestedTcodes}
                  onChange={(e) => setRequestedTcodes(e.target.value)}
                  placeholder="e.g., SU01, SU53, PFCG"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Enter transaction codes separated by commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe the reason for this request"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activities">Activities to be Performed *</Label>
                <Textarea
                  id="activities"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="Detail the activities you plan to perform"
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Logs (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Files will be uploaded after request creation
                </p>
                
                <div className="space-y-3">
                  <FileUploadRow
                    label="SM20 Audit Logs"
                    selectedFile={sm20Log}
                    onFileSelect={setSm20Log}
                    disabled={isSubmitting}
                    status={uploadStatus.sm20}
                    statusIcon={getStatusIcon(uploadStatus.sm20)}
                  />
                  <FileUploadRow
                    label="Transaction Usage Logs"
                    selectedFile={transactionUsageLog}
                    onFileSelect={setTransactionUsageLog}
                    disabled={isSubmitting}
                    status={uploadStatus.transaction}
                    statusIcon={getStatusIcon(uploadStatus.transaction)}
                  />
                  <FileUploadRow
                    label="CDHDR Logs"
                    selectedFile={cdhdrLog}
                    onFileSelect={setCdhdrLog}
                    disabled={isSubmitting}
                    status={uploadStatus.cdhdr}
                    statusIcon={getStatusIcon(uploadStatus.cdhdr)}
                  />
                  <FileUploadRow
                    label="CDPOS Logs"
                    selectedFile={cdposLog}
                    onFileSelect={setCdposLog}
                    disabled={isSubmitting}
                    hint="Upload CDHDR first before CDPOS"
                    status={uploadStatus.cdpos}
                    statusIcon={getStatusIcon(uploadStatus.cdpos)}
                  />
                </div>

                {isSubmitting && (
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(uploadStatus.analysis)}
                      <span className="text-sm font-medium">
                        {uploadStatus.analysis === 'uploading' ? 'Running analysis...' : 
                         uploadStatus.analysis === 'success' ? 'Analysis completed' :
                         uploadStatus.analysis === 'error' ? 'Analysis failed' : 'Pending analysis'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const FileUploadRow = ({
  label,
  selectedFile,
  onFileSelect,
  disabled = false,
  hint,
  status,
  statusIcon
}: {
  label: string;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  hint?: string;
  status?: UploadStatus;
  statusIcon?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="flex-1">
        <Label className="text-sm font-medium block mb-1">{label}</Label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      
      <div className="flex items-center gap-3">
        {statusIcon && <div>{statusIcon}</div>}
        
        <label className="cursor-pointer">
          <Button variant="outline" size="sm" type="button" asChild disabled={disabled}>
            <span>Choose File</span>
          </Button>
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
        </label>

        {selectedFile && (
          <>
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {selectedFile.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => onFileSelect(null)}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateRequest;
