import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Calendar, Briefcase, Plus, Trash2, Mail, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

const MentorPostJobPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    deadline: "",
    description: "",
    contact_email: "",
  });

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const authUser = api.getAuthUser();
      const mentorName = authUser?.mentor_profile?.full_name || authUser?.student_profile?.full_name || "";
      const allJobs = await api.getJobs();
      const myJobs = allJobs.filter((j: any) => j.postedBy === mentorName);
      setJobsList(myJobs);
    } catch (error) {
      console.error("Error loading my jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleEditClick = (job: any) => {
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
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "",
        deadline: "",
        description: "",
        contact_email: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) {
      Swal.error("Gagal", "Silakan pilih tipe pekerjaan.");
      return;
    }
    try {
      if (isEditMode && editingJobId) {
        await api.updateJob(editingJobId, formData);
        await Swal.success("Berhasil", "Lowongan pekerjaan berhasil diperbarui!");
      } else {
        await api.createJob(formData);
        await Swal.success("Berhasil", "Lowongan pekerjaan berhasil diposting!");
      }
      setFormData({ title: "", company: "", location: "", type: "", deadline: "", description: "", contact_email: "" });
      setIsEditMode(false);
      setEditingJobId(null);
      setShowModal(false);
      fetchMyJobs();
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
      fetchMyJobs();
    } catch (error) {
      Swal.error("Gagal", "Gagal menghapus lowongan pekerjaan.");
    }
  };

  return (
    <MentorLayout title="Post Job">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Manage job opportunities you've shared with students.</p>
          <Button className="gradient-primary text-primary-foreground" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Post Job
          </Button>
        </div>

        {/* Your Posted Jobs */}
        <div className="space-y-4">
          <h3 className="text-base font-display font-semibold text-foreground">Your Posted Jobs</h3>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground animate-pulse">Loading posted jobs...</div>
          ) : jobsList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
              You haven't posted any jobs yet. Click "Post Job" to share an opportunity!
            </div>
          ) : (
            jobsList.map((j, i) => (
              <motion.div key={j.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="card-elevated">
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
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                        <Badge variant="secondary">{j.type}</Badge>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="text-muted-foreground hover:bg-muted" onClick={() => handleEditClick(j)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(j.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Job Posting" : "Post New Job"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the details of this job posting." : "Fill in the details to create a new job posting for students."}
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
                {isEditMode ? <><Pencil className="h-4 w-4 mr-2" /> Save Changes</> : <><Plus className="h-4 w-4 mr-2" /> Post Job</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MentorLayout>
  );
};

export default MentorPostJobPage;
