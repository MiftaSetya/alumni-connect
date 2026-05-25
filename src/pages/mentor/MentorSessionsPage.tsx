import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, Video } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";

const MentorSessionsPage = () => {
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await api.getMentorshipSessions();
      if (data && data.length > 0) {
        setSessionsList(
          data.map((s: any) => ({
            id: s.id,
            mentee: s.student_name || s.student?.studentProfile?.full_name || s.student?.full_name || "Student",
            avatar: (s.student_name || s.student?.studentProfile?.full_name || s.student?.full_name || "ST").substring(0, 2).toUpperCase(),
            topic: s.topic,
            date: s.date ? s.date.split("T")[0] : "",
            time: s.time,
            status: s.status,
            meet_link: s.meet_link,
            message: s.message || "No message provided.",
          }))
        );
      } else {
        setSessionsList([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleConfirmClick = (id: string) => {
    setSelectedSessionId(id);
    setMeetLink("");
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !meetLink) return;
    try {
      await api.updateSessionStatus(selectedSessionId, "upcoming", meetLink);
      await Swal.success("Berhasil", "Sesi mentoring berhasil disetujui!");
      setShowConfirmModal(false);
      fetchSessions();
    } catch (error) {
      Swal.error("Gagal", "Gagal menyetujui sesi mentoring.");
    }
  };

  const handleUpdateStatus = async (id: string, status: "pending" | "upcoming" | "completed" | "declined") => {
    if (status === "declined") {
      const isConfirmed = await Swal.confirm(
        "Tolak Sesi",
        "Apakah Anda yakin ingin menolak pendaftaran sesi mentoring ini?",
        "warning"
      );
      if (!isConfirmed) return;
    }

    try {
      await api.updateSessionStatus(id, status);
      await Swal.success(
        "Berhasil",
        status === "completed" ? "Sesi mentoring telah diselesaikan!" : "Sesi mentoring telah ditolak."
      );
      fetchSessions();
    } catch (error) {
      Swal.error("Gagal", "Gagal memperbarui status sesi mentoring.");
    }
  };

  const upcoming = sessionsList.filter((s) => s.status === "upcoming" || s.status === "pending");
  const completed = sessionsList.filter((s) => s.status === "completed");

  return (
    <MentorLayout title="Mentoring Sessions">
      <div className="space-y-8 w-full">
        {/* Upcoming Sessions */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Upcoming Sessions
            <Badge variant="secondary" className="ml-2 text-xs">{upcoming.length}</Badge>
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-6 text-muted-foreground animate-pulse">Loading sessions...</div>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg bg-card/50">
                No upcoming mentoring sessions.
              </div>
            ) : (
              upcoming.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="card-elevated">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{s.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-display font-semibold text-foreground">{s.topic}</h3>
                            <p className="text-sm text-primary font-medium">{s.mentee}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(s.date)}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatTime(s.time)}</span>
                              {s.status === "pending" && <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xl">{s.message}</p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-stretch gap-2 flex-shrink-0 min-w-[120px]">
                          {s.status === "pending" ? (
                            <>
                              <Button size="sm" className="gradient-primary text-primary-foreground font-semibold w-full" onClick={() => handleConfirmClick(s.id)}>
                                <CheckCircle className="h-4 w-4 mr-1.5" /> Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 w-full" onClick={() => handleUpdateStatus(s.id, "declined")}>
                                <XCircle className="h-4 w-4 mr-1.5" /> Decline
                              </Button>
                            </>
                          ) : s.status === "upcoming" ? (
                            <>
                              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold w-full" onClick={() => handleUpdateStatus(s.id, "completed")}>
                                <CheckCircle className="h-4 w-4 mr-1.5" /> Complete
                              </Button>
                              {s.meet_link && (
                                <a
                                  href={s.meet_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 text-xs h-9 px-3 rounded-md bg-secondary/80 hover:bg-secondary text-foreground border font-semibold transition-colors w-full"
                                >
                                  <Video className="h-3.5 w-3.5" /> Join Meet
                                </a>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Completed Sessions */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Completed Sessions
            <Badge variant="secondary" className="ml-2 text-xs">{completed.length}</Badge>
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-6 text-muted-foreground animate-pulse">Loading completed sessions...</div>
            ) : completed.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg bg-card/50">
                No completed sessions found.
              </div>
            ) : (
              completed.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="card-elevated opacity-80">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{s.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-display font-semibold text-foreground">{s.topic}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{s.mentee}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(s.date)}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatTime(s.time)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xl">{s.message}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          <CheckCircle className="h-3 w-3 mr-1" /> Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for GMeet Link */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleConfirmSubmit}>
            <DialogHeader>
              <DialogTitle>Confirm Mentoring Session</DialogTitle>
              <DialogDescription>
                Provide a meeting link (Google Meet, Zoom, etc.) for the student to join this mentoring session.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="meet_link" className="text-sm font-medium">Meeting Link</Label>
                <Input
                  id="meet_link"
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  type="url"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary text-primary-foreground">
                Confirm & Send Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MentorLayout>
  );
};

export default MentorSessionsPage;
