import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Plus, Trash2, Video, Pencil } from "lucide-react";
import { Swal } from "@/lib/alert";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MentorWebinarsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingWebinarId, setEditingWebinarId] = useState<string | null>(null);
  const [webinarsList, setWebinarsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    max_attendees: "",
    meet_link: "",
  });

  const fetchMyWebinars = async () => {
    try {
      setLoading(true);
      const authUser = api.getAuthUser();
      const mentorName = authUser?.mentor_profile?.full_name || authUser?.student_profile?.full_name || "";
      const allWebinars = await api.getWebinars();
      const myWebinars = allWebinars.filter((w: any) => w.host === mentorName);
      setWebinarsList(myWebinars);
    } catch (error) {
      console.error("Error loading webinars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyWebinars();
  }, []);

  const handleEditClick = (webinar: any) => {
    setFormData({
      title: webinar.title,
      description: webinar.description,
      date: webinar.date,
      time: webinar.time || "",
      max_attendees: webinar.maxAttendees?.toString() || "100",
      meet_link: webinar.meet_link || "",
    });
    setEditingWebinarId(webinar.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      setIsEditMode(false);
      setEditingWebinarId(null);
      setFormData({ title: "", description: "", date: "", time: "", max_attendees: "", meet_link: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.max_attendees || !formData.meet_link) {
      Swal.error("Kolom Tidak Lengkap", "Silakan lengkapi semua kolom yang bertanda bintang.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      max_attendees: parseInt(formData.max_attendees) || 100,
      meet_link: formData.meet_link,
    };

    try {
      if (isEditMode && editingWebinarId) {
        await api.updateWebinar(editingWebinarId, payload);
        await Swal.success("Berhasil", "Webinar berhasil diperbarui!");
      } else {
        await api.createWebinar(payload);
        await Swal.success("Berhasil", "Webinar baru telah sukses dibuat!");
      }
      setFormData({ title: "", description: "", date: "", time: "", max_attendees: "", meet_link: "" });
      setIsEditMode(false);
      setEditingWebinarId(null);
      setShowModal(false);
      fetchMyWebinars();
    } catch (error) {
      Swal.error("Gagal", isEditMode ? "Gagal memperbarui webinar." : "Gagal membuat webinar.");
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await Swal.confirm(
      "Hapus Webinar",
      "Apakah Anda yakin ingin menghapus webinar ini? Tindakan ini tidak dapat dibatalkan.",
      "warning"
    );

    if (!isConfirmed) return;

    try {
      await api.deleteWebinar(id);
      await Swal.success("Berhasil", "Webinar berhasil dihapus!");
      fetchMyWebinars();
    } catch (error) {
      Swal.error("Gagal", "Gagal menghapus webinar.");
    }
  };

  return (
    <MentorLayout title="Webinars">
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Manage and create webinars for students.</p>
          <Button className="gradient-primary text-primary-foreground font-semibold" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Webinar
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">Loading webinars...</div>
        ) : webinarsList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
            You haven't hosted any webinars yet. Click "Create Webinar" to start!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {webinarsList.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="card-elevated h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <h3 className="font-display font-semibold text-foreground mb-1">{w.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{w.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(w.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatTime(w.time)}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {w.attendees}/{w.maxAttendees}</span>
                    </div>
                    {w.meet_link && (
                      <div className="mt-1 mb-4 p-2.5 bg-secondary/30 rounded-lg border border-border/80 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-muted-foreground flex items-center gap-1.5 truncate">
                          <Video className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">{w.meet_link}</span>
                        </span>
                        <a
                          href={w.meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-semibold hover:underline flex-shrink-0"
                        >
                          Open Link
                        </a>
                      </div>
                    )}
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => handleEditClick(w)}
                      >
                        <Pencil className="h-4 w-4 mr-1.5" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleDelete(w.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Webinar Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Webinar" : "Create Webinar"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the details of this webinar event."
                : "Create a new webinar event for students. Fill in the details below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webinar-title">Title</Label>
              <Input
                id="webinar-title"
                placeholder="e.g. Navigating Software Careers"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webinar-desc">Description</Label>
              <Textarea
                id="webinar-desc"
                placeholder="e.g. Tips and roadmap for computer science students..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webinar-date">Date</Label>
                <Input
                  id="webinar-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webinar-time">Time</Label>
                <Input
                  id="webinar-time"
                  placeholder="e.g. 14:00"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webinar-capacity">Capacity</Label>
              <Input
                id="webinar-capacity"
                type="number"
                placeholder="e.g. 100"
                value={formData.max_attendees}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webinar-meet-link">Meeting Link (e.g. Google Meet, Zoom)</Label>
              <Input
                id="webinar-meet-link"
                placeholder="e.g. https://meet.google.com/abc-defg-hij"
                value={formData.meet_link}
                onChange={(e) => setFormData({ ...formData, meet_link: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
                {isEditMode ? (
                  <><Pencil className="h-4 w-4 mr-2" /> Save Changes</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> Create Webinar</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MentorLayout>
  );
};

export default MentorWebinarsPage;
