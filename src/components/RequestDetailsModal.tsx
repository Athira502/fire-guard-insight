

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getRequestDetails, RequestDetails } from "@/api/viewRequestapi";

interface RequestDetailsModalProps {
  analysisId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestDetailsModal = ({ analysisId, open, onOpenChange }: RequestDetailsModalProps) => {
  const [details, setDetails] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && analysisId) {
      fetchDetails();
    }
  }, [open, analysisId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getRequestDetails(analysisId);
      setDetails(data);
      console.log('Request details loaded:', data);
    } catch (error: any) {
      console.error('Error fetching details:', error);
      toast.error('Failed to load request details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request Details</DialogTitle>
          <DialogDescription>
            Analysis and Insights for ITSM: {details?.itsmNumber || analysisId}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
            <span>Loading details...</span>
          </div>
        ) : details ? (
          <div className="space-y-6">
            {/* Request Information */}
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Analysis ID</p>
                    <p className="font-semibold">{details.analysisId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ITSM Number</p>
                    <p className="font-semibold">{details.itsmNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-semibold">{details.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">System</p>
                    <p className="font-semibold">{details.system}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requested For</p>
                    <p className="font-semibold">{details.requestedFor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requested On Behalf Of</p>
                    <p className="font-semibold">{details.requestedOnBehalfOf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Requested Date</p>
                    <p className="font-semibold">{details.requestedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Used Date</p>
                    <p className="font-semibold">{details.usedDate}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">Requested TCodes</p>
                    <div className="flex flex-wrap gap-2">
                      {details.tcodes.split(',').map((tcode, idx) => (
                        <Badge key={idx} variant="secondary">{tcode.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="text-sm mt-1">{details.reason}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Activities</p>
                    <p className="text-sm mt-1">{details.activities}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Logs and Analysis */}
            <Tabs defaultValue="transaction" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transaction">
                  Transaction Usage
                  {details.transactionUsage.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {details.transactionUsage.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="audit">
                  Audit Logs
                  {details.auditLogs.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {details.auditLogs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="change">
                  Change Doc Logs
                  {details.changeDocLogs.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {details.changeDocLogs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              {/* Transaction Usage Tab */}
              <TabsContent value="transaction" className="mt-4">
                {details.transactionUsage.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transaction logs available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Transaction</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>System</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {details.transactionUsage.map((tu, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm">{tu.timestamp}</TableCell>
                            <TableCell><Badge>{tu.transaction}</Badge></TableCell>
                            <TableCell className="text-sm">{tu.description}</TableCell>
                            <TableCell className="text-sm">{tu.user}</TableCell>
                            <TableCell className="text-sm">{tu.client}</TableCell>
                            <TableCell className="text-sm">{tu.system}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Audit Logs Tab */}
              <TabsContent value="audit" className="mt-4">
                {details.auditLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No audit logs available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Terminal</TableHead>
                          <TableHead>Transaction</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                     
                      <TableBody>
                        {details.auditLogs.map((log, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm">{log.timestamp}</TableCell>
                            <TableCell className="text-sm">{log.action}</TableCell>
                            <TableCell className="text-sm">{log.terminal}</TableCell>
                            <TableCell className="text-sm">{log.object}</TableCell>
                            <TableCell className="text-sm">{log.program}</TableCell>
                            <TableCell className="text-sm max-w-xs truncate">{log.details}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Change Doc Logs Tab */}
              <TabsContent value="change" className="mt-4">
                {details.changeDocLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No change document logs available</p>
                ) : (
                  <div className="overflow-x-auto">
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
                        {details.changeDocLogs.map((log, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm">{log.timestamp}</TableCell>
                            <TableCell><Badge variant="outline">{log.table}</Badge></TableCell>
                            <TableCell className="text-sm">{log.field}</TableCell>
                            <TableCell className="text-sm">{log.oldValue || '-'}</TableCell>
                            <TableCell className="text-sm">{log.newValue || '-'}</TableCell>
                            <TableCell className="text-sm">{log.user}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activity Alignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold">{details.aiInsights.activityAlignment}%</span>
                        <div className="w-full max-w-xs ml-4">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${details.aiInsights.activityAlignment}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Match between requested activities and requested purpose
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ownership</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="text-lg px-4 py-2">{details.aiInsights.ownership}</Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Primary area of responsibility
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Justification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant={details.aiInsights.justification === 'Justified' ? 'default' : 'secondary'}
                        className="text-lg px-4 py-2"
                      >
                        {details.aiInsights.justification}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Match between activities and purpose
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Risk Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold">{details.aiInsights.riskScore}/100</span>
                        <div className="w-full max-w-xs ml-4">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                details.aiInsights.riskScore > 70 ? 'bg-red-500' : 
                                details.aiInsights.riskScore > 40 ? 'bg-yellow-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${details.aiInsights.riskScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Assessed potential risk
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {details.aiInsights.redFlags.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-lg text-red-900">Red Flags/Observations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {details.aiInsights.redFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-900">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {details.aiInsights.recommendations.length > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-lg text-green-900">Recommendations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {details.aiInsights.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-900">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {details.aiInsights.keyInsights.length > 0 && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-900">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {details.aiInsights.keyInsights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span className="text-sm text-blue-900">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Failed to load request details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;