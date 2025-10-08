import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Request {
  id: string;
  analysisId: string;
  itsmNumber: string;
  client: string;
  system: string;
  requestedFor: string;
  requestedOnBehalfOf: string;
  requestedDate: string;
  usedDate: string;
  requestedTcodes: string[];
  reason: string;
  activities: string;
  hasAuditLog: boolean;
  hasCdhdrLog: boolean;
  hasCdposLog: boolean;
}

interface RequestDetailsModalProps {
  request: Request;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDetailsModal = ({ request, open, onOpenChange }: RequestDetailsModalProps) => {
  // Mock transaction usage data
  const transactionUsageData = [
    { timestamp: "2023-10-05 10:15:22", transaction: "FB01", description: "Post Document", user: "FF_FUNC_01", client: "800", system: "PROD-FIN" },
    { timestamp: "2023-10-05 10:18:43", transaction: "FB03", description: "Display Document", user: "FF_FUNC_01", client: "800", system: "PROD-FIN" },
    { timestamp: "2023-10-05 10:22:15", transaction: "SU01", description: "User Maintenance", user: "FF_SEC_02", client: "800", system: "PROD-FIN" },
    { timestamp: "2023-10-05 10:35:02", transaction: "PFCG", description: "Role Maintenance", user: "FF_SEC_02", client: "800", system: "PROD-FIN" },
  ];

  // Mock audit logs data
  const auditLogsData = [
    { timestamp: "2023-10-05 10:15:22", action: "Document Posted", object: "100001234", user: "FF_FUNC_01", details: "Invoice posted successfully" },
    { timestamp: "2023-10-05 10:18:43", action: "Document Viewed", object: "100001234", user: "FF_FUNC_01", details: "Document display accessed" },
  ];

  // Mock change doc logs data
  const changeDocLogsData = [
    { timestamp: "2023-10-05 10:22:15", table: "USR02", field: "LOCK", oldValue: "0", newValue: "1", user: "FF_SEC_02" },
    { timestamp: "2023-10-05 10:35:02", table: "AGR_DEFINE", field: "AGR_NAME", oldValue: "", newValue: "Z_TEST_ROLE", user: "FF_SEC_02" },
  ];

  // Mock deviation details
  const deviatedTcodes = ["SU24", "SM19"];
  const matchedTcodes = request.requestedTcodes;

  const activityAlignment = 85;
  const complianceScore = 75;
  const riskScore = 65;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request Details</DialogTitle>
          <DialogDescription>
            Analysis and insights for ITSM: {request.itsmNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Analysis ID</p>
                  <p className="font-semibold">{request.analysisId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ITSM Number</p>
                  <p className="font-semibold">{request.itsmNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client</p>
                  <p className="font-semibold">{request.client}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System</p>
                  <p className="font-semibold">{request.system}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requested For</p>
                  <p className="font-semibold">{request.requestedFor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requested On Behalf Of</p>
                  <p className="font-semibold">{request.requestedOnBehalfOf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requested Date</p>
                  <p className="font-semibold">{format(new Date(request.requestedDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Used Date</p>
                  <p className="font-semibold">{format(new Date(request.usedDate), "PPP")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Requested TCodes</p>
                <div className="flex flex-wrap gap-2">
                  {request.requestedTcodes.map((tcode, idx) => (
                    <Badge key={idx} variant="outline">{tcode}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                <p className="text-sm mt-1">{request.reason}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activities</p>
                <p className="text-sm mt-1">{request.activities}</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Tabbed Analysis Section */}
          <Tabs defaultValue="transaction" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transaction">Transaction Usage</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="change">Change Doc Logs</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="transaction" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>System</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionUsageData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">{row.timestamp}</TableCell>
                          <TableCell className="font-semibold">{row.transaction}</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell className="font-mono text-xs">{row.user}</TableCell>
                          <TableCell>{row.client}</TableCell>
                          <TableCell>{row.system}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Object</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogsData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">{row.timestamp}</TableCell>
                          <TableCell>{row.action}</TableCell>
                          <TableCell className="font-mono">{row.object}</TableCell>
                          <TableCell className="font-mono text-xs">{row.user}</TableCell>
                          <TableCell>{row.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="change" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Old Value</TableHead>
                        <TableHead>New Value</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {changeDocLogsData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">{row.timestamp}</TableCell>
                          <TableCell className="font-mono">{row.table}</TableCell>
                          <TableCell className="font-mono">{row.field}</TableCell>
                          <TableCell>{row.oldValue || "-"}</TableCell>
                          <TableCell>{row.newValue}</TableCell>
                          <TableCell className="font-mono text-xs">{row.user}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Two Column Layout for Activity Alignment and Ownership */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column - Activity Alignment */}
                    <div className="space-y-4">
                      <Card className="border-primary/20">
                        <CardContent className="pt-6">
                          <h4 className="text-sm font-medium mb-2">Activity Alignment</h4>
                          <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-bold text-primary">{activityAlignment}%</span>
                          </div>
                          <Progress value={activityAlignment} className="mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Match between performed activities and requested purpose
                          </p>
                        </CardContent>
                      </Card>

                      {/* Justification under Activity Alignment */}
                      <Card className="border-primary/20">
                        <CardContent className="pt-6">
                          <h4 className="text-sm font-medium mb-3">Justification</h4>
                          <Badge className="bg-warning text-warning-foreground">Partially</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Ownership */}
                    <div className="space-y-4">
                      <Card className="border-primary/20">
                        <CardContent className="pt-6">
                          <h4 className="text-sm font-medium mb-2">Ownership</h4>
                          <Badge className="bg-primary text-primary-foreground mb-3">IT Users</Badge>
                          <p className="text-xs text-muted-foreground">
                            Primary area of responsibility for performed actions
                          </p>
                        </CardContent>
                      </Card>

                      {/* Risk Score under Ownership */}
                      <Card className="border-warning/20">
                        <CardContent className="pt-6">
                          <h4 className="text-sm font-medium mb-2">Risk Score</h4>
                          <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-bold text-warning">{riskScore}/100</span>
                          </div>
                          <Progress value={riskScore} className="mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Assesses potential risk associated with activities
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Red Flags/Observations */}
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Red Flags/Observations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span>Multiple user profile changes in short time period</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span>Failed authorization check for FB01</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="border-success/20 bg-success/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Review role ZFI_AP_CLERK changes for compliance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Verify that all profile modifications were necessary</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Key Insights */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>User accessed system during business hours only</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>All modifications properly documented in change logs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Transaction pattern consistent with stated objectives</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>No unauthorized access attempts detected</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
