import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Eye } from "lucide-react";
import { format } from "date-fns";
import RequestDetailsModal from "@/components/RequestDetailsModal";

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

const ViewRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedRequests = localStorage.getItem("firefighterRequests");
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">
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
              Firefighter Requests
            </CardTitle>
            <CardDescription>
              View and analyze all submitted firefighter access requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No requests found</p>
                <Button
                  onClick={() => navigate("/create")}
                  className="mt-4"
                >
                  Create Your First Request
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Analysis ID</TableHead>
                      <TableHead>ITSM Number</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Requested For</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Used Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.analysisId}</TableCell>
                        <TableCell>{request.itsmNumber}</TableCell>
                        <TableCell>{request.client}</TableCell>
                        <TableCell>{request.system}</TableCell>
                        <TableCell>{request.requestedFor}</TableCell>
                        <TableCell>{format(new Date(request.requestedDate), "PP")}</TableCell>
                        <TableCell>{format(new Date(request.usedDate), "PP")}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ViewRequests;
