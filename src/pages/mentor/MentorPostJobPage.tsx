import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { jobs } from "@/data/mock-data";
import { MapPin, Calendar, Briefcase, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

const MentorPostJobPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    deadline: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Job posted successfully!");
    setFormData({ title: "", company: "", location: "", type: "", deadline: "", description: "" });
    setShowModal(false);
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
          {jobs.map((j, i) => (
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
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline: {j.deadline}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{j.description}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-2">
                      <Badge variant="secondary">{j.type}</Badge>
                      <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => toast.success("Job deleted")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Post Job Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
            <DialogDescription>Fill in the details to create a new job posting for students.</DialogDescription>
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
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" /> Post Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MentorLayout>
  );
};

export default MentorPostJobPage;
