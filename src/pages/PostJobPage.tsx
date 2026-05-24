import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Swal } from "@/lib/alert";

const PostJobPage = () => {
  const navigate = useNavigate();
  const [jobType, setJobType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await Swal.success("Berhasil", "Rujukan lowongan pekerjaan berhasil dibagikan!");
    navigate("/jobs");
  };

  return (
    <DashboardLayout title="Post Job Referral">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display">Post a Job Referral</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input placeholder="e.g. Software Engineer Intern" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input placeholder="e.g. Google" required />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="e.g. San Francisco, CA" required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Job description and requirements..." rows={4} required />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                Post Job Referral
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PostJobPage;
