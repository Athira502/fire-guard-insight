import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/50 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Firefighter Request Analysis
              </h1>
              <p className="text-sm text-muted-foreground">SAP Access Management System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Welcome to Firefighter Analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your SAP firefighter access requests with intelligent analysis and insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50" onClick={() => navigate("/create")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Plus className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Create Request</CardTitle>
                <CardDescription className="text-base">
                  Submit a new firefighter access request with detailed information and supporting logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Enter RITM details and dates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Specify transaction codes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Upload audit and change logs
                  </li>
                </ul>
                <Button className="w-full mt-6 group-hover:bg-primary-glow transition-colors">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-accent/50" onClick={() => navigate("/requests")}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <FileText className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl">View Requests</CardTitle>
                <CardDescription className="text-base">
                  Browse, analyze, and review all submitted firefighter requests with AI-powered insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    View request history
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Analyze log deviations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Get AI risk assessments
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground group-hover:shadow-md transition-all">
                  Browse Requests
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 bg-muted/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">About This System</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                The Firefighter Request Analysis tool helps SAP administrators manage and analyze emergency access requests.
                Our intelligent system compares audit logs against requested activities to identify deviations and assess risk levels.
              </p>
              <p className="font-medium text-foreground">
                Key Features: Automated log analysis • Deviation detection • AI-powered risk scoring • Access necessity assessment
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
