import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Calendar, Briefcase, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const JobsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    deadline: "",
    description: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobs();
      setJobsList(data);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) {
      Swal.error("Gagal", "Silakan pilih tipe pekerjaan terlebih dahulu.");
      return;
    }
    try {
      await api.createJob(formData);
      await Swal.success("Berhasil", "Lowongan pekerjaan berhasil dibagikan!");
      setFormData({ title: "", company: "", location: "", type: "", deadline: "", description: "" });
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      Swal.error("Gagal", "Gagal memposting lowongan pekerjaan.");
    }
  };

  return (
    <DashboardLayout title="Job Referrals">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Opportunities shared by alumni in the network.</p>
          <Button className="gradient-primary text-primary-foreground" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Post Job
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">
            Loading job referrals...
          </div>
        ) : (
          <div className="space-y-4">
            {jobsList.map((j, i) => (
              <motion.div key={j.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="card-elevated cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedJob(j)}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-foreground">{j.title}</h3>
                          <p className="text-sm text-primary font-medium">{j.company}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline: {j.deadline}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{j.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Posted by {j.postedBy}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2">
                        <Badge variant="secondary">{j.type}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <DialogDescription>Fill in the details to create a new job posting.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Job Title</label>
              <Input
                placeholder="e.g. Software Engineer Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
              <Input
                placeholder="e.g. Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
              <Input
                placeholder="e.g. Mountain View, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Job Type</label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Application Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Describe the role and requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                <Plus className="h-4 w-4 mr-2" /> Post Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Details Modal */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
                <DialogDescription>{selectedJob.company}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Deadline: {selectedJob.deadline}</span>
                  <Badge variant="secondary">{selectedJob.type}</Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Posted By</h4>
                  <p className="text-sm text-muted-foreground">{selectedJob.postedBy}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default JobsPage;
