import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Calendar, Briefcase, Plus, Mail, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/format";

const JobsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    deadline: "",
    description: "",
    contact_email: "",
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
    const user = api.getAuthUser();
    setCurrentUser(user);
    fetchJobs();
  }, []);

  const handleEditClick = (e: React.MouseEvent, job: any) => {
    e.stopPropagation();
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      deadline: job.deadline,
      description: job.description,
      contact_email: job.contactEmail || "",
    });
    setEditingJobId(job.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      setIsEditMode(false);
      setEditingJobId(null);
      setFormData({ title: "", company: "", location: "", type: "", deadline: "", description: "", contact_email: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) {
      Swal.error("Gagal", "Silakan pilih tipe pekerjaan terlebih dahulu.");
      return;
    }
    try {
      if (isEditMode && editingJobId) {
        await api.updateJob(editingJobId, formData);
        await Swal.success("Berhasil", "Lowongan pekerjaan berhasil diperbarui!");
      } else {
        await api.createJob(formData);
        await Swal.success("Berhasil", "Lowongan pekerjaan berhasil dibagikan!");
      }
      setFormData({ title: "", company: "", location: "", type: "", deadline: "", description: "", contact_email: "" });
      setIsEditMode(false);
      setEditingJobId(null);
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      Swal.error("Gagal", isEditMode ? "Gagal memperbarui lowongan pekerjaan." : "Gagal memposting lowongan pekerjaan.");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await Swal.confirm(
      "Hapus Lowongan",
      "Apakah Anda yakin ingin menghapus postingan lowongan pekerjaan ini?",
      "warning"
    );
    if (!isConfirmed) return;
    try {
      await api.deleteJob(id);
      await Swal.success("Berhasil", "Postingan lowongan pekerjaan berhasil dihapus!");
      fetchJobs();
    } catch (error) {
      Swal.error("Gagal", "Gagal menghapus lowongan pekerjaan.");
    }
  };

  const currentUserName = currentUser?.student_profile?.full_name || currentUser?.mentor_profile?.full_name || "";
  const myJobs = jobsList.filter((j: any) => j.postedBy === currentUserName);

  const JobCard = ({ j, i, isOwner = false }: { j: any; i: number; isOwner?: boolean }) => (
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
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline: {formatDate(j.deadline)}</span>
                  {j.contactEmail && (
                    <span className="flex items-center gap-1 text-primary/80">
                      <Mail className="h-3.5 w-3.5" /> {j.contactEmail}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{j.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isOwner ? "Posted by you" : `Posted by ${j.postedBy}`}
                </p>
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
              <Badge variant="secondary">{j.type}</Badge>
              {isOwner ? (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-muted"
                    onClick={(e) => handleEditClick(e, j)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => { e.stopPropagation(); handleDelete(j.id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                j.contactEmail && (
                  <a
                    href={`mailto:${j.contactEmail}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-semibold transition-colors"
                  >
                    <Mail className="h-3 w-3" /> Apply
                  </a>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout title="Job Referrals">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Opportunities shared by alumni in the network.</p>
          <Button className="gradient-primary text-primary-foreground" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Post Job
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full space-y-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">Your Posted Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground animate-pulse">Loading job referrals...</div>
            ) : jobsList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
                No job referrals available.
              </div>
            ) : (
              <div className="space-y-4">
                {jobsList.map((j, i) => <JobCard key={j.id} j={j} i={i} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-jobs" className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground animate-pulse">Loading your posted jobs...</div>
            ) : myJobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
                You haven't posted any jobs yet. Click "Post Job" to share an opportunity!
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map((j, i) => <JobCard key={j.id} j={j} i={i} isOwner />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Post / Edit Job Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Job Posting" : "Post New Job"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the details of this job posting." : "Fill in the details to create a new job posting."}
            </DialogDescription>
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
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Contact Email <span className="text-muted-foreground font-normal">(for applications)</span>
              </label>
              <Input
                type="email"
                placeholder="e.g. recruiter@company.com"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
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
                {isEditMode
                  ? <><Pencil className="h-4 w-4 mr-2" /> Save Changes</>
                  : <><Plus className="h-4 w-4 mr-2" /> Post Job</>
                }
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
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Deadline: {formatDate(selectedJob.deadline)}</span>
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
                {selectedJob.contactEmail && (
                  <div>
                    <h4 className="font-medium mb-2">How to Apply</h4>
                    <a
                      href={`mailto:${selectedJob.contactEmail}`}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity"
                    >
                      <Mail className="h-4 w-4" /> Send Application to {selectedJob.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default JobsPage;
