import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, TrendingUp, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";

interface Request {
  id: string;
  ritmNumber: string;
  name: string;
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
  // Mock analysis data
  const deviationData = [
    { name: "Requested", value: 85, color: "hsl(var(--primary))" },
    { name: "Deviated", value: 15, color: "hsl(var(--accent))" },
  ];

  const necessityData = [
    { name: "Required Firefighter", value: 60, color: "hsl(var(--destructive))" },
    { name: "Standard User", value: 40, color: "hsl(var(--success))" },
  ];

  const riskScore = 35; // Mock risk score
  const getRiskLevel = (score: number) => {
    if (score < 30) return { label: "Low", color: "success" };
    if (score < 60) return { label: "Medium", color: "warning" };
    return { label: "High", color: "destructive" };
  };

  const risk = getRiskLevel(riskScore);

  // Mock deviation details
  const deviatedTcodes = ["SU24", "SM19"];
  const matchedTcodes = request.requestedTcodes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request Details</DialogTitle>
          <DialogDescription>
            Analysis and insights for RITM: {request.ritmNumber}
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
                  <p className="text-sm font-medium text-muted-foreground">RITM Number</p>
                  <p className="font-semibold">{request.ritmNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-semibold">{request.name}</p>
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

          {/* Analysis Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                Comparison of audit logs with requested transaction codes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-success/20 bg-success/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Matched TCodes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {matchedTcodes.map((tcode, idx) => (
                        <Badge key={idx} className="bg-success text-success-foreground">
                          {tcode}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-accent/20 bg-accent/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-accent" />
                      Deviations Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {deviatedTcodes.map((tcode, idx) => (
                        <Badge key={idx} className="bg-accent text-accent-foreground">
                          {tcode}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      These transaction codes were used but not originally requested
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Section */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Advanced analysis of request patterns and risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Score */}
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed" style={{ borderColor: `hsl(var(--${risk.color}))` }}>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Assessment Score</p>
                  <p className="text-3xl font-bold mt-1">{riskScore}%</p>
                </div>
                <Badge
                  className="text-lg px-4 py-2"
                  style={{
                    backgroundColor: `hsl(var(--${risk.color}))`,
                    color: `hsl(var(--${risk.color}-foreground))`,
                  }}
                >
                  {risk.label} Risk
                </Badge>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Activity Deviation Analysis</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={deviationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {deviationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Comparison of activities performed vs. reason provided
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Access Necessity Assessment</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={necessityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {necessityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Analysis of whether standard user access could suffice
                  </p>
                </div>
              </div>

              {/* Key Findings */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Key Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>85% of activities matched the stated reason and planned activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>2 unexpected transaction codes were used, suggesting scope creep</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <span>40% of performed tasks could have been completed with standard user access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
