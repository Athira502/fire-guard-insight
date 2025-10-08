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
import { ArrowLeft, CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CreateRequest = () => {
  const navigate = useNavigate();
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
  const [auditLog, setAuditLog] = useState<File | null>(null);
  const [cdhdrLog, setCdhdrLog] = useState<File | null>(null);
  const [cdposLog, setCdposLog] = useState<File | null>(null);

  const [selectedAuditLog, setSelectedAuditLog] = useState<File | null>(null);
  const [selectedCdhdrLog, setSelectedCdhdrLog] = useState<File | null>(null);
  const [selectedCdposLog, setSelectedCdposLog] = useState<File | null>(null);

  const handleFileSelect = (file: File | null, setter: (file: File | null) => void) => {
    setter(file);
  };

  const handleFileUpload = (file: File | null, setter: (file: File | null) => void, uploadedSetter: (file: File | null) => void) => {
    if (file) {
      uploadedSetter(file);
      toast.success("File uploaded successfully");
    } else {
      toast.error("Please select a file first");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itsmNumber || !client || !system || !requestedFor || !requestedOnBehalfOf || !requestedDate || !usedDate || !requestedTcodes || !reason || !activities) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      analysisId: `AN-${Date.now().toString().slice(-8)}`,
      itsmNumber,
      client,
      system,
      requestedFor,
      requestedOnBehalfOf,
      requestedDate: requestedDate.toISOString(),
      usedDate: usedDate.toISOString(),
      requestedTcodes: requestedTcodes.split(",").map(t => t.trim()),
      reason,
      activities,
      hasAuditLog: !!auditLog,
      hasCdhdrLog: !!cdhdrLog,
      hasCdposLog: !!cdposLog,
    };

    const existingRequests = JSON.parse(localStorage.getItem("firefighterRequests") || "[]");
    localStorage.setItem("firefighterRequests", JSON.stringify([...existingRequests, newRequest]));

    toast.success("Request created successfully");
    navigate("/requests");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Select value={client} onValueChange={setClient} required>
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
                  <Select value={system} onValueChange={setSystem} required>
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
                        className="pointer-events-auto"
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
                        className="pointer-events-auto"
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
                  placeholder="e.g., SU01, SU53, PFCG (comma-separated)"
                  required
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
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Logs</h3>
                
                <div className="space-y-3">
                  <FileUploadRow
                    label="Audit Logs"
                    selectedFile={selectedAuditLog}
                    uploadedFile={auditLog}
                    onFileSelect={(file) => handleFileSelect(file, setSelectedAuditLog)}
                    onFileUpload={() => handleFileUpload(selectedAuditLog, setAuditLog, setAuditLog)}
                  />
                  <FileUploadRow
                    label="CDHDR Logs"
                    selectedFile={selectedCdhdrLog}
                    uploadedFile={cdhdrLog}
                    onFileSelect={(file) => handleFileSelect(file, setSelectedCdhdrLog)}
                    onFileUpload={() => handleFileUpload(selectedCdhdrLog, setCdhdrLog, setCdhdrLog)}
                  />
                  <FileUploadRow
                    label="CDPOS Logs"
                    selectedFile={selectedCdposLog}
                    uploadedFile={cdposLog}
                    onFileSelect={(file) => handleFileSelect(file, setSelectedCdposLog)}
                    onFileUpload={() => handleFileUpload(selectedCdposLog, setCdposLog, setCdposLog)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Submit Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
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
  uploadedFile,
  onFileSelect,
  onFileUpload,
}: {
  label: string;
  selectedFile: File | null;
  uploadedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onFileUpload: () => void;
}) => {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Label className="text-sm font-medium w-32 flex-shrink-0">{label}</Label>
      
      <div className="flex-1">
        <label className="cursor-pointer">
          <Button variant="outline" size="sm" type="button" asChild>
            <span>Choose File</span>
          </Button>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
        </label>
      </div>

      <div className="flex-1">
        {selectedFile && (
          <span className="text-sm text-muted-foreground truncate block">
            {selectedFile.name}
          </span>
        )}
      </div>

      <Button
        variant="default"
        size="sm"
        type="button"
        onClick={onFileUpload}
        disabled={!selectedFile}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload File
      </Button>

      {uploadedFile && (
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            onFileSelect(null);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CreateRequest;
