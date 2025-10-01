import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CreateRequest = () => {
  const navigate = useNavigate();
  const [ritmNumber, setRitmNumber] = useState("");
  const [name, setName] = useState("");
  const [requestedDate, setRequestedDate] = useState<Date>();
  const [usedDate, setUsedDate] = useState<Date>();
  const [requestedTcodes, setRequestedTcodes] = useState("");
  const [reason, setReason] = useState("");
  const [activities, setActivities] = useState("");
  const [auditLog, setAuditLog] = useState<File | null>(null);
  const [cdhdrLog, setCdhdrLog] = useState<File | null>(null);
  const [cdposLog, setCdposLog] = useState<File | null>(null);

  const handleFileUpload = (file: File | null, setter: (file: File | null) => void) => {
    setter(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ritmNumber || !name || !requestedDate || !usedDate || !requestedTcodes || !reason || !activities) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      ritmNumber,
      name,
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
                  <Label htmlFor="ritm">RITM Number *</Label>
                  <Input
                    id="ritm"
                    value={ritmNumber}
                    onChange={(e) => setRitmNumber(e.target.value)}
                    placeholder="e.g., RITM0123456"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FileUploadCard
                    label="Audit Logs"
                    file={auditLog}
                    onFileSelect={(file) => handleFileUpload(file, setAuditLog)}
                  />
                  <FileUploadCard
                    label="CDHDR Logs"
                    file={cdhdrLog}
                    onFileSelect={(file) => handleFileUpload(file, setCdhdrLog)}
                  />
                  <FileUploadCard
                    label="CDPOS Logs"
                    file={cdposLog}
                    onFileSelect={(file) => handleFileUpload(file, setCdposLog)}
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

const FileUploadCard = ({
  label,
  file,
  onFileSelect,
}: {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}) => {
  return (
    <Card className="relative">
      <CardContent className="p-4">
        <Label className="text-sm font-medium mb-2 block">{label}</Label>
        {!file ? (
          <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">Click to upload</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) onFileSelect(selectedFile);
              }}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm truncate flex-1">{file.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileSelect(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateRequest;
