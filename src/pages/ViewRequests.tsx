import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Eye, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import RequestDetailsModal from "@/components/RequestDetailsModal";
import { getAllRequests, RequestListItem } from "@/api/viewRequestapi";

const ViewRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestListItem[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
      setRequests(data);
      console.log('Loaded requests:', data);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchRequests();
      toast.success('Requests refreshed');
    } catch (error: any) {
      toast.error('Failed to refresh: ' + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewDetails = (analysisId: string) => {
    setSelectedRequestId(analysisId);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PP");
    } catch (error) {
      return dateString; // Return as-is if formatting fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

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
                <p className="text-muted-foreground text-lg mb-4">No requests found</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Get started by creating your first firefighter access request
                </p>
                <Button
                  onClick={() => navigate("/create")}
                  className="px-6"
                >
                  Create Your First Request
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {requests.length} request{requests.length !== 1 ? 's' : ''}
                </div>
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
                    {[...requests].reverse().map((request) => (
                      <TableRow key={request.analysisId} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{request.analysisId}</TableCell>
                        <TableCell>{request.itsmNumber}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.client}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {request.system}
                          </span>
                        </TableCell>
                        <TableCell>{request.requestedFor}</TableCell>
                        <TableCell>{formatDate(request.requestedDate)}</TableCell>
                        <TableCell>{formatDate(request.usedDate)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(request.analysisId)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
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

      {selectedRequestId && (
        <RequestDetailsModal
          analysisId={selectedRequestId}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ViewRequests;