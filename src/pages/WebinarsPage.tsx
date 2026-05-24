import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { Swal } from "@/lib/alert";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";

const WebinarsPage = () => {
  const [webinarsList, setWebinarsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const data = await api.getWebinars();
      setWebinarsList(data);
    } catch (error) {
      console.error("Error loading webinars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const handleRegister = async (w: any) => {
    const isConfirmed = await Swal.confirm(
      "Konfirmasi Pendaftaran",
      `Apakah Anda yakin ingin mendaftar ke webinar "${w.title}"?`,
      "info"
    );

    if (!isConfirmed) return;

    try {
      await api.registerWebinar(w.id);
      await Swal.success("Berhasil", "Anda berhasil mendaftar ke webinar!");
      fetchWebinars();
    } catch (error) {
      Swal.error("Gagal", "Gagal mendaftar ke webinar.");
    }
  };

  return (
    <DashboardLayout title="Webinars">
      <div className="space-y-6 w-full">
        <p className="text-muted-foreground">Upcoming webinars and events hosted by alumni.</p>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">
            Loading webinars...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {webinarsList.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="card-elevated h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <h3 className="font-display font-semibold text-foreground mb-1">{w.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{w.description}</p>
                    <p className="text-sm text-primary font-medium mb-3">Hosted by {w.host}</p>
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
                          Join Link
                        </a>
                      </div>
                    )}
                    <Button onClick={() => handleRegister(w)} className="mt-auto gradient-primary text-primary-foreground font-semibold h-10">
                      Register
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WebinarsPage;
