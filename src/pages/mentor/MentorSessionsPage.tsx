import { MentorLayout } from "@/components/MentorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Swal } from "@/lib/alert";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";

const MentorSessionsPage = () => {
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await api.getMentorshipSessions();
      if (data && data.length > 0) {
        setSessionsList(
          data.map((s: any) => ({
            id: s.id,
            mentee: s.student?.full_name || "Student",
            avatar: s.student?.full_name ? s.student.full_name.substring(0, 2).toUpperCase() : "ST",
            topic: s.topic,
            date: s.date ? s.date.split("T")[0] : "",
            time: s.time,
            duration: s.duration || "45 min",
            status: s.status,
            message: s.message || "No message provided.",
          }))
        );
      } else {
        setSessionsList([
          { id: "1", mentee: "Alex Johnson", avatar: "AJ", topic: "Career Guidance in Tech", date: "2026-04-21", time: "10:00", duration: "45 min", status: "upcoming", message: "I'd love to discuss career paths in software engineering." },
          { id: "2", mentee: "Priya Sharma", avatar: "PS", topic: "Resume Review", date: "2026-04-22", time: "14:00", duration: "30 min", status: "upcoming", message: "Could you review my PM resume?" },
          { id: "3", mentee: "Lisa Wang", avatar: "LW", topic: "Interview Preparation", date: "2026-04-23", time: "11:00", duration: "60 min", status: "upcoming", message: "I have an upcoming interview at Meta." },
          { id: "4", mentee: "James Lee", avatar: "JL", topic: "System Design Discussion", date: "2026-04-15", time: "15:00", duration: "45 min", status: "completed", message: "Thanks for the great session on system design!" }
        ]);
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
        status === "upcoming" ? "Sesi mentoring berhasil disetujui!" : "Sesi mentoring telah ditolak."
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
                              <Badge variant="outline" className="text-xs">{s.duration}</Badge>
                              {s.status === "pending" && <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xl">{s.message}</p>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                          <Button size="sm" className="gradient-primary text-primary-foreground font-semibold" onClick={() => handleUpdateStatus(s.id, "upcoming")}>
                            <CheckCircle className="h-4 w-4 mr-1.5" /> Confirm
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleUpdateStatus(s.id, "declined")}>
                            <XCircle className="h-4 w-4 mr-1.5" /> Decline
                          </Button>
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
                              <Badge variant="outline" className="text-xs">{s.duration}</Badge>
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
    </MentorLayout>
  );
};

export default MentorSessionsPage;
