import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Mail, MapPin, Briefcase, GraduationCap, Plus, Trash2, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const iconMap = {
  education: GraduationCap,
  job: Briefcase,
  promotion: TrendingUp,
};

const colorMap = {
  education: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
  job: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  promotion: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
};

const MentorProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    title: "",
    company: "",
    location: "",
    graduationYear: "",
    bio: "",
  });

  const [milestones, setMilestones] = useState<any[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    year: "",
    title: "",
    org: "",
    type: "job" as "education" | "job" | "promotion",
  });

  const fetchMilestones = async (mentorId: string) => {
    try {
      setLoadingMilestones(true);
      const data = await api.getCareerPathById(mentorId);
      if (data && data.timeline) {
        // Sort milestones by year descending (latest first) or ascending.
        // Usually career paths are sorted latest first or oldest first. Let's do latest first
        const sorted = [...data.timeline].sort((a, b) => b.year.localeCompare(a.year));
        setMilestones(sorted);
      } else {
        setMilestones([]);
      }
    } catch (error) {
      console.error("Error loading career milestones:", error);
    } finally {
      setLoadingMilestones(false);
    }
  };

  useEffect(() => {
    const authUser = api.getAuthUser();
    setUser(authUser);
    if (authUser) {
      const profile = authUser.mentor_profile || authUser.student_profile || {};
      setFormData({
        fullName: profile.full_name || "",
        email: authUser.email || "",
        title: profile.title || "",
        company: profile.company || "",
        location: profile.location || "",
        graduationYear: profile.graduation_year?.toString() || "",
        bio: profile.bio || "",
      });

      if (authUser.mentor_profile?.id) {
        fetchMilestones(authUser.mentor_profile.id);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const updatedUser = await api.updateProfile({
        full_name: formData.fullName,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        graduation_year: formData.graduationYear ? parseInt(formData.graduationYear) : null,
        bio: formData.bio,
      });
      setUser(updatedUser);
      // Sync formData from the returned DB values
      const profile = updatedUser.mentor_profile || updatedUser.student_profile || {};
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        title: profile.title || "",
        company: profile.company || "",
        location: profile.location || "",
        graduationYear: profile.graduation_year?.toString() || "",
        bio: profile.bio || "",
      }));
      Swal.success("Berhasil", "Profil Anda berhasil diperbarui!");
    } catch (error: any) {
      Swal.error("Gagal", error.message || "Gagal memperbarui profil.");
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.year || !milestoneForm.title || !milestoneForm.org || !milestoneForm.type) {
      Swal.error("Gagal", "Semua kolom wajib diisi.");
      return;
    }
    try {
      await api.createCareerMilestone(milestoneForm);
      await Swal.success("Berhasil", "Milestone karir berhasil ditambahkan!");
      setShowAddMilestone(false);
      setMilestoneForm({ year: "", title: "", org: "", type: "job" });
      if (user?.mentor_profile?.id) {
        fetchMilestones(user.mentor_profile.id);
      }
    } catch (error: any) {
      Swal.error("Gagal", error.message || "Gagal menambahkan milestone karir.");
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    const confirmed = await Swal.confirm(
      "Hapus Milestone",
      "Apakah Anda yakin ingin menghapus milestone karir ini?",
      "warning"
    );
    if (!confirmed) return;
    try {
      await api.deleteCareerMilestone(id);
      await Swal.success("Berhasil", "Milestone karir berhasil dihapus!");
      if (user?.mentor_profile?.id) {
        fetchMilestones(user.mentor_profile.id);
      }
    } catch (error: any) {
      Swal.error("Gagal", error.message || "Gagal menghapus milestone karir.");
    }
  };

  const initialAvatar = formData.fullName ? formData.fullName.substring(0, 2).toUpperCase() : "";

  return (
    <MentorLayout title="Profile">
      <div className="space-y-6 w-full max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initialAvatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold text-foreground">{formData.fullName || "Loading..."}</h2>
                  {(formData.title || formData.company) && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" /> {formData.title}{formData.title && formData.company && " at "}{formData.company}
                    </p>
                  )}
                  {formData.location && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                      <MapPin className="h-4 w-4 text-primary" /> {formData.location}
                    </p>
                  )}
                  {formData.graduationYear && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                      <GraduationCap className="h-4 w-4 text-primary" /> Graduated in {formData.graduationYear}
                    </p>
                  )}
                  <p className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
                    <Mail className="h-4 w-4 text-primary" /> {formData.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Edit Profile Column */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2 space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base font-display font-semibold">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                      <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Job Title</label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                      <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
                      <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Graduation Year</label>
                      <Input value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Bio</label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="gradient-primary text-primary-foreground font-semibold h-11 w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Career Path & Milestones Column */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1">
            <Card className="card-elevated h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base font-display font-semibold">Career Path</CardTitle>
                <Button onClick={() => setShowAddMilestone(true)} size="sm" className="gradient-primary text-primary-foreground font-semibold h-8 text-xs px-2.5">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-start">
                {loadingMilestones ? (
                  <div className="text-center py-12 text-muted-foreground animate-pulse">Loading career paths...</div>
                ) : milestones.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50 flex-1 flex flex-col items-center justify-center p-4">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-muted-foreground/45" />
                    <p className="text-sm font-semibold">Belum Ada Milestone</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">Tambahkan pencapaian karir atau pendidikan Anda di sini.</p>
                  </div>
                ) : (
                  <div className="relative pl-5 border-l-2 border-border/80 space-y-6 ml-2.5 mt-2 flex-1 pb-4">
                    {milestones.map((milestone) => {
                      const Icon = iconMap[milestone.type as keyof typeof iconMap] || Briefcase;
                      const color = colorMap[milestone.type as keyof typeof colorMap] || "bg-primary/10 text-primary border border-primary/20";
                      return (
                        <div key={milestone.id} className="relative">
                          {/* Dot / Icon */}
                          <div className={`absolute -left-[33px] top-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-background z-10 ${color}`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          {/* Content */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-semibold text-primary">{milestone.year}</span>
                              <h4 className="font-semibold text-foreground text-sm leading-tight mt-0.5 truncate" title={milestone.title}>
                                {milestone.title}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate" title={milestone.org}>
                                {milestone.org}
                              </p>
                              <span className="inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-1.5 bg-muted text-muted-foreground border border-border/50">
                                {milestone.type}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0 flex-shrink-0"
                              onClick={() => handleDeleteMilestone(milestone.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Add Career Milestone Modal */}
      <Dialog open={showAddMilestone} onOpenChange={setShowAddMilestone}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Career Milestone</DialogTitle>
            <DialogDescription>Catat pencapaian karir, promosi, atau riwayat pendidikan Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMilestone} className="space-y-4 py-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Tahun</label>
                <Input
                  placeholder="e.g. 2026"
                  maxLength={4}
                  value={milestoneForm.year}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Jenis Milestone</label>
                <Select value={milestoneForm.type} onValueChange={(v: any) => setMilestoneForm({ ...milestoneForm, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job / Pekerjaan</SelectItem>
                    <SelectItem value="education">Education / Pendidikan</SelectItem>
                    <SelectItem value="promotion">Promotion / Promosi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Judul / Posisi / Gelar</label>
              <Input
                placeholder="e.g. Senior Software Engineer"
                value={milestoneForm.title}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Perusahaan / Universitas / Organisasi</label>
              <Input
                placeholder="e.g. Google"
                value={milestoneForm.org}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, org: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                <Plus className="h-4 w-4 mr-2" /> Add Milestone
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MentorLayout>
  );
};

export default MentorProfilePage;
